import { createServer } from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import redis from "redis";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

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

let redisClient;

(async () => {
  redisClient = redis.createClient({
    password: "33Zw3h6vOwQmdHdAqPW0OXXaM1d348DU",
    socket: {
      host: "redis-12974.c309.us-east-2-1.ec2.cloud.redislabs.com",
      port: 12974,
    },
  });

  redisClient.on("error", (error) => console.error(`Redis Error : ${error}`));

  await redisClient.connect();

  await redisClient.flushAll("ASYNC");

  await redisClient.json.set("users", "$", {
    connected: [],
    connected_Index: [],
    connectedRtc: [],
    connectedRtc_Index: [],
  });
})();

app.get("/", (req, res) => res.type("html").send(html));
app.get("/agent", (req, res) =>
  res.type("html").sendFile(path.join(__dirname, "/chat_clients/agent.html"))
);
app.get("/customer", (req, res) =>
  res.type("html").sendFile(path.join(__dirname, "/chat_clients/customer.html"))
);
app.get("/rtc", (req, res) =>
  res.type("html").sendFile(path.join(__dirname, "/chat_clients/rtc.html"))
);

io.on("connection", async (socket) => {
  console.log("a user connected");

  await redisClient.json.arrAppend("users", "$.connected", {
    id: socket.id,
    lastConnected: new Date(),
  });

  await redisClient.json.arrAppend("users", "$.connected_Index", socket.id);

  const connectedUsers = await redisClient.json.get("users", {
    path: ["$.connected[*].id"],
  });

  io.emit("connected users", connectedUsers);

  socket.on("join channel", async (channelName) => {
    // send a private message to the socket with the given id
    console.log("join channel", channelName);
    socket.join(channelName);

    if (channelName === "rtc") {
      const rtcUser = { id: socket.id };

      await redisClient.json.arrAppend("users", "$.connectedRtc", rtcUser);

      await redisClient.json.arrAppend(
        "users",
        "$.connectedRtc_Index",
        socket.id
      );

      const connectedRtcUsers = await redisClient.json.get("users", {
        path: ["$.connectedRtc[*].id"],
      });

      io.emit("connected rtc users", connectedRtcUsers);
    }
  });

  // socket.on("edit ice candidates", async (iceCandidates) => {
  //   const rtcUser = { id: socket.id, ice: iceCandidates };

  //   const iceIndex = await redisClient.json.arrIndex(
  //     "users",
  //     "$..connectedRtc_Index",
  //     socket.id
  //   );
  //   console.log("Existing Ice User Found", iceIndex[0]);

  //   if (iceIndex[0] >= 0) {
  //     await redisClient.json.arrPop("users", "$.connectedRtc", iceIndex[0]);
  //     await redisClient.json.arrPop(
  //       "users",
  //       "$.connectedRtc_Index",
  //       iceIndex[0]
  //     );
  //   }

  //   await redisClient.json.arrAppend("users", "$.connectedRtc", rtcUser);

  //   await redisClient.json.arrAppend(
  //     "users",
  //     "$.connectedRtc_Index",
  //     socket.id
  //   );

  //   const connectedRtcUsers = await redisClient.json.get("users", {
  //     path: ["$.connectedRtc[*].id"],
  //   });

  //   io.emit("connected rtc users", connectedRtcUsers);
  // });

  socket.on("rtc ice exchange", async (obj) => {
    io.to(obj.id).emit("rtc ice exchange", obj.ice);
  });

  socket.on("rtc connect handshake", (id) => {
    io.to(id).emit("rtc connect handshake", socket.id);
  });

  socket.on("rtc send offer", (obj) => {
    console.log("rtc receive offer", obj);
    io.to(obj.id).emit("rtc receive offer", obj.offer);
  });

  socket.on("rtc send answer", (obj) => {
    io.to(obj.id).emit("rtc receive answer", obj.answer);
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    const msgFlags = msg.split(" ")[0];

    if (msgFlags.startsWith("@ch:")) {
      console.log("@ch:", msgFlags.substr(4), msg.substr(msgFlags.length));
      io.to(msgFlags.substr(4)).emit(
        "chat message",
        msg.substr(msgFlags.length)
      );
    } else if (msgFlags[0] === "@") {
      console.log("@", msgFlags.substr(1));
      socket
        .to(msgFlags.substr(1), msg.substr(msgFlags.length))
        .emit("chat message", msg.substr(msgFlags.length));
    } else {
      io.emit("chat message", msg);
    }
  });

  socket.on("error", (err) => {
    if (err && err.message === "unauthorized event") {
      socket.disconnect();
    }
  });

  socket.on("disconnect", async (reason) => {
    //await redisClient.del(socket.id);

    const index = await redisClient.json.arrIndex(
      "users",
      "$..connected_Index",
      socket.id
    );
    console.log("a user disconnected index", index[0]);

    const iceIndex = await redisClient.json.arrIndex(
      "users",
      "$..connectedRtc_Index",
      socket.id
    );
    console.log("Existing Ice User Found", iceIndex[0]);

    if (iceIndex[0] >= 0) {
      await redisClient.json.arrPop("users", "$.connectedRtc", iceIndex[0]);
      await redisClient.json.arrPop(
        "users",
        "$.connectedRtc_Index",
        iceIndex[0]
      );
      const connectedRtcUsers = await redisClient.json.get("users", {
        path: ["$.connectedRtc[*].id"],
      });

      io.emit("connected rtc users", connectedRtcUsers);
    }

    await redisClient.json.arrPop("users", "$.connected", index[0]);
    await redisClient.json.arrPop("users", "$.connected_Index", index[0]);

    const connectedUsers = await redisClient.json.get("users", {
      path: ["$.connected[*].id"],
    });

    io.emit("connected users", connectedUsers);
    console.log("a user disconnected", socket.id);
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
    <title>Hello from Render!</title>
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
      Welcome to 7-11's Signaling Test Server!
    </section>
  </body>
</html>
`;
