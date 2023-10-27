import React, {useContext} from 'react';
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

const ShiftDetails = props => {
  const {item} = props.route.params;
  const {setShifts, getShifts, showGlobalStatus} = useContext(MemoContext);
  const isAccepted = getShifts().find(obj => obj.id === item.id) !== undefined;

  const updateShifts = () => {
    setShifts(item);
    // showGlobalStatus('Shift Accepted', 1000);
    props.navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        <Card.Content>
            <Title style={styles.text}>{item.location}</Title> 
          <Paragraph style={styles.text}>
            Shift Timings: {item.timings}
          </Paragraph>
          <Paragraph style={styles.text}>Pay/ hr: {item.pay}</Paragraph>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    marginVertical: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShiftDetails;
