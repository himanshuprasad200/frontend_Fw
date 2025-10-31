// src/actions/bidActions.js (Complete Updated: Cookie-based auth with withCredentials; port URLs; fixed axios args, error handling)
import axios from "axios";
import {
  CREATE_BID_REQUEST,
  CREATE_BID_SUCCESS,
  CREATE_BID_FAIL,
  MY_BID_REQUEST,
  MY_BID_SUCCESS,
  MY_BID_FAIL,
  BID_DETAILS_REQUEST,
  BID_DETAILS_SUCCESS,
  BID_DETAILS_FAIL, 
  ALL_BIDS_REQUEST,
  ALL_BIDS_SUCCESS,
  ALL_BIDS_FAIL,
  UPDATE_BID_REQUEST,
  UPDATE_BID_SUCCESS,
  UPDATE_BID_FAIL,
  DELETE_BID_REQUEST,
  DELETE_BID_SUCCESS,
  DELETE_BID_FAIL,
  ADD_TO_BIDITEMS,
  CLEAR_ERRORS,
} from "../constants/bidConstant";

// Global axios config for cookies (set once; add to index.js if not)
axios.defaults.withCredentials = true;  // Send cookies with every request

// Create Bid (Fixed: formData as data; port URL; withCredentials)
export const createBid = (bid) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_BID_REQUEST });

    const formData = new FormData();
    formData.append("proposal", bid.proposal);

    if (bid.file) {
      formData.append("file", bid.file);
    }

    const config = {
      headers: {
        "Content-Type": bid.file ? "multipart/form-data" : "application/json",
      },
      withCredentials: true,  // Ensure cookies sent
    };

    const { data } = await axios.post("https://backend-i86g.onrender.com/api/v1/bid/new", formData, config);

    dispatch({
      type: CREATE_BID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    dispatch({
      type: CREATE_BID_FAIL,
      payload: errorMsg,
    });
    // Handle 401: Redirect to login
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// My Bids (Fixed: port URL; withCredentials; enhanced error handling)
export const myBids = () => async (dispatch) => {
  try {
    dispatch({ type: MY_BID_REQUEST });

    const config = { withCredentials: true };
    const { data } = await axios.get("https://backend-i86g.onrender.com/api/v1/bids/me", config);
    dispatch({ type: MY_BID_SUCCESS, payload: data.bids });
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    dispatch({
      type: MY_BID_FAIL,
      payload: errorMsg,
    });
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Get All Bids -- Admin (Fixed: port URL; withCredentials)
export const getAllBids = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_BIDS_REQUEST });

    const config = { withCredentials: true };
    const { data } = await axios.get("https://backend-i86g.onrender.com/api/v1/admin/bids", config);
    dispatch({ type: ALL_BIDS_SUCCESS, payload: data.bids });
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    dispatch({
      type: ALL_BIDS_FAIL,
      payload: errorMsg,
    });
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Update Bid - Admin (Fixed: port URL; withCredentials)
export const updateBid = (id, bid) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BID_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(`https://backend-i86g.onrender.com/api/v1/admin/bid/${id}`, bid, config);

    dispatch({
      type: UPDATE_BID_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    dispatch({
      type: UPDATE_BID_FAIL,
      payload: errorMsg,
    });
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Delete Bid - Admin (Fixed: port URL; withCredentials)
export const deleteBid = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BID_REQUEST });

    const config = { withCredentials: true };
    const { data } = await axios.delete(`https://backend-i86g.onrender.com/api/v1/admin/bid/${id}`, config);

    dispatch({
      type: DELETE_BID_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    dispatch({
      type: DELETE_BID_FAIL,
      payload: errorMsg,
    });
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

// Bid Details (Fixed: port URL; withCredentials)
export const getBidDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BID_DETAILS_REQUEST });

    const config = { withCredentials: true };
    const { data } = await axios.get(`https://backend-i86g.onrender.com/api/v1/bid/${id}`, config);
    dispatch({ type: BID_DETAILS_SUCCESS, payload: data.bid });
  } catch (error) {
    const errorMsg = error.response ? error.response.data.message : error.message;
    dispatch({
      type: BID_DETAILS_FAIL,
      payload: errorMsg,
    });
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
  }
};

export const addToBidItems = (id) => async (dispatch, getState) => {
  try {
    const config = { withCredentials: true };
    const { data } = await axios.get(`https://backend-i86g.onrender.com/api/v1/project/${id}`, config);
    const payload = {
      project: data.project._id,
      name: data.project.name,  
      title: data.project.title,
      price: data.project.price,
      category: data.project.category,
      image: data.project.images[0].url,
    };
    
    dispatch({
      type: ADD_TO_BIDITEMS,
      payload,
    });

    const bidItems = getState().bidItems?.bidItems || [];
    localStorage.setItem('bidItems', JSON.stringify(bidItems));
  } catch (error) {
    console.error("Error fetching project data:", error);
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};