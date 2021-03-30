import React, { useState } from 'react';
import { View, Modal, Text, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { colorSet } from '../../appStyles';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { searchEntries } from '../../../redux/actions';
export default function SearchModal({ renderDiaryEntry, close, isVisible }) {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResult = useSelector((state) => state.app.searchResult);

  const dispatch = useDispatch();

  const onChangeText = (term) => {
    setSearchTerm(term);
    dispatch(searchEntries(term));
  };

  return (
    <Modal visible={isVisible}>
      <View style={styles.container}>
        <SearchBar
          platform="ios"
          lightTheme={true}
          placeholder="Search here"
          value={searchTerm}
          onChangeText={onChangeText}
          onCancel={close}
          inputContainerStyle={{ backgroundColor: colorSet.underlayColor }}
          containerStyle={{
            width: w(85),
            backgroundColor: colorSet.mainBackgroundColor,
          }}
        />
        <FlatList
          data={searchResult}
          renderItem={({ item, index }) => renderDiaryEntry(item, index)}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorSet.mainBackgroundColor,
    alignItems: 'center',
  },
  closText: {
    fontSize: w(5),
    color: '#ff0000',
  },
});
