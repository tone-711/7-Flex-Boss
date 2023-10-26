import React from 'react';
import {Text, Button} from 'react-native-paper';

const Forgot = props => {
  return (
    <>
      <Text style={{color: 'black'}}>Forgot</Text>
      <Button
        style={{margin: 10}}
        icon="login"
        mode="contained"
        onPress={() => props.navigation.navigate('Login')}>
        Login
      </Button>
    </>
  );
};

export default Forgot;
