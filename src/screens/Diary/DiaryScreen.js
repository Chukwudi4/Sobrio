import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colorSet, fontSizes } from '../../appStyles';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEntriesFromLocalDB,
  fetchFromLocalDb,
  saveEntriesOnLocalDB,
  saveOnLocalDb,
} from '../../api/localStorage';
import { deleteEntry, setEntries } from '../../../redux/actions';
import { useFocusEffect } from '@react-navigation/native';
import config from '../../config';
import DiaryWelcomeModal from '../../components/ConfirmResetModal/ConfirmResetModal';
import { fetchEntriesFromDB, saveEntriesOnDB } from '../../api/storage';
import SearchModal from '../../components/SearchModal/SearchModal';

export default function DiaryScreen({ navigation }) {
  const entries = useSelector((state) => state.app.entries);
  const user = useSelector((state) => state.app.user);

  const [isWelcomeModalVisible, setWelcomeModalVisible] = useState(false);
  const [seachModalVisible, setSeachModalVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    openWelcomeModal();
  }, []);

  useEffect(() => {
    loadEntriesFromLocalStorage();
  }, []);

  useFocusEffect(() => {
    persistEntries();
  }, [entries]);

  const persistEntries = async () => {
    if (entries.length !== 0) {
      await saveEntriesOnLocalDB(entries);
    }
  };

  const loadEntriesFromLocalStorage = async () => {
    const savedEntries = await fetchEntriesFromLocalDB();
    saveEntriesOnDB(user.uid, savedEntries);
    dispatch(setEntries(savedEntries));
  };

  const onDeleteEntry = (index) => {
    Alert.alert(
      'Confirmation',
      `Are you sure you want to delete ${entries[index.title]}?`,
      [
        { text: 'No I do not' },
        { text: 'Yes, I am sure', onPress: () => dispatch(deleteEntry(index)) },
      ],
      { cancelable: true },
    );
  };

  const renderDiaryEntry = (item, index) => {
    var m = moment(item.updated);
    var now = moment(new Date());
    return (
      <TouchableOpacity
        onPress={() => {
          setSeachModalVisible(false);
          navigation.navigate('AddEntry', { newIndex: index, index });
        }}
        onLongPress={onDeleteEntry}
        style={{ width: w(90), marginVertical: w(2) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={{
              color: colorSet.mainTextColor,
              fontSize: fontSizes.xsmall,
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              color: colorSet.mainTextColor,
              fontSize: fontSizes.small,
            }}>
            {m.fromNow()}
          </Text>
        </View>
        <Text
          numberOfLines={2}
          style={{ color: colorSet.lightText, fontSize: fontSizes.xsmall }}>
          {item.details}
        </Text>
      </TouchableOpacity>
    );
  };

  const openWelcomeModal = async () => {
    const diaryCheck = await fetchFromLocalDb(config.localTables.diaryCheck);
    if (!diaryCheck) {
      console.log(diaryCheck);
      setWelcomeModalVisible(true);
    }
  };

  const closeWelcomeModal = async () => {
    setWelcomeModalVisible(false);
    saveOnLocalDb(config.localTables.diaryCheck, 'Saved');
    const entriesOnDB = await fetchEntriesFromDB(user.uid);
    dispatch(setEntries(entriesOnDB));
  };

  const proceedFromWelcomeModal = () => {
    closeWelcomeModal();
    navigation.navigate('AddEntry', { newIndex: entries.length });
  };

  return (
    <View style={styles.container}>
      <SearchModal
        renderDiaryEntry={renderDiaryEntry}
        close={() => setSeachModalVisible(false)}
        isVisible={seachModalVisible}
      />
      <DiaryWelcomeModal
        modalInfo="Write your daily thoughts here and motivate yourself"
        buttonTitle="Record your first one"
        imageTitle="Welcome to your journal"
        imageSource={require('../../assets/diarywelcome.png')}
        isVisible={isWelcomeModalVisible}
        cancelText="No, Later"
        close={closeWelcomeModal}
        done={proceedFromWelcomeModal}
      />
      {entries.length > 5 && (
        <Pressable
          onPress={() => setSeachModalVisible(true)}
          style={styles.searchContainer}>
          <Icon
            color={colorSet.lightText}
            name="ios-search-outline"
            type="ionicon"
            size={fontSizes.xsmall}
          />
          <Text style={styles.searchInput}>Search though diary</Text>
        </Pressable>
      )}
      <Pressable
        onPress={() =>
          navigation.navigate('AddEntry', { newIndex: entries.length })
        }
        style={styles.addButton}>
        <Icon name="add" size={w(12)} color={colorSet.foregroundColor} />
      </Pressable>
      {entries.length === 0 && (
        <View style={{ alignItems: 'center' }}>
          <Image
            style={styles.emptyImage}
            source={require('../../assets/emptydiary.png')}
          />
          <Text style={styles.emptyTitle}>Uh Oh, Your Diary is empty</Text>
          <Text style={styles.emptyTip}>
            Use the icon below to create a fresh diary
          </Text>
        </View>
      )}
      <FlatList
        data={entries}
        renderItem={({ item, index }) => renderDiaryEntry(item, index)}
        keyExtractor={(item, index) => `${index}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorSet.mainBackgroundColor,
    padding: w(5),
    alignItems: 'center',
    flex: 1,
  },
  searchContainer: {
    backgroundColor: 'rgba(142, 142, 147, 0.04)',
    borderRadius: w(5),
    paddingHorizontal: w(3),
    marginHorizontal: w(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    width: w(60),
    fontSize: fontSizes.xsmall,
    marginHorizontal: w(1),
    marginVertical: fontSizes.xsmall,
    color: colorSet.lightText,
  },
  emptyImage: {
    width: w(20),
    height: w(20),
    marginTop: h(15),
  },
  emptyTitle: {
    fontSize: fontSizes.xsmall,
    color: colorSet.mainTextColor,
    marginTop: w(5),
    marginBottom: w(7),
  },
  emptyTip: {
    color: colorSet.lightText,
    fontSize: fontSizes.xsmall,
  },
  addButton: {
    width: w(15),
    height: w(15),
    justifyContent: 'center',
    backgroundColor: colorSet.tintColor,
    alignItems: 'center',
    borderRadius: w(7.5),
    shadowColor: '#fff',
    shadowOffset: { height: 5, width: 5 },
    shadowRadius: 5,
    elevation: 4,
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 2,
  },
});
