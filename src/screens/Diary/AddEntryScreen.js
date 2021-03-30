import React, { useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Alert,
  Pressable,
} from 'react-native';
import appStyles, { colorSet, fontSizes } from '../../appStyles';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEntry, editEntry, saveEntry } from '../../../redux/actions';
import moment from 'moment';

export default function AddEntryScreen({ route, navigation }) {
  const index = route?.params?.index ?? -1;
  const newIndex = route?.params?.newIndex ?? -2;
  const [title, setTitle] = useState(
    `${moment(Date.now()).format('kk:mm Do MMM YYYY')}`,
  );
  const [details, setDetails] = useState('');

  const dispatch = useDispatch();
  const entries = useSelector((state) => state.app.entries);

  useLayoutEffect(() => {
    if (index !== -1) {
      setTitle(entries[index].title);
      setDetails(entries[index].details);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            paddingHorizontal: fontSizes.mini,
            paddingVertical: fontSizes.mini,
          }}>
          <Text style={styles.subTitle}>
            {index !== -1 ? 'Edit entry' : 'Add Entry'}
          </Text>
        </View>
      ),
    });
    if (index !== -1) {
      navigation.setOptions({
        headerRight: () => (
          <Icon
            name="ios-trash-outline"
            type="ionicon"
            color={colorSet.mainTextColor}
            onPress={onDeleteEntry}
            containerStyle={{ marginRight: fontSizes.xxxsmall }}
          />
        ),
      });
    }
  });

  const onDeleteEntrySelected = () => {
    dispatch(deleteEntry(index));
    navigation.goBack();
  };

  const onDeleteEntry = (index) => {
    Alert.alert(
      'Confirmation',
      `Are you sure you want to delete ${entries[index.title]}?`,
      [
        { text: 'No I do not' },
        { text: 'Yes, I am sure', onPress: onDeleteEntrySelected },
      ],
      { cancelable: true },
    );
  };

  const goBack = () => {
    if (newIndex != index) {
      dispatch(
        saveEntry({
          title,
          details,
          updated: Date.now(),
        }),
      );
    } else {
      dispatch(
        editEntry(
          {
            title,
            details,
            updated: Date.now(),
          },
          index,
        ),
      );
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={[appStyles.labelText, { width: w(90) }]}>Title</Text>
      <TextInput
        placeholder="#1"
        defaultValue={title}
        onChangeText={setTitle}
        style={[styles.textInput, { marginVertical: w(3) }]}
      />
      <Text style={[appStyles.labelText, { width: w(90), margin: 0 }]}>
        The important details, try to make it lengthy
      </Text>
      <TextInput
        defaultValue={details}
        onChangeText={setDetails}
        placeholder="How are you feeling today"
        multiline
        style={[
          styles.textInput,
          { marginBottom: w(15), height: h(15), textAlignVertical: 'top' },
        ]}
      />
      <Pressable onPress={() => goBack()}>
        <Text
          style={[
            appStyles.button,
            {
              backgroundColor:
                details === ''
                  ? colorSet.inActiveTint
                  : colorSet.foregroundColor,
            },
          ]}>
          Save
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: w(10),
    alignItems: 'center',
    backgroundColor: colorSet.mainBackgroundColor,
  },
  textInput: {
    fontSize: fontSizes.xsmall,
    borderRadius: w(2.5),
    marginTop: w(1),
    backgroundColor: colorSet.underlayColor,
    width: w(90),
    paddingHorizontal: w(2),
  },
  info: {
    fontSize: fontSizes.small,
    color: colorSet.lightText,
    marginVertical: w(1),
    alignItems: 'center',
  },
  subTitle: {
    color: colorSet.mainTextColor,
    fontSize: fontSizes.xsmall,
    fontWeight: 'bold',
  },
});
