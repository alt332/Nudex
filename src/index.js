import React from 'react';

import {SafeAreaView, StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import ListScreen from './screens/ListScreen';

const Stack = createStackNavigator();

export const App = () => (
  <SafeAreaView style={{flex: 1, backgroundColor: 'rgb(20, 23, 28)'}}>
    <StatusBar translucent barStyle="default" />
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerBackTitle: 'back',
          headerTintColor: 'rgb(214, 214, 216)',
          headerStyle: {
            backgroundColor: 'rgb(20, 23, 28)',
            shadowColor: 'transparent',
          },
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="List"
          component={ListScreen}
          options={({route}) => ({title: route.params.name})}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaView>
);
