


import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';
import Login from './src/Login/index';
import Registro from './src/Register/index';
import TodoList from './src/TodoList/index';



let entireScreenWidth = Dimensions.get('window').width;

EStyleSheet.build({$rem: entireScreenWidth / 380});

const Stack = createNativeStackNavigator();

const App = () => {


return (
    <NavigationContainer>
       <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="TodoList" component={TodoList} />
      </Stack.Navigator>
    </NavigationContainer>
);
};

export default App;
