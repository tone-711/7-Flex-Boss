import {useContext} from 'react';

import {io} from 'socket.io-client';
import {SIO_URL} from '../../constants';
import {MemoContext} from './MainMemo';
import {MainContext} from '../store/main';

const useSocketIO = () => {
  const {setSocketIO} = useContext(MemoContext);
  const {store} = useContext(MainContext);

  const connect = async () => {
    const socket = await io.connect(SIO_URL);
    setSocketIO(socket);
    return socket;
  };

  const socket = store.socket;

  return {connect, socket};
};

export default useSocketIO;
