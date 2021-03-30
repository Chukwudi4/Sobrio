import React, { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import ViewPager from '@react-native-community/viewpager';
import config from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import appStyles, { colorSet, fontSizes } from '../../appStyles';

export default function SplashScreen({ navigation }) {
  const pagerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const SplashPage = ({ title, imgSource, description, button }) => {
    const finish = () => {
      console.log(index);
      if (index == 2) {
        navigation.navigate('Onboard', { screen: 'Register' });
        return;
      }
      pagerRef.current.setPage(index + 1);
    };

    const skip = () => {
      navigation.navigate('Onboard', { screen: 'Register' });
    };

    return (
      <View style={styles.container}>
        <View style={styles.upperSlideContainer}>
          <Image
            // resizeMode="cover"
            style={styles.slideImage}
            source={imgSource}
          />
        </View>
        <View style={styles.bottomSlideContainer}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <>
            <View style={{ alignItems: 'center' }}>
              {button && (
                <Pressable onPress={() => finish()}>
                  <Text style={appStyles.button}>{button}</Text>
                </Pressable>
              )}

              <Pressable onPress={() => skip()}>
                <Text style={styles.skip}>{index === 2 ? '' : 'Skip'}</Text>
              </Pressable>
            </View>
          </>
        </View>
      </View>
    );
  };

  return (
    <ViewPager
      onPageScroll={(event) => setIndex(event.nativeEvent.position)}
      onPageSelected={(event) => setIndex(event.nativeEvent.position)}
      ref={pagerRef}
      style={styles.container}
      initialPage={index}>
      {config.splashData.map((data, index) => (
        <View key={index}>
          <SplashPage
            title={data.title}
            description={data.description}
            imgSource={data.imgSource}
            button={data?.button}
            index={index}
          />
        </View>
      ))}
    </ViewPager>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorSet.mainBackgroundColor,
  },
  upperSlideContainer: {
    flex: 1,
    height: h(65),
    width: w(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorSet.tintColor,
  },
  bottomSlideContainer: {
    flex: 1,
    height: h(35),
    width: w(100),
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    color: colorSet.mainTextColor,
    fontSize: fontSizes.minilarge,
    fontWeight: '600',
    textAlign: 'center',
  },
  skip: {
    color: colorSet.mainTextColor,
    fontSize: fontSizes.small,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: w(2),
  },
  description: {
    color: colorSet.subTextColor,
    marginTop: w(4),
    width: w(80),
    fontSize: fontSizes.xxsmall,
    fontWeight: '600',
    textAlign: 'center',
  },
  slideImage: {
    width: w(60),
    height: w(60),
  },
});
