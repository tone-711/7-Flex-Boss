import React from 'react';

const MainMemo = (store, dispatch) => {
  const Memo = () => ({
    toggleLoader: showLoader => {
      console.log(showLoader);
      return new Promise(async resolve => {
        await dispatch({type: 'set', data: {isLoading: showLoader}});
        resolve();
      });
    },
    showGlobalStatus: (message, duration) => {
      dispatch({
        type: 'set',
        data: {status: {show: true, message: message, duration: duration}},
      });
    },
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
        data: {isLoggedIn: true},
      });
    },
    logout: () => {
      dispatch({
        type: 'set',
        data: {isLoggedIn: false},
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
