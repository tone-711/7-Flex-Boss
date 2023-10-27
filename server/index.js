import { createServer } from "http";
import crypto from "crypto";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";

import users from "./services/data/user.js";
import stores from "./services/data/store.js";
import shifts from "./services/data/shift.js";
import bookings from "./services/data/booking.js";

import jwt from "jsonwebtoken";
import Geocodio from "geocodio-library-node";
import "dotenv/config";

const geocoder = new Geocodio(process.env.GEOCODIO_API_KEY);

async function HashPW(password) {
  return new Promise((resolve, reject) => {
    // generate random 16 bytes long salt
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

async function VerifyPW(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString("hex"));
    });
  });
}

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
const httpServer = createServer(app);
httpServer.keepAliveTimeout = 120 * 1000;
httpServer.headersTimeout = 120 * 1000;

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});

app.get("/", (req, res) => res.type("html").send(html));

io.on("connection", async (socket) => {
  console.log("a user connected");

  socket.on("get users", async () => {
    const result = await users.getall();

    socket.emit("get users response", result);
  });

  socket.on(
    "register user",
    async ({
      username,
      password,
      employeeId,
      email,
      mobilePhone,
      role = "manager",
    }) => {
      const hash = await HashPW(password);

      const result = await users.update(username, {
        username: username,
        password: hash,
        employeeId: employeeId,
        email: email,
        mobilePhone: mobilePhone,
        socket: null,
        role: role,
      });

      console.log(result);

      if (result.upsertedId) {
        socket.emit("register user response", {
          success: true,
          msg: "user registered",
        });
      } else {
        socket.emit("register user response", {
          success: false,
          msg: "user exists",
        });
      }
    }
  );

  // endpoint get available shifts
  socket.on("get available shifts", async () => {
    const result = await shifts.getAvailable();
    socket.emit("get available shifts response", result);
  });
  // endpoint get shifts by store
  socket.on("get shifts by store", async ({ storeId }) => {
    const result = await shifts.getByStore(storeId);
    socket.emit("get shifts by store response", result);
  });
  // endpoint create shift
  socket.on(
    "create shift",
    async ({
      storeId,
      payRate,
      startDate,
      endDate,
      availableCount,
      headCount,
    }) => {
      const result = await shifts.create({
        storeId: storeId,
        payRate: payRate,
        startDate: startDate,
        endDate: endDate,
        availableCount: availableCount,
        headCount: headCount,
      });
      socket.emit("create shift response", result);
      io.to("associate").emit("Updated Shifts");
    }
  );
  // endpoint udpate shift
  socket.on(
    "update shift",
    async (
      id,
      { storeId, payRate, startDate, endDate, availableCount, headCount }
    ) => {
      const result = await shifts.update(id, {
        storeId: storeId,
        payRate: payRate,
        startDate: startDate,
        endDate: endDate,
        availableCount: availableCount,
        headCount: headCount,
      });
      socket.emit("update shift response", result);
    }
  );
  // endpoint delete shift
  socket.on("update shift", async (id) => {
    const result = await shifts.delete(id);
    socket.emit("delete shift response", result);
  });

  // endpoint get users
  socket.on("get users", async () => {
    const result = await users.getall();
    socket.emit("get users response", result);
  });
  // endpoint delete user
  socket.on("delete user", async ({ username }) => {
    const result = await users.delete(username);
    socket.emit("delete user response", result);
  });

  socket.on("login", async ({ username, password }) => {
    // send a private message to the socket with the given it
    const curUser = await users.get(username);
    if (curUser) {
      const checkPW = await VerifyPW(password, curUser.password);

      if (checkPW === true) {
        const token = await jwt.sign(
          { username: username },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );

        await users.update(username, { socket: socket.id });
        socket.join(curUser.role);

        socket.emit("login response", { success: true, token: token });
      } else {
        socket.emit("login response", { success: false });
      }
    } else {
      socket.emit("login response", { success: false });
    }
  });

  socket.on("refresh session", async ({ token }) => {
    // send a private message to the socket with the given it

    try {
      const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET);

      const curUser = await users.get(verifiedToken.username);
      await users.update(verifiedToken.username, { socket: socket.id });
      socket.join(curUser.role);

      socket.emit("refresh session response", { success: true });
    } catch (e) {
      socket.emit("refresh session response", { success: false, error: e });
    }
  });

  socket.on("get bookings by username", async ({ username }) => {
    const results = await bookings.getByUserName(username);

    socket.emit("get bookings by username response", {
      success: true,
      stores: results,
    });
  });

  socket.on("book shift", async ({ username, shiftId }) => {
    try {
      const curShift = await shifts.get(shiftId);

      if (curShift) {
        const result = await bookings.create({
          storeId: curShift.storeId,
          shiftId: shiftId,
          startDate: curShift.startDate,
          endDate: curShift.endDate,
          username: username,
          payRate: curShift.payRate,
        });

        await shifts.update(shiftId, {
          availableSlots: curShift.availableSlots - 1,
        });

        console.log(result);

        socket.emit("book shift response", {
          success: true,
        });

        io.to("associate").emit("Updated Shifts");
      } else {
        socket.emit("book shift response", {
          success: false,
        });
      }
    } catch (e) {
      console.log(e);
      socket.emit("book shift response", {
        success: false,
        error: e,
      });
    }
  });

  socket.on(
    "new shift",
    async ({ storeId, startDate, endDate, payRate = 40, headCount = 1 }) => {
      try {
        const result = await shifts.create({
          storeId: storeId,
          startDate:
            typeof startDate === "string" ? new Date(startDate) : startDate,
          endDate: typeof endDate === "string" ? new Date(endDate) : endDate,
          headCount: headCount,
          payRate: payRate,
          availableSlots: headCount,
        });

        console.log(result);

        if (result.insertedId) {
          socket.emit("new shift response", {
            success: true,
            shiftId: result.insertedId,
          });

          io.to("associate").emit("Updated Shifts");
        } else {
          socket.emit("new shift response", {
            success: false,
          });
        }
      } catch (e) {
        console.log(e);
        socket.emit("new shift response", {
          success: false,
          error: e,
        });
      }
    }
  );

  socket.on("get shifts", async ({ getAll = false }) => {
    if (getAll === true) {
      const results = await shifts.getAll();
      socket.emit("get shifts response", {
        success: true,
        shifts: results,
      });
    } else {
      const results = await shifts.getAvailable();

      socket.emit("get shifts response", {
        success: true,
        shifts: results,
      });
    }
  });

  socket.on("get shift by id", async ({ shiftId }) => {
    const results = await shifts.get(shiftId);

    if (results) {
      socket.emit("get shift by id response", {
        success: true,
        shift: results,
      });
    } else {
      socket.emit("get shift by id response", {
        success: false,
      });
    }
  });

  socket.on("error", (err) => {
    if (err && err.message === "unauthorized event") {
      socket.disconnect();
    }
  });

  socket.on("add location", async ({ storeId, address }) => {
    try {
      const latlng = await geocoder.geocode(address);

      const result = await stores.update({
        storeId: storeId,
        address: address,
        latlng: latlng.results[0].location,
      });

      console.log(result);

      if (result.upsertedId) {
        socket.emit("add location response", {
          success: true,
          msg: "location added",
        });
      } else {
        socket.emit("add location response", {
          success: false,
          msg: "location exists",
        });
      }
    } catch (e) {
      socket.emit("add location response", {
        success: false,
        error: e,
      });
    }
  });

  socket.on("get all locations", async () => {
    const results = await stores.getAll();

    socket.emit("get all locations response", {
      success: true,
      stores: results,
    });
  });

  socket.on("get location by id", async ({ storeId }) => {
    const results = await stores.get(storeId);

    if (results) {
      socket.emit("get location by id response", {
        success: true,
        store: results,
      });
    } else {
      socket.emit("get location by id response", {
        success: false,
      });
    }
  });

  socket.on("disconnect", async (reason) => {
    const result = await users.updateSocket(socket.id);
    console.log("a user disconnected", socket.id, result);
  });

  // socket.on("say to someone", (id, msg) => {
  //   // send a private message to the socket with the given id
  //   socket.to(id).emit("my message", msg);
  // });
});

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from 7-Flex!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Welcome to the 7-Flex Server!
    </section>
  </body>
</html>
`;
