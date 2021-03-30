import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import { signIn } from '../../api/auth';
import { setUser, setAddictions } from '../../../redux/actions';
import {
  saveAddictionsOnLocalDb,
  updateUserOnLocalDb,
} from '../../api/localStorage';
import appStyles, { colorSet, fontSizes } from '../../appStyles';
import { fetchAddictionsFromDB } from '../../api/storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const clearInput = () => {
    setUsername('');
    setPassword('');
  };

  const onFinish = () => {
    if (username === '' || password === '') {
      Alert.alert('No username', 'Please enter a valid username');
      return;
    }
    setLoading(true);
    signIn(username, password).then(async (res) => {
      if (res.success) {
        clearInput();
        dispatch(
          setUser({
            uid: res.user.uid,
            username,
          }),
        );
        const addictions = await fetchAddictionsFromDB(res.user.uid);

        updateUserOnLocalDb(res.user, username);
        if (addictions?.length !== 0) {
          dispatch(setAddictions(addictions));
          saveAddictionsOnLocalDb(addictions);
          setLoading(false);
          navigation.navigate('Tab', { screen: 'Home' });
          return;
        }
        setLoading(false);
        navigation.navigate('Onboard', { screen: 'Create' });
      }
      setLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={isLoading}
        textContent=""
        color={colorSet.foregroundColor}
      />
      <Text style={styles.subTitle}>Before we go on</Text>
      <Text style={styles.title}>
        Login into your account. If you haven't created and account you can
        provide a fresh email and password
      </Text>
      <TextInput
        defaultValue={username}
        placeholder="username"
        placeholderTextColor="#000000"
        onChangeText={setUsername}
        style={[styles.textInput, { marginBottom: w(2) }]}
      />
      <TextInput
        defaultValue={password}
        placeholder="pass****"
        secureTextEntry={true}
        placeholderTextColor="#000000"
        onChangeText={setPassword}
        style={styles.textInput}
      />
      <Pressable onPress={() => onFinish()}>
        <Text
          style={[
            appStyles.button,
            {
              backgroundColor:
                username === ''
                  ? colorSet.inActiveTint
                  : colorSet.foregroundColor,
            },
          ]}>
          Jump in
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorSet.mainBackgroundColor,
    paddingTop: w(10),
    paddingHorizontal: w(10),
    flex: 1,
  },
  title: {
    fontSize: fontSizes.xsmall,
    color: colorSet.mainTextColor,
    marginBottom: w(8),
  },
  subTitle: {
    fontSize: fontSizes.xxsmall,
    color: colorSet.mainTextColor,
    fontWeight: 'bold',
    marginTop: w(2),
  },
  textInput: {
    fontSize: fontSizes.xsmall,
    borderWidth: w(0.4),
    borderRadius: w(2),
    borderColor: colorSet.foregroundColor,
    marginTop: w(2),
    marginBottom: w(10),
    paddingHorizontal: w(2),
  },
});
