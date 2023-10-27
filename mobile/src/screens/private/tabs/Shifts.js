import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {MemoContext} from '../../../services/MainMemo';
import { useNavigation } from '@react-navigation/native';
import AvailableShifts from '../AvailableShifts';

const Shifts = props => {
  const navigation = useNavigation();
  const {logout} = React.useContext(MemoContext);
  return (
    <View style={styles.container}>
    <AvailableShifts/>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#50ac94'
  },
});

export default Shifts;
