import React from 'react';
import {Text, Button} from 'react-native-paper';
import {MemoContext} from '../services/MainMemo';
import {
  BiometricIsAvailable,
  BasicBiometricAuth,
  // LoginBiometricAuth,
  SetUser,
  // UpdateUser,
  GetUser,
  DeleteUser,
} from 'react-native-biometric-login';

const Login = props => {
  const {login} = React.useContext(MemoContext);

  React.useEffect(() => {
    const testBiometric = async () => {
      await SetUser('SomeUser', 'SomePassword');
      const user = await GetUser();
      console.log('bioUser', user);
      await DeleteUser();
    };

    testBiometric();
  }, []);

  return (
    <>
      <Text style={{color: 'black'}}>Login</Text>
      <Button
        style={{margin: 10}}
        icon="login"
        mode="contained"
        onPress={() => login()}>
        Login
      </Button>
      {BiometricIsAvailable() && (
        <Button
          style={{margin: 10}}
          icon="fingerprint"
          mode="contained"
          onPress={async () => {
            const result = await BasicBiometricAuth();
            if (result === true) {
              login();
            }
          }}>
          Biometric
        </Button>
      )}
      <Button
        style={{margin: 10}}
        icon="lock-reset"
        mode="contained"
        onPress={() => props.navigation.navigate('Forgot')}>
        Forgot?
      </Button>
    </>
  );
};

export default Login;
