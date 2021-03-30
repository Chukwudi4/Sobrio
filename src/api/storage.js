import firestore from '@react-native-firebase/firestore';

export const saveUserDataOnDB = (user) => {
  try {
    firestore().collection('users').doc(user.uid).add({
      uid: user.uid,
      username: username,
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const saveAddictionsOnDB = (userId, addictions) => {
  try {
    firestore().collection('addictions').doc(userId).set({
      addictions,
    });
  } catch (error) {}
};

export const fetchAddictionsFromDB = async (userId) => {
  try {
    const doc = await firestore().collection('addictions').doc(userId).get();
    console.log(doc.data());

    if (doc.data()) {
      return doc.data()?.addictions ?? [];
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveEntriesOnDB = (userId, entries) => {
  try {
    firestore().collection('entries').doc(userId).set({
      entries,
    });
  } catch (error) {}
};

export const fetchEntriesFromDB = async (userId) => {
  try {
    const doc = await firestore().collection('entries').doc(userId).get();
    console.log(doc.data());

    if (doc.data()) {
      return doc.data()?.entries ?? [];
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
