import React, { useReducer, useMemo } from "react";
import { MainContext, MainReducer, MainInitialState } from "./store/main";
import { MainMemo, MemoContext } from "./services/MainMemo";
import App from "./app";

const Init = () => {
  const [store, dispatch] = useReducer(MainReducer, MainInitialState);
  const memoContext = useMemo(MainMemo(store, dispatch), [store]);

  return (
    <MainContext.Provider value={{ store, dispatch }}>
      <MemoContext.Provider value={memoContext}>
        <App />
      </MemoContext.Provider>
    </MainContext.Provider>
  );
};

export default Init;
