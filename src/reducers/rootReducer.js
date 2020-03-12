import { combineReducers } from 'redux';
import { employeeListReducer } from './employeeListReducer';
import { employeeAddReducer } from './employeeAddReducer';

export default combineReducers({
  employeeListReducer,
  employeeAddReducer
});
