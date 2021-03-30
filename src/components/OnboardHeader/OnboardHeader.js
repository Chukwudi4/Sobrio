import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
// import {} from 'prog'
export default function OnboardHeader({ headerRight, navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backIconStyle}>
        <Icon
          style={{ alignSelf: 'center' }}
          color="#3F414E"
          name="arrow-back-ios"
        />
      </TouchableOpacity>
      <View>{headerRight()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: h(7),
    width: w(100),
    paddingHorizontal: w(7),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: w(5),
    marginBottom: w(10),
  },
  backIconStyle: {
    padding: w(3),
    borderRadius: w(5),
    width: w(10),
    height: w(10),
    backgroundColor: 'rgba(128, 128, 0, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
