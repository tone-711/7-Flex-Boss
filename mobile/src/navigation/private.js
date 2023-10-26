import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/private/Home';

import Options from '../screens/private/Options';

import ShiftDetails from '../screens/private/ShiftDetails';

const Stack = createNativeStackNavigator();

const Private = () => (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Options" component={Options}/>
        <Stack.Screen name="ShiftDetails" component={ShiftDetails}/>
    </Stack.Navigator>
);

export default Private;