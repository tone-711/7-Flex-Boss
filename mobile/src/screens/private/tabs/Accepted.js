import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {Text} from 'react-native-paper';
import {MemoContext} from '../../../services/MainMemo';
import AvailableShifts from '../AvailableShifts';
import { useIsFocused } from '@react-navigation/native';
import useSocketIO from '../../../services/useSocketIO';
import useMmkv from '../../../services/useMmkv';

const Accepted = props => {
  const {getShifts} = useContext(MemoContext);
  const isFocused = useIsFocused();
  const {socket} = useSocketIO();
  const [data, setShiftData] =  useState('');
  const mmkvStorage = useMmkv();
  const [mmkuserName, setMmkvUserName] = mmkvStorage('username');

  React.useEffect(() => {
    if(isFocused) {
      socket?.emit('get bookings by username', { username: mmkuserName });
    }
  }, [isFocused]);


  socket?.on('get bookings by username response', ({success, stores}) => {
    if (success === true) {
      setShiftData(stores);
      console.log('shifts', stores);
    } else {
      console.log('Error fetching Data');
    }
  });

  const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
      <Text style={[styles.title, {color: 'black'}]}>{"Accepted Shift at STORE ID"} : {item.storeId}</Text> 
    </TouchableOpacity>
  );


  const renderItem = ({item}) => {
    const backgroundColor = '#50ac94';
    const color = 'white';

    return (
      <Item
        item={item}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  return (
    <>
      <Text style={{color: 'white'}}>Accepted</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={this.renderSeparator}
      />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Accepted;
