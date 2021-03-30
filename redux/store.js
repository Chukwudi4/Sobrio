import {createStore, combineReducers, applyMiddleware} from 'redux';
import {app} from './reducers';
import thunk from 'redux-thunk';
const rootReducer = combineReducers({app});

export const store = createStore(rootReducer, applyMiddleware(thunk));
