import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Shifts from './Shifts';
import Accepted from './Accepted';

const MyComponent = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'shifts', title: 'Shifts', focusedIcon: 'clock-time-seven', unfocusedIcon: 'clock-time-seven-outline'},
    { key: 'accepted', title: 'Accepted', focusedIcon: 'check', unfocusedIcon: 'check-outline'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    shifts: Shifts,
    accepted: Accepted,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MyComponent;