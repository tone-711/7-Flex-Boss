import React, {useState} from 'react';
import {StyleSheet, TextInput, View, Image, Alert} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {MemoContext} from '../../services/MainMemo';
import useSocketIO from '../../services/useSocketIO';
import {
  BiometricIsAvailable,
  BasicBiometricAuth,
  // LoginBiometricAuth,
  SetUser,
  // UpdateUser,
  GetUser,
  DeleteUser,
} from 'react-native-biometric-login';
import useMmkv from '../../services/useMmkv';

const Login = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {login, toggleLoader} = React.useContext(MemoContext);
  const {socket} = useSocketIO();
  const mmkvStorage = useMmkv();
  const [mmkvToken, setMmkvToken] = mmkvStorage('token');
  const [mmkuserName, setMmkvUserName] = mmkvStorage('username');

  try {
  socket?.on('login response', ({success, token}) => {
    toggleLoader(false);
    if (success === true) {
      setMmkvUserName(username);
      setUsername('');
      setPassword('');
      setMmkvToken(token);
      login(token);
    } else {
      Alert.alert('Invalid Username or Password!');
    }
  });
}catch(err) {
  console.log('err',err);
}

  return (
    <>
      <View>
        <View style={styles.title}>
          <Image source={require('../../assets/Logo.png')} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            value={username}
            autoCapitalize="none"
            onChangeText={val => setUsername(val)}
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="white"
          />
          <View style={styles.password}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              value={password}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={val => setPassword(val)}
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="white"
            />
          </View>
        </View>
        <Button
          style={styles.button}
          disabled={username !== '' && password !== '' ? false : true}
          icon="login"
          mode="contained"
          onPress={() => {
            toggleLoader(true);
            socket?.emit('login', {username: username, password: password});
          }}>
          Login
        </Button>
      </View>
      {BiometricIsAvailable() && (
        <Button
          style={styles.button}
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
        style={styles.button}
        icon="lock-reset"
        mode="contained"
        onPress={() => props.navigation.navigate('Forgot')}>
        Forgot?
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6DC86E',
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  titleText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 60,
    marginHorizontal: 32,
  },
  input: {
    height: 40,
    backgroundColor: '#FF9900',
    padding: 10,
  },
  inputLabel: {
    color: 'black',
    fontSize: 16,
    paddingBottom: 8,
    fontWeight: 'bold',
  },
  password: {
    marginTop: 24,
  },
  button: {
    margin: 10,
    width: '80%',
    alignSelf: 'center',
  },
  loginButton: {
    button: {
      margin: 10,
      marginTop: 20,
      width: '80%',
      alignSelf: 'center',
    },
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Login;
