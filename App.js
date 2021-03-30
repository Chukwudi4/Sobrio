/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { AppNavigator } from './navigation/Navigation';
import { store } from './redux/store';
const App = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Wanna leave?', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <Provider store={store}>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <AppNavigator />
    </Provider>
  );
};

export default App;
