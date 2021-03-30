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
import appStyles, { colorSet, fontSizes } from '../../appStyles';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setAddictions } from '../../../redux/actions';
import UUIDGenerator from 'react-native-uuid-generator';
import { saveAddictionsOnDB } from '../../api/storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default function CustomScreen({ navigation, route }) {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const savedAddictions = useSelector((state) => state.app.addictions);
  const user = useSelector((state) => state.app.user);

  const [date, setDate] = useState(new Date());
  const [isLoading, setLoading] = useState(false);

  const onFinish = async () => {
    if (input === '') {
      Alert.alert('Error', 'Please you need to enter something valid');
      return;
    }
    Alert.alert(
      'Confirmation',
      `Are you sure you want to proceed with your selection '${input}'? `,
      [
        { text: 'No, Cancel', onPress: () => console.log('ok') },
        { text: 'Yes', onPress: () => proceedToHome() },
      ],
      { cancelable: false },
    );
    return;
  };

  const proceedToHome = async () => {
    const id = await UUIDGenerator.getRandomUUID();

    const data = {
      title: input,
      date: date.getTime(),
      id,
    };
    setLoading(true);
    console.log(savedAddictions);
    const tempAddictions = savedAddictions;

    tempAddictions.push(data);
    dispatch(setAddictions(tempAddictions));
    const addictionsString = JSON.stringify(tempAddictions);
    AsyncStorage.setItem('addictions', addictionsString);
    saveAddictionsOnDB(user.uid, tempAddictions);
    setLoading(false);
    navigation.navigate('Tab', { screen: 'Home' });
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={isLoading}
        textContent=""
        color={colorSet.foregroundColor}
      />
      <Text style={styles.title}>What habit are you running from?</Text>
      <Text style={styles.subTitle}>Write one</Text>
      <TextInput
        defaultValue={input}
        placeholder="Smoking cigarettes, indian hemp, etc"
        placeholderTextColor="#000000"
        onChangeText={setInput}
        numberOfLines={1}
        maxLength={15}
        style={styles.textInput}
      />
      <Pressable onPress={() => onFinish()}>
        <Text
          style={[
            appStyles.button,
            {
              backgroundColor:
                input === '' ? colorSet.inActiveTint : colorSet.foregroundColor,
            },
          ]}>
          Continue
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
  },
  subTitle: {
    fontSize: fontSizes.xxsmall,
    color: colorSet.mainTextColor,
    fontWeight: 'bold',
    marginTop: w(2),
    marginBottom: w(8),
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
