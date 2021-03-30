import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import config from '../../config';
import { useDispatch } from 'react-redux';
import { setAddictions } from '../../../redux/actions';
import { setUser } from '../../../redux/actions';
import { checkSignedIn } from '../../api/auth';
import {
  isAppRegistered,
  registerApp,
  retreiveUserFromLocalDb,
} from '../../api/localStorage';
import {
  heightPercentageToDP as h,
  widthPercentageToDP as w,
} from 'react-native-responsive-screen';
import { colorSet } from '../../appStyles';

export default function LoadScreen({ navigation }) {
  const dispatch = useDispatch();
  const unsubscribe = useRef(null);

  useEffect(() => {
    loadAddictions();
    setTimeout(() => checkFirstOpen(), 1000);
  }, []);

  const loadAddictions = async () => {
    const addictionsString = await AsyncStorage.getItem('addictions');
    const savedAddictions = JSON.parse(addictionsString);
    if (savedAddictions) {
      dispatch(setAddictions(savedAddictions));
      return;
    }
  };

  async function onAuthStateChanged(user) {
    const check = await isAppRegistered();
    console.log(user);
    if (!check && !user) {
      navigation.navigate('Splash');
      unsubscribe?.current();
      return;
    }

    registerApp();

    if (user) {
      dispatch(
        setUser({
          uid: user.uid,
          username: user.email.split('@')[0],
        }),
      );
      navigation.navigate('Tab', { screen: 'Home' });
      unsubscribe?.current();
      return;
    } else {
      unsubscribe?.current();
      navigation.navigate('Onboard', { screen: 'Register' });
    }
  }

  const checkFirstOpen = async () => {
    unsubscribe.current = checkSignedIn(onAuthStateChanged);
    console.log(unsubscribe.current);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash.png')}
        style={styles.container}
      />
      <View style={styles.logoContainer}>
        <Image
          style={styles.logoStyle}
          source={require('../../assets/logo.png')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoStyle: {
    alignSelf: 'center',
    height: h(18),
    width: h(18),
    borderRadius: w(1),
  },
  logoContainer: {
    shadowColor: '#fff',
    shadowOffset: { height: 5, width: 5 },
    shadowRadius: 5,
    elevation: 10,
    position: 'absolute',
    backgroundColor: colorSet.tintColor,
    top: h(40),
    borderRadius: w(1),
  },
});
