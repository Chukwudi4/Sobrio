import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import {
  WelcomeScreen,
  SplashScreen,
  CreateScreen,
  HomeScreen,
  LoadScreen,
  RegisterScreen,
  CustomScreen,
  DiaryScreen,
  AddEntryScreen,
} from '../src/screens';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import appStyles, { colorSet, fontSizes } from '../src/appStyles';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomBar } from '../src/components/BottomBar/BottomBar';
import { useSelector } from 'react-redux';

const Home = createStackNavigator();
const Onboard = createStackNavigator();
const Tab = createBottomTabNavigator();
function OnboardStack() {
  return (
    <Onboard.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          height: h(10),
          backgroundColor: colorSet.mainBackgroundColor,
          elevation: 0,
        },
        headerBackImage: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backIconStyle}>
            <Icon
              style={{ alignSelf: 'center' }}
              color="#3F414E"
              name="arrow-back-ios"
            />
          </TouchableOpacity>
        ),
      })}>
      <Onboard.Screen
        options={{
          title: '',
          headerShown: true,
          headerBackImage: () => <View />,
        }}
        name="Register"
        component={RegisterScreen}
      />
      <Onboard.Screen
        options={{ title: '' }}
        name="Welcome"
        component={WelcomeScreen}
      />
      <Onboard.Screen
        options={({ route, navigation }) => ({
          title: '',
          headerBackImage: () => (
            <TouchableOpacity
              onPress={() =>
                route.params?.lastscreen
                  ? navigation.pop()
                  : navigation.goBack()
              }
              style={styles.backIconStyle}>
              <Icon
                style={{ alignSelf: 'center' }}
                color="#3F414E"
                name="arrow-back-ios"
              />
            </TouchableOpacity>
          ),
        })}
        name="Create"
        component={CreateScreen}
      />
      <Onboard.Screen
        options={{
          title: '',
        }}
        name="Custom"
        component={CustomScreen}
      />
    </Onboard.Navigator>
  );
}

function HomeStack(params) {
  const user = useSelector((state) => state.app.user);
  console.log(user);
  return (
    <Home.Navigator>
      <Home.Screen
        options={{
          headerStyle: {
            height: h(10),
            backgroundColor: colorSet.mainBackgroundColor,
            elevation: 0,
          },
          headerTitleAlign: 'center',
          headerLeft: () => <View />,
          headerTitle: () => (
            <View
              style={{
                paddingHorizontal: w(3),
                paddingVertical: w(5),
              }}>
              {/* <Text style={styles.headerTitle}>Welcome Onboard</Text> */}
              <Text style={styles.subTitle}>Hello {user.username}</Text>
            </View>
          ),
          title: '',
        }}
        name="Home"
        component={HomeScreen}
      />
    </Home.Navigator>
  );
}

function DiaryStack() {
  return (
    <Home.Navigator>
      <Home.Screen
        options={{
          headerStyle: {
            height: h(10),
            backgroundColor: colorSet.mainBackgroundColor,
            elevation: 0,
          },
          headerTitleAlign: 'center',
          headerLeft: () => <View />,
          headerTitle: () => (
            <View
              style={{
                paddingHorizontal: w(3),
                paddingVertical: w(5),
              }}>
              <Text style={styles.subTitle}>My Journal</Text>
            </View>
          ),
          title: '',
        }}
        name="Diary"
        component={DiaryScreen}
      />
      <Home.Screen
        options={({ navigation }) => ({
          headerStyle: {
            height: h(10),
            backgroundColor: colorSet.mainBackgroundColor,
            elevation: 0,
          },
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View
              style={{
                paddingHorizontal: w(3),
                paddingVertical: w(5),
              }}>
              <Text style={styles.subTitle}></Text>
            </View>
          ),
          headerBackImage: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backIconStyle}>
              <Icon
                style={{ alignSelf: 'center' }}
                color="#3F414E"
                name="arrow-back-ios"
              />
            </TouchableOpacity>
          ),
          title: '',
        })}
        name="AddEntry"
        component={AddEntryScreen}
      />
    </Home.Navigator>
  );
}

function TabContainer() {
  return (
    <Tab.Navigator
      tabBar={({ state, navigation, descriptors }) => (
        <BottomBar
          state={state}
          navigation={navigation}
          descriptors={descriptors}
        />
      )}>
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="DiaryTab" component={DiaryStack} />
    </Tab.Navigator>
  );
}

export function AppStack() {
  return (
    <Home.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4c669f',
        },
        headerTitleStyle: {
          color: '#222831',
        },
      }}>
      <Home.Screen
        options={{ headerShown: false }}
        name="Load"
        component={LoadScreen}
      />
      <Home.Screen
        options={{ headerShown: false }}
        name="Splash"
        component={SplashScreen}
      />
      <Home.Screen
        options={{ headerShown: false }}
        name="Onboard"
        component={OnboardStack}
      />
      <Home.Screen
        options={{ headerShown: false }}
        name="Tab"
        component={TabContainer}
      />
    </Home.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backIconStyle: {
    padding: w(3),
    borderRadius: w(5),
    width: w(10),
    height: w(10),
    backgroundColor: colorSet.underlayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colorSet.lightText,
    fontSize: fontSizes.xsmall,
  },
  subTitle: {
    color: colorSet.mainTextColor,
    fontSize: fontSizes.xsmall,
    fontWeight: 'bold',
  },
});
