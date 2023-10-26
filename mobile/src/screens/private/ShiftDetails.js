import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-paper';

const ShiftDetails = props => {
  const {item} = props.route.params;
  return (
    <View style={styles.container}>
      <>
        <Text style={styles.text}>Shift Location : {item.location} </Text>
        <Text style={styles.text}>Shift Timings: {item.timings}</Text>
        <Text style={styles.text}>Pay/ hr: {item.pay}</Text>
        <Button style={{width: '30%', alignSelf:'center'}} icon="" mode="contained">Accept</Button>
      </>

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
  text: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShiftDetails;
