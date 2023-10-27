import { createServer } from "http";
import crypto from "crypto";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { MongoClient, ServerApiVersion } from "mongodb";
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

// Replace the placeholder with your Atlas connection string
const uri = process.env.MONGODB_URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const DB = client.db("7FlexDB");

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
      const user = DB.collection("user");

      const query = { username: username };
      const update = {
        $set: {
          username: username,
          password: hash,
          employeeId: employeeId,
          email: email,
          mobilePhone: mobilePhone,
          socket: null,
          role: role,
        },
      };
      const options = { upsert: true };
      const result = await user.updateOne(query, update, options);

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

  socket.on("login", async ({ username, password }) => {
    // send a private message to the socket with the given it

    const user = DB.collection("user");

    const curUser = await user.findOne({ username: username });

    if (curUser) {
      const checkPW = await VerifyPW(password, curUser.password);

      if (checkPW === true) {
        const token = await jwt.sign(
          { username: username },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );

        const query = { username: username };
        const update = {
          $set: {
            socket: socket.id,
          },
        };
        await user.updateOne(query, update);

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

    const user = DB.collection("user");

    try {
      const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET);

      const curUser = await user.findOne({
        username: verifiedToken.username,
      });

      const query = { username: verifiedToken.username };
      const update = {
        $set: {
          socket: socket.id,
        },
      };
      await user.updateOne(query, update);

      socket.join(curUser.role);

      socket.emit("refresh session response", { success: true });
    } catch (e) {
      socket.emit("refresh session response", { success: false, error: e });
    }
  });

  socket.on("get user bookings", async ({username}) => {
    const booking = DB.collection("booking");
   
      const bookings = await booking.find({ username: username } ).toArray();

      socket.emit("get shifts response", {
        success: true,
        stores: bookings,
      });
    
  });

  socket.on("book shift", async ({ username, gigId }) => {
    try {
      const shift = DB.collection("shift");

      const booking = DB.collection("booking");

      const curShift = await shift.findOne({ _id: id });

      if (curShift) {

      const result = await booking.insertOne({
        storeId: storeId,
        gigId: gigId,
        startDate: shift.startDate,
        endDate: shift.endDate,
        username: username,
        payRate: shift.payRate
      });

      const query = { _id: id };
      const update = {
        $set: {
          availableSlots: curShift.availableSlots - 1,
        },
      };
      await shift.updateOne(query, update);

      console.log(result);

        socket.emit("book shift response", {
          success: true
        });
      } else {
        socket.emit("book shift response", {
          success: false
        });
      }
    } catch (e) {
      socket.emit("book shift response", {
        success: false,
        error: e,
      });
    }
  });

  socket.on("new shift", async ({ storeId, startDate, endDate, headCount = 1, payRate = 40 }) => {
    try {
      const shift = DB.collection("shift");

      const result = await shift.insertOne({
        storeId: storeId,
        startDate: typeof startDate === "string" ? new Date(startDate) : startDate,
        endDate: typeof endDate === "string" ? new Date(endDate) : endDate,
        headCount: headCount,
        payRate: payRate,
        availableSlots: headCount
      });

      console.log(result);

      if (result.insertedId) {
        socket.emit("new shift response", {
          success: true,
          gigId: result.insertedId,
        });
      } else {
        socket.emit("new shift response", {
          success: false
        });
      }
    } catch (e) {
      socket.emit("new shift response", {
        success: false,
        error: e,
      });
    }
  });

  socket.on("get shifts", async ({getAll = false}) => {
    const shift = DB.collection("shift");

    if (getAll === true) {

      const shifts = await shift.find().toArray();

      socket.emit("get shifts response", {
        success: true,
        stores: shifts,
      });

    } else {
      const shifts = await shift.find({ availableSlots: { $gt: 0 } } ).toArray();

      socket.emit("get shifts response", {
        success: true,
        stores: shifts,
      });
    }
  });

  socket.on("get shift by id", async (id) => {
    const shift = DB.collection("shift");

    const res = await shift.findOne({ _id: id });

    if (res) {
      socket.emit("get shift by id response", {
        success: true,
        shift: res,
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

      const store = DB.collection("store");

      const query = { storeId: storeId };
      const update = {
        $set: {
          storeId: storeId,
          address: address,
          latlng: latlng.results[0].location,
        },
      };
      const options = { upsert: true };
      const result = await store.updateOne(query, update, options);

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
    const store = DB.collection("store");

    const stores = await store.find().toArray();

    socket.emit("get all locations response", {
      success: true,
      stores: stores,
    });
  });

  socket.on("get location by id", async ({ storeId }) => {
    const store = DB.collection("store");

    const res = await store.findOne({ storeId: storeId });

    if (res) {
      socket.emit("get location by id response", {
        success: true,
        store: res,
      });
    } else {
      socket.emit("get location by id response", {
        success: false,
      });
    }
  });

  socket.on("disconnect", async (reason) => {
    //await redisClient.del(socket.id);

    // io.emit("connected users", connectedUsers);
    const user = DB.collection("user");

    const query = { socket: socket.id };
    const update = {
      $set: {
        socket: null,
      },
    };
    const result = await user.updateOne(query, update);

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
