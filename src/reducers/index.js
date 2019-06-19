import { combineReducers } from 'redux';
import GameReducer from './game-reducer';

const reducers = {
  gameStore: GameReducer,
}

const rootReducer = combineReducers(reducers);

export default rootReducer;
