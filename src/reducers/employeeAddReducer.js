import {
  ADD_EMPLOYEE_BEGIN,
  ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_ERROR,
  OPEN_ADD_EMPLOYEE_MODEL,
  CLOSE_ADD_EMPLOYEE_MODEL,
  ON_ADD_EMPLOYEE_STEPPER_UPDATE,
  EDIT_EMPLOYEE
} from '../actions/employeeAddAction';

const initialState = {
  pending: false,
  error: null,
  visible: false,
  currentStep: 0,
  employee: null,
  editing: false
};

export function employeeAddReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_EMPLOYEE_BEGIN:
      return {
        ...state,
        pending: true
      };
    case ADD_EMPLOYEE_SUCCESS:
      return {
        ...state,
        pending: false,
        employees: action.employees
      };
    case ADD_EMPLOYEE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error
      };
    case OPEN_ADD_EMPLOYEE_MODEL:
      return {
        ...state,
        visible: true
      };
    case CLOSE_ADD_EMPLOYEE_MODEL:
      return {
        ...state,
        visible: false,
        currentStep: 0
      };
    case ON_ADD_EMPLOYEE_STEPPER_UPDATE:
      return {
        ...state,
        currentStep: action.currentStep
      };
    case EDIT_EMPLOYEE:
      return {
        ...state,
        editing: true,
        employee: action.payload
      };
    default:
      return state;
  }
}

export const getEmployees = state => state.employees;
export const getEmployeesPending = state => state.pending;
export const getEmployeesError = state => state.error;
