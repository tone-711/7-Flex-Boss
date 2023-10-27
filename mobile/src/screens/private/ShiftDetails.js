import React, {useContext, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {
  Button,
  Title,
  Paragraph,
  Text,
  Avatar,
  Card,
  IconButton,
} from 'react-native-paper';
import {MemoContext} from '../../services/MainMemo';
import { useIsFocused } from '@react-navigation/native';
import useSocketIO from '../../services/useSocketIO';
import useMmkv from '../../services/useMmkv';

const ShiftDetails = props => {
  const {item} = props.route.params;
  const {setShifts, getShifts, showGlobalStatus} = useContext(MemoContext);
  const isAccepted = getShifts().find(obj => obj.id === item.id) !== undefined;
  const [location, setLocation] = useState('');
  const [shift, setShift] = useState('');
  const {socket} = useSocketIO();
  const isFocused = useIsFocused();
  const mmkvStorage = useMmkv();
  const [mmkuserName, setMmkvUserName] = mmkvStorage('username');

  const shiftStartDate = item?.startDate.slice(0,10);

  const shiftStartTime = item?.startDate.slice(11, 16);

  const shiftEndDate = item?.endDate.slice(0,10);

  const shiftEndTime = item?.endDate.slice(11, 16);


  const updateShifts = () => {
    //setShifts(item);
    socket?.emit('book shift', { shiftId: item?._id, username: mmkuserName });
    props.navigation.navigate('Home')
  }

  React.useEffect(() => {
    if(isFocused) {
      console.log('USEEFFCT');
      console.log('storeID', item?.storeId);
      socket?.emit('get location by id', { storeId: item?.storeId });
    }
  }, [isFocused]);

  socket?.on('get location by id response', ({success, store}) => {
    if (success === true) {
      console.log('success');
      setLocation(store);
      console.log('location',store);
    } else {
      console.log('Error fetching location Data');
    }
  });

  // socket?.on('get shift by id response', ({success, shift}) => {
  //   if (success === true) {
  //     setShift(shift);
  //     console.log('shift',shift);
  //   } else {
  //     console.log('Error fetching shift Data');
  //   }
  // });

  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        <Card.Content>
            <Title style={styles.text}>{item.location}</Title> 
          <Paragraph style={styles.text}>
            Shift Location: {location?.address}
          </Paragraph>
          <Paragraph style={styles.text}>
            Shift Start Date: {shiftStartDate}
          </Paragraph>
          <Paragraph style={styles.text}>
            Shift Start Time: {shiftStartTime}
          </Paragraph>
          <Paragraph style={styles.text}>
            Shift End Date: {shiftEndDate}
          </Paragraph>
          <Paragraph style={styles.text}>
            Shift End Time: {shiftEndTime}
          </Paragraph>
          <Paragraph style={styles.text}>Pay/ hr: {item.payRate}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button disabled={isAccepted} mode="contained" onPress={updateShifts}>{isAccepted ? 'Accepted' : 'Accept'}</Button>
        </Card.Actions>
      </Card>
      <Button
        style={{margin: 10}}
        mode="contained"
        onPress={() => props.navigation.navigate('Home')}>
        Back
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    border: 1.5,
    borderRadius: 10,
    padding: 5,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fcc494',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
});

export default ShiftDetails;
