// src/reducers/bidReducer.js (Complete Updated: As per previous fixes; bidDetails initial fixed; bidItems appends)
import {
  ADD_TO_BIDITEMS,
  ALL_BIDS_FAIL,
  ALL_BIDS_REQUEST,
  ALL_BIDS_SUCCESS,
  BID_DETAILS_FAIL,
  BID_DETAILS_REQUEST,
  BID_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  CREATE_BID_FAIL,
  CREATE_BID_REQUEST,
  CREATE_BID_RESET,
  CREATE_BID_SUCCESS,
  DELETE_BID_FAIL,
  DELETE_BID_REQUEST,
  DELETE_BID_RESET,
  DELETE_BID_SUCCESS,
  MY_BID_FAIL,
  MY_BID_REQUEST,
  MY_BID_SUCCESS,
  UPDATE_BID_FAIL,
  UPDATE_BID_REQUEST,
  UPDATE_BID_RESET,
  UPDATE_BID_SUCCESS,
} from "../constants/bidConstant";

export const newBidReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_BID_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_BID_SUCCESS:
      return {
        loading: false,
        bid: action.payload,
        success: true,
      };
    case CREATE_BID_RESET:
      return {
        ...state,
        success: false,
      };
    case CREATE_BID_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null, 
      };
    default:
      return state;
  }
};

export const myBidsReducer = (state = { bids: [] }, action) => {
  switch (action.type) {
    case MY_BID_REQUEST:
      return {
        loading: true,
      };
    case MY_BID_SUCCESS:
      return {
        loading: false,
        bids: action.payload,
      };
    case MY_BID_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const allBidsReducer = (state = { bids: [] }, action) => {
  switch (action.type) {
    case ALL_BIDS_REQUEST:
      return {
        loading: true,
      };
    case ALL_BIDS_SUCCESS:
      return {
        loading: false,
        bids: action.payload,
      };
    case ALL_BIDS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const bidReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_BID_REQUEST:
    case DELETE_BID_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_BID_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_BID_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_BID_FAIL:
    case DELETE_BID_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_BID_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case DELETE_BID_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const bidDetailsReducer = (state = { bid: {} }, action) => {
  switch (action.type) {
    case BID_DETAILS_REQUEST:
      return {
        loading: true,
      };
    case BID_DETAILS_SUCCESS:
      return {
        loading: false,
        bid: action.payload,
      };
    case BID_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const bidItemsReducer = (state = { bidItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_BIDITEMS:
      const newItem = action.payload;
      const exists = state.bidItems.find((i) => i.project === newItem.project);
      if (exists) {
        return state; // Prevent duplicates
      }
      return {
        ...state,
        bidItems: [...state.bidItems, newItem],
      };
    default:
      return state;
  }
};