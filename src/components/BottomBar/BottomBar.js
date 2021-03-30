import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { colorSet, fontSizes } from '../../appStyles';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import config from '../../config';

const tabConfig = config.tabConfig;

export function BottomBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = tabConfig[route.name].title;
        const isFocused = state.index === index;

        const onPress = () => {
          navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={styles.button}
            onPress={onPress}>
            <Icon
              color={
                isFocused ? colorSet.foregroundColor : colorSet.inActiveTint
              }
              name={tabConfig[route.name].iconName}
              type={tabConfig[route.name].iconType}
              containerStyle={styles.icon}
              size={fontSizes.minilarge}
            />
            <Text
              style={[
                styles.labelStyle,
                {
                  color: isFocused
                    ? colorSet.foregroundColor
                    : colorSet.inActiveTint,
                },
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginTop: w(2),
  },
  labelStyle: {
    fontSize: fontSizes.small,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colorSet.mainBackgroundColor,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: w(15),
  },
  button: {
    width: w(99) / 2,
    alignItems: 'center',
  },
});
