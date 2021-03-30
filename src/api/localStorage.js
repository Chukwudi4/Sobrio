import AsyncStorage from '@react-native-community/async-storage';
import { SET_USER } from '../../redux/constants';
import config from '../config';

export const clearDataFromLocalDb = () => {
  AsyncStorage.clear();
  registerApp();
};

export const updateUserOnLocalDb = async (user, username) => {
  const userData = JSON.stringify({
    uid: user.uid,
    username,
  });
  await AsyncStorage.setItem(SET_USER, userData);
};

export const retreiveUserFromLocalDb = async () => {
  const user = await AsyncStorage.getItem(SET_USER);
  return user;
};

export const saveAddictionsOnLocalDb = async (addictions) => {
  const addictionsString = JSON.stringify(addictions);
  await AsyncStorage.setItem('addictions', addictionsString);
};

export const registerApp = async () => {
  const check = await AsyncStorage.setItem(config.APP_NAME, 'advdd');
};

export const isAppRegistered = async () => {
  const check = await AsyncStorage.getItem(config.APP_NAME);
  return check;
};

export const fetchEntriesFromLocalDB = async () => {
  const entriesString = await AsyncStorage.getItem('ENTRIES');
  if (entriesString) {
    const entries = JSON.parse(entriesString);
    return entries;
  } else {
    return [];
  }
};

export const saveEntriesOnLocalDB = async (entries) => {
  await AsyncStorage.setItem('ENTRIES', JSON.stringify(entries));
};

export const fetchFromLocalDb = async (table) => {
  console.log(table);
  const data = await AsyncStorage.getItem(table);
  return data;
};

export const saveOnLocalDb = async (table, data) => {
  await AsyncStorage.setItem(table, JSON.stringify(data));
};
