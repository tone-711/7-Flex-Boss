import React, {useReducer, useMemo} from 'react';
import {MainContext, MainReducer, MainInitialState} from './src/store/main';
import {MainMemo, MemoContext} from './src/services/MainMemo';
import Index from './src';

const App = () => {
  const [store, dispatch] = useReducer(MainReducer, MainInitialState);
  const memoContext = useMemo(MainMemo(store, dispatch), [store]);

  return (
    <MainContext.Provider value={{store, dispatch}}>
      <MemoContext.Provider value={memoContext}>
       <Index />
      </MemoContext.Provider>
    </MainContext.Provider>
  );
};

export default App;
