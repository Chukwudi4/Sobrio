import {
  ADD_ADDICTIONS,
  SET_ADDICTIONS,
  UPDATE_ADDICTIONS,
  SET_USER,
  SAVE_ENTRY,
  EDIT_ENTRY,
  SET_ENTRIES,
  DELETE_ENTRY,
  SEARCH_ENTRIES,
  LOGOUT,
} from './constants';

export const addAddictions = (addiction) => ({
  type: ADD_ADDICTIONS,
  addiction,
});

export const updateAddictions = (index) => ({
  type: UPDATE_ADDICTIONS,
  index,
});

export const setAddictions = (addictions) => ({
  type: SET_ADDICTIONS,
  addictions,
});

export const setUser = (user) => ({
  type: SET_USER,
  user,
});

export const saveEntry = (entry) => ({
  type: SAVE_ENTRY,
  entry,
});

export const editEntry = (entry, index) => ({
  type: EDIT_ENTRY,
  entry,
  index,
});

export const setEntries = (entries) => ({
  type: SET_ENTRIES,
  entries,
});

export const deleteEntry = (index) => ({
  type: DELETE_ENTRY,
  index,
});

export const searchEntries = (term) => ({
  type: SEARCH_ENTRIES,
  term,
});

export const logout = () => ({
  type: LOGOUT,
});
