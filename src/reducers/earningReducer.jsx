import {
  ALL_EARNING_FAIL,
  ALL_EARNING_REQUEST,
  ALL_EARNING_SUCCESS,
  CREATE_EARNING_FAILURE,
  CREATE_EARNING_REQUEST,
  CREATE_EARNING_SUCCESS,
  USER_EARNINGS_FAIL,
  // USER_EARNINGS_REQUEST,
  USER_EARNINGS_SUCCESS,
} from "../constants/earningConstant";

const initialState = {
  loading: false,
  success: false,
  earnings: [],
  error: null,
};

export const makeEarningReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EARNING_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case CREATE_EARNING_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        earnings: action.payload,
      };
    case CREATE_EARNING_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const allEarningReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_EARNING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_EARNING_SUCCESS:
      return {
        ...state,
        loading: false,
        earning: action.payload,
      };
    case ALL_EARNING_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const userEarningsReducer = (state = { earnings: []}, action) => {
  switch (action.type) {
    // case USER_EARNINGS_REQUEST:
    //   return {
    //     ...state,
    //     loading: true,
    //     error: null, // Reset error on new request
    //   };
    case USER_EARNINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        earnings: action.payload || [], // Ensure it defaults to an empty array if payload is undefined
      };
    case USER_EARNINGS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};