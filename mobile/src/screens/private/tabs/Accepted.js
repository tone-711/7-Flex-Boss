import React, {useContext} from 'react';
import {Text} from 'react-native-paper';
import {MemoContext} from '../../../services/MainMemo';
import AvailableShifts from '../AvailableShifts';

const Accepted = props => {
  const {getShifts} = useContext(MemoContext);
  return (
    <>
      <Text style={{color: 'white'}}>Accepted</Text>
      <AvailableShifts shifts={getShifts()} />
    </>
  );
};

export default Accepted;
