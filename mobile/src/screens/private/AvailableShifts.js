import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Shift1',
    location: '7 Eleven at Irving',
    timings: '8AM - 12 PM',
    pay: '20$',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Shift2',
    location: '7 Eleven at Frisco',
    timings: '9AM - 1 PM',
    pay: '18$',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Shift3',
    location: '7 Eleven at Plano',
    timings: '8AM - 12 PM',
    pay: '19$',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d788',
    title: 'Shift4',
    location: '7 Eleven at Richardson',
    timings: '8AM - 12 PM',
    pay: '19$',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72889',
    title: 'Shift5',
    location: '7 Eleven at Melissa',
    timings: '8AM - 12 PM',
    pay: '20$',
  },
];

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.title} - {item.location}</Text> 
  </TouchableOpacity>
);


const AvailableShifts = props => {
  const navigation = useNavigation();  
  const [selectedId, setSelectedId] = useState();

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#CED0CE' : '#CED0CB';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => navigation.navigate('ShiftDetails', {item:item})}
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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
        ItemSeparatorComponent={this.renderSeparator}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
  },
  title: {
    fontSize: 15,
  },
});

export default AvailableShifts;