import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
export const colorSet = {
  mainBackgroundColor: '#ffffff',
  foregroundColor: '#3751CC',
  tintColor: '#FFFFFF',
  mainTextColor: '#3F4553',
  subTextColor: '#848484',
  grey: 'grey',
  lightText: '#6F6F6F',
  inActiveTint: 'rgba(101, 142, 169, 0.5)',
  underlayColor: 'rgba(101, 142, 169, 0.06)',
};

export const fontSizes = {
  mini: w(3),
  small: w(3.5),
  xsmall: w(4),
  xxsmall: w(4.5),
  xxxsmall: w(5),
  minilarge: w(6),
  large: w(7),
  xxLarge: w(20),
};

const appStyles = StyleSheet.create({
  button: {
    width: w(80),
    padding: w(3),
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colorSet.mainBackgroundColor,
    borderRadius: w(2),
    fontSize: fontSizes.xxsmall,
    fontWeight: 'bold',
    backgroundColor: colorSet.foregroundColor,
    alignSelf: 'center',
  },
  headerTitleStyle: {
    color: colorSet.lightText,
    fontSize: fontSizes.xsmall,
  },
  labelText: {
    fontSize: fontSizes.small,
    color: colorSet.mainTextColor,
    fontWeight: 'bold',
    marginTop: w(3),
  },
});

export default appStyles;
