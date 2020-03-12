import { handleErrors } from '../utils';

export const UPDATE_EMPLOYEE_BEGIN = 'UPDATE_EMPLOYEE_BEGIN';
export const UPDATE_EMPLOYEE_SUCCESS = 'UPDATE_EMPLOYEE_SUCCESS';
export const UPDATE_EMPLOYEE_ERROR = 'UPDATE_EMPLOYEE_ERROR';

function updateEmployeeBegin() {
  return {
    type: UPDATE_EMPLOYEE_BEGIN
  };
}

function updateEmployeeSuccess() {
  return {
    type: UPDATE_EMPLOYEE_SUCCESS
  };
}

function updateEmployeeError(error) {
  return {
    type: UPDATE_EMPLOYEE_ERROR,
    error: error
  };
}

function _updateEmployee(id, employee) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'PUT',
    body: employee && JSON.stringify(employee)
  })
    .then(handleErrors)
    .then(res => res.json());
}

export function updateEmployee(id, employee) {
  return dispatch => {
    dispatch(updateEmployeeBegin());
    return _updateEmployee(id, employee)
      .then(json => {
        dispatch(updateEmployeeSuccess());
        return json;
      })
      .catch(error => dispatch(updateEmployeeError(error)));
  };
}
