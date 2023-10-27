import React, {useContext, useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import {MemoContext} from '../../../services/MainMemo';
import AvailableShifts from '../AvailableShifts';
import { useIsFocused } from '@react-navigation/native';
import useSocketIO from '../../../services/useSocketIO';

const Accepted = props => {
  const {getShifts} = useContext(MemoContext);
  const isFocused = useIsFocused();
  const {socket} = useSocketIO();
  const [data, setShiftData] =  useState('');

  React.useEffect(() => {
    if(isFocused) {
      socket?.emit('get bookings by username', { username: username });
    }
  }, [isFocused]);


  socket?.on('get bookings by username response', ({success, shifts}) => {
    if (success === true) {
      console.log('shifts');
      setShiftData(shifts);
    } else {
      console.log('Error fetching Data');
    }
  });

  return (
    <>
      <Text style={{color: 'white'}}>Accepted</Text>
      <AvailableShifts shifts={getShifts()} />
    </>
  );
};

export default Accepted;
