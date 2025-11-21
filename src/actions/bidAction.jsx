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
} from "../constants/bidConstant";
import { CLEAR_ERRORS } from "../constants/bidConstant";


// Create Bid
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
    };

    const { data } = await axios.post("/api/v1/bid/new", bid, formData, config);

    dispatch({
      type: CREATE_BID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_BID_FAIL,
      payload: error.response.data.message,
    });
  }
};

// My Bids
export const myBids = () => async (dispatch) => {
  try {
    dispatch({ type: MY_BID_REQUEST });

    const { data } = await axios.get("/api/v1/bids/me");
    dispatch({ type: MY_BID_SUCCESS, payload: data.bids });
  } catch (error) {
    dispatch({ type: MY_BID_FAIL, payload: error.response.data.message });
  }
};

// Get All Bids -- Admin
export const getAllBids = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_BIDS_REQUEST });

    const { data } = await axios.get("/api/v1/admin/bids");
    dispatch({ type: ALL_BIDS_SUCCESS, payload: data.bids });
  } catch (error) {
    dispatch({ type: ALL_BIDS_FAIL, payload: error.response.data.message });
  }
};

// Update Bid - Admin
export const updateBid = (id, bid) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BID_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(`/api/v1/admin/bid/${id}`, bid, config);

    dispatch({
      type: UPDATE_BID_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_BID_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Bid - Admin
export const deleteBid = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BID_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/bid/${id}`);

    dispatch({
      type: DELETE_BID_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_BID_FAIL,
      payload: error.response.data.message,
    });
  }
};

//Bid Details
export const getBidDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BID_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/bid/${id}`);
    dispatch({ type: BID_DETAILS_SUCCESS, payload: data.bid });
  } catch (error) {
    dispatch({ type: BID_DETAILS_FAIL, payload: error.response.data.message });
  }
};

export const addToBidItems = (id) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/v1/project/${id}`);
    const payload = {
      project: data.project._id,
      name: data.project.name,  
      title: data.project.title,
      price: data.project.price,
      category: data.project.category,
      image: data.project.images[0].url,
    };
    
    // console.log("Dispatching payload: ", payload);

    dispatch({
      type: ADD_TO_BIDITEMS,
      payload,
    });

    // Log the state after dispatching the action
    // console.log("State after dispatch: ", getState());

    // const bidItems = getState().bid?.bidItems || [];

    // localStorage.setItem('bidItems', JSON.stringify(bidItems));
  } catch (error) {
    console.error("Error fetching project data:", error);
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};