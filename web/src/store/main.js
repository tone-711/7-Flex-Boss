import React from 'react';
import dispatchObj from '../utils/dispatchObj';

const MainInitialState = {
    showLoader: false,
    isLoggedIn: false,
    socket: null,
    user: {},
    token: null,
    status: {  show: false, message: '', duration: 1500  }
  };

  const MainReducer = (state, action) => {
    switch (action.type) {
      case "reset":
        return MainInitialState;
      case "set":
        const setObj = new dispatchObj('setObj');
        setObj.setObj = action.data;
        //console.log(JSON.stringify(setObj.getAll()));
        return { ...state, ...setObj.getObj };
      default:
        //alert(action.cardTxt)
        return state;
    }
  };

  const MainContext = React.createContext();
  
export { MainInitialState, MainReducer, MainContext };