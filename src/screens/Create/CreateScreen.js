import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import UUIDGenerator from 'react-native-uuid-generator';
import { useDispatch, useSelector } from 'react-redux';
import { addAddictions, setAddictions } from '../../../redux/actions';
import DateTimePicker from '@react-native-community/datetimepicker';
import appStyles, { colorSet, fontSizes } from '../../appStyles';
import { Icon } from 'react-native-elements';
import { saveAddictionsOnDB } from '../../api/storage';
import Spinner from 'react-native-loading-spinner-overlay';

export function CreateScreen({ navigation, route }) {
  const addictionData = [
    { title: 'Smoking', metaData: '' },
    { title: 'Alcohol', metaData: '' },
    { title: 'Pornography and Masturbation', metaData: '' },
    {
      title: 'Substance Use',
      metaData: 'e.g Heroin, Lean, Crack and other hard drugs',
    },
    { title: 'Social Media', metaData: '' },
    { title: 'Sex' },
    {
      title: 'Junk food',
      metaData: 'e.g Soda, Burgers and other processed food',
    },
  ];

  const [selected, setSelected] = useState(-1);
  const [data] = useState(addictionData);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [isLoading, setLoading] = useState(false);

  let savedAddictions = useSelector((state) => state.app.addictions);
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={save}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // paddingTop: w(3),
            marginRight: w(2),
          }}>
          <Icon
            name="edit-2"
            type="feather"
            size={fontSizes.xsmall}
            color={colorSet.foregroundColor}
          />
          <Text
            style={{
              color: colorSet.foregroundColor,
              fontSize: fontSizes.small,
              marginHorizontal: w(1),
            }}>
            Personalise yours
          </Text>
        </TouchableOpacity>
      ),
    });
  });

  const save = async () => {
    if (!date) {
      Alert.alert('You have not selected date');
      return;
    }
    navigation.navigate('Custom');
  };

  const proceedToHome = async () => {
    const id = await UUIDGenerator.getRandomUUID();

    const data = {
      title: addictionData[selected].title,
      date: date.getTime(),
      id,
    };

    setLoading(true);
    const tempAddictions = savedAddictions;

    tempAddictions.push(data);
    dispatch(setAddictions(tempAddictions));
    const addictionsString = JSON.stringify(tempAddictions);
    AsyncStorage.setItem('addictions', addictionsString);
    saveAddictionsOnDB(user.uid, tempAddictions);
    setLoading(false);
    navigation.navigate('Tab', { screen: 'Home' });
  };

  const onSelect = async () => {
    if (selected === -1) {
      Alert.alert('Error', 'Please make a valid selction');
    }
    Alert.alert(
      'Confirmation',
      `Are you sure you want to proceed with your selection '${addictionData[selected].title}'? `,
      [
        { text: 'No, Cancel', onPress: () => console.log('ok') },
        { text: 'Yes', onPress: () => proceedToHome() },
      ],
      { cancelable: false },
    );
  };

  const renderItems = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {
              backgroundColor:
                index === selected
                  ? 'rgba(101, 142, 169, 0.23)'
                  : colorSet.mainBackgroundColor,
            },
          ]}
          onPress={() => {
            setSelected(index);
            // setTimeout(() => onSelect(), 2000);
          }}>
          <Text
            style={[
              styles.itemTitle,
              // { color: index === selected ? '#fff' : '#6F6F6F' },
            ]}>
            {item.title} {item.metaData}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(currentDate);
    console.log(new Date());
    return;
    setShowDate(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={isLoading}
        textContent=""
        color={colorSet.foregroundColor}
      />
      <Text style={styles.subTitle}>What habit are you trying to stop?</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={[styles.title, { marginRight: w(1) }]}>
          You can pick only one
        </Text>
        <Icon name="ios-heart-outline" size={w(4)} type="ionicon" />
      </View>

      {showDate && (
        <DateTimePicker
          minimumDate={new Date()}
          value={new Date()}
          mode="date"
          onChange={onChange}
        />
      )}
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        data={data}
        style={{ marginBottom: h(10) }}
        renderItem={renderItems}
      />
      <Pressable onPress={onSelect}>
        <Text
          style={[
            appStyles.button,
            {
              backgroundColor:
                selected === -1
                  ? colorSet.inActiveTint
                  : colorSet.foregroundColor,
            },
          ]}>
          Proceed
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: w(2),
    marginHorizontal: w(10),
    width: w(100),
    alignSelf: 'center',
    borderColor: colorSet.foregroundColor,
  },
  container: {
    backgroundColor: colorSet.mainBackgroundColor,
    paddingTop: w(10),

    flex: 1,
  },
  title: {
    fontSize: fontSizes.xsmall,
    color: colorSet.mainTextColor,
    marginHorizontal: w(10),
    marginTop: w(2),
    marginBottom: w(2),
  },
  itemTitle: {
    fontSize: fontSizes.xsmall,
    color: colorSet.lightText,
    marginHorizontal: w(10),
  },
  subTitle: {
    fontSize: fontSizes.xxsmall,
    color: colorSet.mainTextColor,
    fontWeight: 'bold',

    marginRight: w(2),
    marginHorizontal: w(10),
  },
});
