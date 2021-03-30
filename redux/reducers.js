import { saveEntriesOnLocalDB } from '../src/api/localStorage';
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

const initialState = {
  addictions: [],
  user: {},
  entries: [],
  searchResult: [],
};

export const app = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ADDICTIONS:
      const newAddictions = [...state.addictions, action.addiction];
      return {
        ...state,
        addictions: newAddictions,
      };
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case UPDATE_ADDICTIONS:
      let updatedAddiction = [...state.addictions];
      updatedAddiction[action.index].date = Date.now();
      return {
        ...state,
        entries: updatedAddiction,
      };
    case SET_ADDICTIONS:
      return {
        ...state,
        addictions: action.addictions,
      };
    case SAVE_ENTRY:
      const tempEntries = [...state.entries];
      tempEntries.push(action.entry);
      return {
        ...state,
        entries: tempEntries,
      };
    case EDIT_ENTRY:
      const newEntries = [...state.entries];
      console.log(action.index);
      // Object.assign()
      newEntries[action.index] = action.entry;
      return {
        ...state,
        entries: newEntries,
      };
    case SET_ENTRIES:
      return {
        ...state,
        entries: action.entries,
      };
    case DELETE_ENTRY:
      const delEntries = [...state.entries];
      delEntries.splice(action.index, 1);
      return {
        ...state,
        entries: delEntries,
      };
    case SEARCH_ENTRIES:
      const searchResult = state.entries.filter(
        (entry) =>
          entry.title.indexOf(action.term) !== -1 ||
          entry.details.indexOf(action.term) !== -1,
      );

      return {
        ...state,
        searchResult,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
