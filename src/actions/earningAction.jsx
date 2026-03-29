import axios from "axios";
import {
  ALL_EARNING_FAIL,
  ALL_EARNING_REQUEST,  // Added: Assuming this exists in constants; replace ALL_BIDS_REQUEST
  ALL_EARNING_SUCCESS,
  CLEAR_ERRORS,
  CREATE_EARNING_FAILURE,
  CREATE_EARNING_REQUEST,
  CREATE_EARNING_SUCCESS,
  USER_EARNINGS_FAIL,
  USER_EARNINGS_REQUEST,
  USER_EARNINGS_SUCCESS,
} from "../constants/earningConstant";

// Global axios config for cookies (add to index.js if not already)
axios.defaults.withCredentials = true;  // Send cookies with every request

// Create Payment (Fixed: port URL; withCredentials; enhanced error handling)
export const createEarning = (amount, userId) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_EARNING_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      "http://localhost:4050/api/v1/earnings",
      { amount, userId },
      config
    );

    dispatch({
      type: CREATE_EARNING_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    dispatch({
      type: CREATE_EARNING_FAILURE,
      payload: errorMsg,
    });
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Get All Earnings - Admin (Fixed: port URL; correct dispatch type; withCredentials)
export const getAllEarnings = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_EARNING_REQUEST });  // Fixed: Was ALL_BIDS_REQUEST (typo)

    const config = { withCredentials: true };
    const { data } = await axios.get("http://localhost:4050/api/v1/admin/earning", config);

    dispatch({
      type: ALL_EARNING_SUCCESS,
      payload: data.earning,
    });
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    dispatch({
      type: ALL_EARNING_FAIL,
      payload: errorMsg,
    });
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Account Analytics (Fixed: port URL; withCredentials; consistent error handling)
export const fetchEarnings = () => async (dispatch) => {
  dispatch({ type: USER_EARNINGS_REQUEST });

  try {
    const config = { withCredentials: true };
    const response = await axios.get(`http://localhost:4050/api/v1/user/earning`, config);

    dispatch({
      type: USER_EARNINGS_SUCCESS,
      payload: response.data.earnings,
    });
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    dispatch({
      type: USER_EARNINGS_FAIL,
      payload: errorMsg,
    });
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

export const clearErrors = () => (dispatch) => {  // Fixed: Removed unnecessary async
  dispatch({
    type: CLEAR_ERRORS,
  });
};