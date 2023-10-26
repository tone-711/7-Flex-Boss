import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/public/Login';
import Forgot from '../screens/public/Forgot';

const Stack = createNativeStackNavigator();

const Public = () => (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Forgot" component={Forgot}/>
    </Stack.Navigator>
);

export default Public;