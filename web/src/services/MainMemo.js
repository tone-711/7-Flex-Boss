import React from 'react';

const MainMemo = (store, dispatch) => {
  const Memo = () => ({
    setSocketIO: socket => {
      dispatch({
        type: 'set',
        data: {socket: socket},
      });
    },
    getUser: () => {
      return store.user;
    },
    login: () => {
      dispatch({
        type: 'set',
        data: {token: ""},
      });
    },
    logout: () => {
      dispatch({
        type: 'set',
        data: {token: null},
      });
    },
    setToken: token => {
      dispatch({
        type: 'set',
        data: {token: token},
      });
    },
  });

  return Memo;
};

const MemoContext = React.createContext();

export {MainMemo, MemoContext};
