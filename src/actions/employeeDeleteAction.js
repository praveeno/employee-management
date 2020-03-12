import { handleErrors } from '../utils';

export const DELETE_EMPLOYEE_BEGIN = 'DELETE_EMPLOYEE_BEGIN';
export const DELETE_EMPLOYEE_SUCCESS = 'DELETE_EMPLOYEE_SUCCESS';
export const DELETE_EMPLOYEE_ERROR = 'DELETE_EMPLOYEE_ERROR';

function deleteEmployeeBegin() {
  return {
    type: DELETE_EMPLOYEE_BEGIN
  };
}

function deleteEmployeeSuccess() {
  return {
    type: DELETE_EMPLOYEE_SUCCESS
  };
}

function deleteEmployeeError(error) {
  return {
    type: DELETE_EMPLOYEE_ERROR,
    error: error
  };
}

function _deleteEmployee(id) {
  return fetch(`https://jsonplaceholder.typicode.com/users:${id}`, {
    method: 'DELETE'
  })
    .then(handleErrors)
    .then(res => res.json());
}

export function deleteEmployee(id) {
  debugger;
  return dispatch => {
    debugger;
    dispatch(deleteEmployeeBegin());
    return _deleteEmployee(id)
      .then(json => {
        dispatch(deleteEmployeeSuccess());
        return json;
      })
      .catch(error => dispatch(deleteEmployeeError(error)));
  };
}
