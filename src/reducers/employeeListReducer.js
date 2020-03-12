import {
  FETCH_EMPLOYEE_SUCCESS,
  FETCH_EMPLOYEE_BEGIN,
  FETCH_EMPLOYEE_ERROR,
  ADD_EMPLOYEE_TO_EMPLOYEES_LIST,
  UPDATE_EMPLOYEE_TO_EMPLOYEES_LIST,
  DELETE_EMPLOYEE_TO_EMPLOYEES_LIST
} from '../actions/employeeFetchAction';

const initialState = {
  pending: false,
  employees: [],
  error: null
};

export function employeeListReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_EMPLOYEE_BEGIN:
      return {
        ...state,
        pending: true
      };
    case FETCH_EMPLOYEE_SUCCESS:
      return {
        ...state,
        pending: false,
        employees: action.employees
      };
    case FETCH_EMPLOYEE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error
      };
    case ADD_EMPLOYEE_TO_EMPLOYEES_LIST:
      return {
        ...state,
        employees: [action.payload, ...state.employees]
      };
    case UPDATE_EMPLOYEE_TO_EMPLOYEES_LIST:
      const i = state.employees.findIndex(e => e.id === action.payload.id);
      state.employees[i] = action.payload;
      return {
        ...state,
        employees: [...state.employees]
      };
    case DELETE_EMPLOYEE_TO_EMPLOYEES_LIST:
      const employees = state.employees.filter(e => e.id !== action.payload);
      return {
        ...state,
        employees
      };
    default:
      return state;
  }
}

export const getEmployees = state => state.employees;
export const getEmployeesPending = state => state.pending;
export const getEmployeesError = state => state.error;
