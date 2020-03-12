import { handleErrors } from '../utils';

export const ADD_EMPLOYEE_BEGIN = 'ADD_EMPLOYEE_BEGIN';
export const ADD_EMPLOYEE_SUCCESS = 'ADD_EMPLOYEE_SUCCESS';
export const ADD_EMPLOYEE_ERROR = 'ADD_EMPLOYEE_ERROR';
export const OPEN_ADD_EMPLOYEE_MODEL = 'OPEN_ADD_EMPLOYEE_MOPEL';
export const CLOSE_ADD_EMPLOYEE_MODEL = 'CLOSE_ADD_EMPLOYEE_MOPEL';
export const ON_ADD_EMPLOYEE_STEPPER_UPDATE = 'ON_ADD_EMPLOYEE_STEPPER_UPDATE';
export const EDIT_EMPLOYEE = 'EDIT_EMPLOYEE';

export function editEmployee(employee) {
  return dispatch => {
    // updating editing employee detail in store
    dispatch({
      type: EDIT_EMPLOYEE,
      payload: employee
    });
    // open model for user to edit
    openAddEmployeeModel(dispatch);
  };
}

function addEmployeeBegin() {
  return {
    type: ADD_EMPLOYEE_BEGIN
  };
}

function addEmployeeSuccess() {
  return {
    type: ADD_EMPLOYEE_SUCCESS
  };
}

function addEmployeeError(error) {
  return {
    type: ADD_EMPLOYEE_ERROR,
    error: error
  };
}

function _addEmployee(employee) {
  return fetch(`https://jsonplaceholder.typicode.com/users`, {
    method: 'POST',
    body: employee && JSON.stringify(employee)
  })
    .then(handleErrors)
    .then(res => res.json());
}

export function openAddEmployeeModel(dispatch) {
  return dispatch({
    type: OPEN_ADD_EMPLOYEE_MODEL
  });
}

export function closeAddEmployeeModel(dispatch) {
  return dispatch({
    type: CLOSE_ADD_EMPLOYEE_MODEL
  });
}

export function onAddEmployeeStepperUpdate(currentStep) {
  return dispatch => {
    dispatch({
      type: ON_ADD_EMPLOYEE_STEPPER_UPDATE,
      currentStep
    });
  };
}

export function addEmployee(employee) {
  return dispatch => {
    dispatch(addEmployeeBegin());
    return _addEmployee(employee)
      .then(json => {
        dispatch(addEmployeeSuccess());
        return json;
      })
      .catch(error => dispatch(addEmployeeError(error)));
  };
}
