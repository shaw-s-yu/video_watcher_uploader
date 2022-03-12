/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';

import {
  StyleSheet,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from './src/list/Home.react';
import UploadScrenn from './src/upload/Upload.react';

const Tab = createBottomTabNavigator();


const App = () => {
  return (
    <NavigationContainer>
    <Tab.Navigator
      initialRouteName="list"
      >
      <Tab.Screen name="upload" component={UploadScrenn} />
      <Tab.Screen name="watch" component={HomeScreen} />
      <Tab.Screen name="list" component={HomeScreen} />
    </Tab.Navigator>
    </NavigationContainer>
  );
};


export default App;
