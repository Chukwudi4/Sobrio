import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import { setAddictions } from '../../../redux/actions';

export default function WelcomeScreen({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // fetchAddictions();
  }, []);

  const fetchAddictions = async () => {
    const addictionsString = await AsyncStorage.getItem('addictions');
    const savedAddictions = JSON.parse(addictionsString);
    if (savedAddictions) {
      dispatch(setAddictions(savedAddictions));
      navigation.navigate('Tab', { screen: 'Home' });
      return;
    }
    navigation.navigate('Onboard', { screen: 'Create' });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash.png')}
        style={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
