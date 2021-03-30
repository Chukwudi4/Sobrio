import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getMedal } from '../../api/medals';
import config from '../../config';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import { colorSet, fontSizes } from '../../appStyles';
import { Icon, Tooltip, Text as TipText } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import ConfirmResetModal from '../../components/ConfirmResetModal/ConfirmResetModal';
import ViewPager from '@react-native-community/viewpager';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { logout, updateAddictions } from '../../../redux/actions';
import { saveAddictionsOnDB } from '../../api/storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { logoutFromServer } from '../../api/auth';
import { clearDataFromLocalDb } from '../../api/localStorage';

export function HomeScreen({ navigation, route }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isRestModalVisible, setResetModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const stateAddictions = useSelector((state) => state.app.addictions);
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();
  const pagerRef = useRef(null);

  const onLogoutPrompt = () => {
    Alert.alert(
      'Confirmation',
      `Do you wish to logout of your account?`,
      [
        { text: 'No, Cancel', onPress: () => console.log('ok') },
        { text: 'Yes', onPress: onLogout },
      ],
      { cancelable: false },
    );
  };

  const onLogout = () => {
    logoutFromServer();
    dispatch(logout());
    clearDataFromLocalDb();
    navigation.navigate('Onboard', { screen: 'Register' });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Onboard', {
              screen: 'Create',
              params: { lastscreen: 'aa' },
            })
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: w(2),
          }}>
          <Icon
            name="ios-add-outline"
            type="ionicon"
            color={colorSet.mainTextColor}
            style={{ marginLeft: w(2) }}
            size={fontSizes.large}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={onLogoutPrompt}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: w(2),
          }}>
          <Icon
            name="logout"
            color={colorSet.mainTextColor}
            style={{ marginRight: w(2) }}
            size={fontSizes.xxxsmall}
          />
        </TouchableOpacity>
      ),
    });
  });

  const SingleAddictionView = ({ item }) => {
    var now = new Date();
    var startDate = new Date(item.date);

    const today = now.getDate() > 9 ? `${now.getDate()}` : `0${now.getDate()}`;
    const firstDay =
      startDate.getDate() > 9
        ? `${startDate.getDate()}`
        : `0${startDate.getDate()}`;

    const markedDates = {};
    markedDates[`${now.getFullYear()}-${now.getMonth() + 1}-${today}`] = {
      textColor: '#fff',
      color: colorSet.foregroundColor,
      startingDay: false,
      endingDay: true,
    };

    markedDates[
      `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${firstDay}`
    ] = {
      startingDay: true,
      endingDay: false,
      textColor: '#fff',
      color: 'red',
    };

    // console.log(markedDates);

    const days = moment(Date.now()).diff(moment(item.date), 'days'); // parseInt(diff / (60 * 60 * 24 * 1000), 10);
    const benchMark = days < 30 ? 30 : days < 100 ? 100 : 200;

    // console.log(days);
    const medal = getMedal(days);
    return (
      <View>
        <Text
          style={{
            fontSize: fontSizes.small,
            color: colorSet.mainTextColor,
            fontWeight: 'bold',
            marginBottom: w(2),
          }}>
          Rank
        </Text>
        <Tooltip
          backgroundColor={colorSet.foregroundColor}
          containerStyle={{ height: h(18) }}
          popover={
            <TipText
              style={{
                color: colorSet.tintColor,
                fontWeight: 'bold',
              }}>
              Your Sobriety level is currently at {medal.title} and keeps
              updating as your sober days go by
            </TipText>
          }>
          <View style={styles.medalContainer}>
            <Text style={styles.medalName}>{item.title}</Text>
            <Text style={styles.medalTitle}>Sobriety level: {medal.title}</Text>
            <Icon
              name="medal"
              type="material-community"
              color={medal.color}
              size={fontSizes.minilarge}
            />
          </View>
        </Tooltip>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            width: w(90),
            marginVertical: w(2.5),
          }}>
          <Text
            style={{
              fontSize: fontSizes.small,
              color: colorSet.mainTextColor,
              fontWeight: 'bold',
            }}>
            Sobriety counter
          </Text>
          <Icon
            onPress={openResetModal}
            name="refresh"
            color={colorSet.mainTextColor}
          />
        </View>

        <Tooltip
          backgroundColor={colorSet.foregroundColor}
          containerStyle={{ height: h(15) }}
          popover={
            <TipText
              style={{
                color: colorSet.tintColor,
                fontWeight: 'bold',
              }}>
              You have currently been sober for {days} out of {benchMark} days
            </TipText>
          }>
          <View style={styles.conterContainer}>
            <Progress.Circle
              formatText={() => `${days}`}
              progress={days / benchMark}
              showsText={true}
              textStyle={{
                fontSize: w(5.5),
                color: colorSet.lightText,
                zIndex: 131,
              }}
              animated={true}
              thickness={w(2.5)}
              borderWidth={0}
              unfilledColor={colorSet.underlayColor}
              color={colorSet.foregroundColor}
              size={fontSizes.xxLarge}
              // indeterminate={true}
            />
            <Text style={styles.daysText}>
              {days !== 1 ? 'days' : 'day'} so far
            </Text>
          </View>
        </Tooltip>
        <Text
          style={{
            fontSize: fontSizes.small,
            color: colorSet.mainTextColor,
            fontWeight: 'bold',
            marginTop: w(3),
          }}>
          Today
        </Text>
        <Tooltip
          backgroundColor={colorSet.foregroundColor}
          containerStyle={{ height: h(15) }}
          popover={
            <TipText
              style={{
                color: colorSet.tintColor,
                fontWeight: 'bold',
              }}>
              We thrive to keep you up to speed on your progress
            </TipText>
          }>
          <Calendar
            // Collection of dates that have to be colored in a special way. Default = {}
            markedDates={markedDates}
            style={{
              marginVertical: w(2),
              shadowColor: '#fff',
              shadowOffset: { height: 5, width: 5 },
              shadowRadius: 5,
              elevation: 2,
              width: w(90),
              borderRadius: w(1),
            }}
            markingType={'period'}
            // current
            minDate={`${startDate.getFullYear()}-${
              startDate.getMonth() + 1
            }-${firstDay}`}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={`${now.getFullYear()}-${now.getMonth() + 1}-${today}`}
          />
        </Tooltip>
      </View>
    );
  };

  const closeResetModal = () => {
    setResetModalVisible(false);
  };

  const openResetModal = () => {
    setResetModalVisible(true);
  };

  const resetAddiction = () => {
    try {
      if (
        moment(Date.now()).diff(
          moment(stateAddictions[currentPageIndex].date),
          'days',
        ) < 1
      ) {
        toast(
          'You counter has not been running up to a day and cannot be reset',
        );
        setLoading(false);
        closeResetModal();
        return;
      }
      setLoading(true);
      dispatch(updateAddictions(currentPageIndex));
      saveAddictionsOnDB(user.uid, stateAddictions);
      setLoading(false);
      closeResetModal();
      toast('Counter has been reset successfully');
    } catch (error) {
      console.log(error);
      setLoading(false);
      closeResetModal();
      toast('Counter was not reset successfully');
    }
  };

  const toast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={isLoading}
        textContent=""
        color={colorSet.foregroundColor}
      />
      <ConfirmResetModal
        modalInfo="By resetting this you get to lose your Sobriety count"
        buttonTitle="Yes, I'm sure"
        confirmQuestion="Are your sure you want to reset your counter?"
        imageTitle="A minute with Tessy Omah"
        cancelText="Cancel"
        imageSource={require('../../assets/resetimage.png')}
        isVisible={isRestModalVisible}
        close={closeResetModal}
        done={resetAddiction}
      />
      {currentPageIndex !== 0 && (
        <Pressable
          onPress={() => pagerRef.current.setPage(currentPageIndex - 1)}
          style={styles.togglePageButton}>
          <Icon
            size={fontSizes.minilarge}
            name="navigate-before"
            color={colorSet.mainTextColor}
          />
        </Pressable>
      )}
      {currentPageIndex !== stateAddictions.length - 1 && (
        <Pressable
          onPress={() => pagerRef.current.setPage(currentPageIndex + 1)}
          style={styles.toggleNextPageButton}>
          <Icon
            size={fontSizes.minilarge}
            name="navigate-next"
            color={colorSet.mainTextColor}
          />
        </Pressable>
      )}
      <ViewPager
        ref={pagerRef}
        onPageSelected={(e) => setCurrentPageIndex(e.nativeEvent.position)}
        style={{ flex: 1 }}>
        {stateAddictions.map((item, index) => (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', width: w(100) }}
            key={index}>
            <SingleAddictionView item={item} />
          </ScrollView>
        ))}
      </ViewPager>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorSet.mainBackgroundColor,
    flex: 1,
    paddingTop: w(5),
  },
  medalContainer: {
    padding: w(2),
    alignItems: 'flex-start',
    borderRadius: w(1),
    backgroundColor: colorSet.tintColor,
    width: w(50),
    shadowColor: '#fff',
    shadowOffset: { height: 5, width: 5 },
    shadowRadius: 5,
    elevation: 2,
  },
  medalTitle: {
    fontSize: fontSizes.xsmall,
    color: colorSet.subTextColor,
    marginVertical: w(1),
  },
  medalName: {
    fontSize: fontSizes.xsmall,
    color: colorSet.lightText,
    marginTop: w(2),
    marginBottom: w(1),

    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  conterContainer: {
    flexDirection: 'row',
    padding: w(5),
    backgroundColor: colorSet.tintColor,
    width: w(100),
    alignItems: 'center',
    borderRadius: w(1),
    height: h(25),
    shadowColor: '#fff',
    shadowOffset: { height: 5, width: 5 },
    shadowRadius: 5,
    elevation: 2,
    // width: w(90),
  },
  daysText: {
    fontSize: fontSizes.large,
    color: colorSet.lightText,
    marginLeft: w(7),
  },
  togglePageButton: {
    width: w(10),
    height: w(10),
    borderRadius: w(5),
    backgroundColor: colorSet.mainBackgroundColor,
    position: 'absolute',
    left: w(8),
    top: h(43),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { height: 5, width: 5 },
    shadowRadius: 5,
    elevation: 4,
    zIndex: 3,
  },
  toggleNextPageButton: {
    width: w(10),
    height: w(10),
    borderRadius: w(5),
    backgroundColor: colorSet.mainBackgroundColor,
    position: 'absolute',
    right: w(8),
    top: h(43),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { height: 5, width: 5 },
    shadowRadius: 5,
    elevation: 4,
    zIndex: 2,
  },
});
