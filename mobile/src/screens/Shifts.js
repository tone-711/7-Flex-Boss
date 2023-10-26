import React from 'react';
import {Text, Button} from 'react-native-paper';
import {MemoContext} from '../services/MainMemo';
import { useNavigation } from '@react-navigation/native';

const Shifts = props => {
  const navigation = useNavigation();
  const {logout} = React.useContext(MemoContext);
  return (
    <>
      <Text style={{color: 'white'}}>Shifts</Text>
      <Button
        style={{margin: 10}}
        icon="logout"
        mode="contained"
        onPress={() => logout()}>
        Logout
      </Button>
      <Button
        style={{margin: 10}}
        icon="account-settings"
        mode="contained"
        onPress={() => navigation.navigate('Options')}>
        Options
      </Button>
    </>
  );
};

export default Shifts;
