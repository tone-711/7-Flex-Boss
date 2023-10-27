import React, {useEffect, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet, SafeAreaView} from 'react-native';
import BackPressHandler from './utils/backPressHandler';
import {Provider as PaperProvider, Snackbar} from 'react-native-paper';
import PageLoader from './components/PageLoader';
import {Public, Private} from './navigation';
import useSocketIO from './services/useSocketIO';
import {MainContext} from './store/main';
import {MemoContext} from './services/MainMemo';
import useMmkv from './services/useMmkv';

const Index = () => {
  const {connect, socket} = useSocketIO();
  const {store} = useContext(MainContext);
  const {setToken} = useContext(MemoContext);
  const mmkvStorage = useMmkv();
  const [mmkvToken, setMmkvToken] = mmkvStorage('token');

  socket?.on('connect', () => {
    console.log('Socket.IO Connected');

    if (store.token != null) {
      socket.emit('refresh session', {token: store.token});
    }
  });

  socket?.on('refresh session response', ({success}) => {
    if (success === false) {
      setMmkvToken(null);
      setToken(null);
    }
  });

  useEffect(BackPressHandler, []);
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

  return (
    <PaperProvider>
      <NavigationContainer onReady={() => {}}>
        <PageLoader message="Please Wait..." isActive={store.isLoading} />
        {store.isLoggedIn === true ? <Private /> : <Public />}
        <Snackbar
          visible={store.status.show}
          duration={store.status.duration}
          style={styles.globalStatus}
          wrapperStyle={styles.wrapper}
          onDismiss={() => {
            dispatch({
              type: 'set',
              status: {
                show: false,
                message: '',
                duration: store.status.duration,
              },
            });
          }}>
          {store.status.message}
        </Snackbar>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  globalStatus: {
    marginBottom: 25,
    zIndex: 9999,
    backgroundColor: '#5400e6',
    color: 'white',
  },
  wrapper: {
    zIndex: 9999,
  },
});

export default Index;
