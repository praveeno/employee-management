import { handleErrors } from '../utils';

export const FETCH_EMPLOYEE_BEGIN = 'FETCH_EMPLOYEE_BEGIN';
export const FETCH_EMPLOYEE_SUCCESS = 'FETCH_EMPLOYEE_SUCCESS';
export const FETCH_EMPLOYEE_ERROR = 'FETCH_EMPLOYEE_ERROR';
export const GET_EMPLOYEE_BEGIN = 'GET_EMPLOYEE_BEGIN';
export const GET_EMPLOYEE_SUCCESS = 'GET_EMPLOYEE_SUCCESS';
export const GET_EMPLOYEE_ERROR = 'GET_EMPLOYEE_ERROR';
export const ADD_EMPLOYEE_TO_EMPLOYEES_LIST = 'ADD_EMPLOYEE_TO_EMPLOYEES_LIST';
export const UPDATE_EMPLOYEE_TO_EMPLOYEES_LIST = 'UPDATE_EMPLOYEE_TO_EMPLOYEES_LIST';
export const DELETE_EMPLOYEE_TO_EMPLOYEES_LIST = 'DELETE_EMPLOYEE_TO_EMPLOYEES_LIST';

export function addEmployeeToEmployees(employee, isEditing) {
  return dispatch => {
    dispatch({
      type: isEditing ? UPDATE_EMPLOYEE_TO_EMPLOYEES_LIST : ADD_EMPLOYEE_TO_EMPLOYEES_LIST,
      payload: employee
    });
  };
}
export function deleteEmployeeToEmployees(id) {
  return dispatch => {
    dispatch({
      type: DELETE_EMPLOYEE_TO_EMPLOYEES_LIST,
      payload: id
    });
  };
}

function fetchEmployeesBegin() {
  return {
    type: FETCH_EMPLOYEE_BEGIN
  };
}

function fetchEmployeesSuccess(employees) {
  return {
    type: FETCH_EMPLOYEE_SUCCESS,
    employees
  };
}

function fetchEmployeesError(error) {
  return {
    type: FETCH_EMPLOYEE_ERROR,
    error: error
  };
}

function getAllEmployees() {
  return fetch('https://jsonplaceholder.typicode.com/users')
    .then(handleErrors)
    .then(res => res.json());
}

export function fetchEmployees() {
  return dispatch => {
    dispatch(fetchEmployeesBegin());
    return getAllEmployees()
      .then(employees =>
        employees.map(user => {
          const address = user.address;
          user.key = user.id; // Table need unique ref as key
          user.formatted_address = `${address.suite} ${address.street} ${address.city}`;
          return user;
        })
      )
      .then(json => {
        dispatch(fetchEmployeesSuccess(json));
        return json;
      })
      .catch(error => dispatch(fetchEmployeesError(error)));
  };
}
