import React from 'react';
import { View, Image, Modal, StyleSheet, Text, Pressable } from 'react-native';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import appStyles, { colorSet, fontSizes } from '../../appStyles';

export default function ConfirmResetModal({
  close,
  done,
  imageSource,
  imageTitle,
  confirmQuestion,
  modalInfo,
  cancelText,
  buttonTitle,
  isVisible,
}) {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.container}>
        <Image style={styles.image} source={imageSource} />
        <Text style={styles.imageCaption}>{imageTitle}</Text>
        {confirmQuestion && (
          <Text style={styles.confirmQuestion}>{confirmQuestion}</Text>
        )}
        <Text style={styles.modalInfo}>{modalInfo}</Text>
        <Pressable onPress={done}>
          <Text style={[appStyles.button, styles.button]}>{buttonTitle}</Text>
        </Pressable>

        {cancelText && (
          <Pressable onPress={close}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    alignSelf: 'center',
    height: 200,
    justifyContent: 'center',
    flex: 1,
    opacity: 0.3,
    backgroundColor: 'rgba(101, 142, 169, 0.06)',
  },
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: w(30),
    padding: w(7),
    width: w(90),
    borderRadius: w(3),
    backgroundColor: colorSet.mainBackgroundColor,
    shadowColor: '#fff',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1, // 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  image: {
    width: w(50),
    height: w(30),
  },
  imageCaption: {
    color: colorSet.lightText,
    fontSize: fontSizes.xsmall,
    textAlign: 'center',
    marginTop: w(1),
    marginBottom: w(6),
  },
  confirmQuestion: {
    color: '#3F414E',
    fontSize: fontSizes.small,
    textAlign: 'center',
    fontWeight: '700',
  },
  modalInfo: {
    color: colorSet.lightText,
    fontSize: fontSizes.small,
    textAlign: 'center',
    marginBottom: w(7),
    marginTop: w(5),
  },
  cancelText: {
    color: '#3F414E',
    fontSize: fontSizes.xsmall,
    marginTop: w(2),
  },
  button: {
    width: w(60),
  },
});
