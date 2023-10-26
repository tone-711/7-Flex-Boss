import React from 'react';
import {Text, Button} from 'react-native-paper';

const Options = props => {
  return (
    <>
      <Text style={{color: 'black'}}>Options</Text>
      <Button
        style={{margin: 10}}
        icon="home"
        mode="contained"
        onPress={() => props.navigation.navigate('Home')}>
        Home
      </Button>
    </>
  );
};

export default Options;
