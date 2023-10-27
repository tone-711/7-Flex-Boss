import { MainContext } from "./store/main";
import { Private, Public } from "./navigation";
import useSocketIO from "./services/useSocketIO";
import { MemoContext } from "./services/MainMemo";
import React, { useEffect, useContext } from "react";

const App = () => {
  const {store} = useContext(MainContext);
  const {setToken} = useContext(MemoContext);

  const { connect, socket } = useSocketIO();

  socket?.on("connect", () => {
    console.log("Socket.IO Connected");

    if (store.token != null) {
      socket.emit("refresh session", { token: store.token });
    }
  });

  socket?.on("refresh session response", ({ success }) => {
    if (success === false) {
      window.sessionStorage.removeItem("token");
      setToken(null);
    }
  });

  useEffect(() => {
    if (window.sessionStorage.token) {
      setToken(window.sessionStorage.token);
      console.log(window.sessionStorage.token);
    }
    async function connectSocketIO() {
      await connect();
    }
    connectSocketIO();
  }, []);

  return <>{store.token ? <Private /> : <Public />}</>;
};

export default App;
