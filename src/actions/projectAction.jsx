import axios from "axios";
import {
  ADMIN_PROJECT_FAIL,
  ADMIN_PROJECT_REQUEST,
  ADMIN_PROJECT_SUCCESS,
  ALL_PROJECT_FAIL,
  ALL_PROJECT_REQUEST,
  ALL_PROJECT_SUCCESS,
  CLEAR_ERRORS,
  DELETE_PROJECT_FAIL,
  DELETE_PROJECT_REQUEST,
  DELETE_PROJECT_SUCCESS,
  NEW_PROJECT_FAIL,
  NEW_PROJECT_REQUEST,
  NEW_PROJECT_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  PROJECT_DETAILS_FAIL,
  PROJECT_DETAILS_REQUEST,
  PROJECT_DETAILS_SUCCESS,
  UPDATE_PROJECT_FAIL,
  UPDATE_PROJECT_REQUEST, 
  UPDATE_PROJECT_SUCCESS,
} from "../constants/projectConstant";

const API_URL = 'https://backend-i86g.onrender.com';

export const getProject =
  (keyword = "", currentPage = 1, price = [0, 90000], category, ratings = 0) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PROJECT_REQUEST });

      let link = `${API_URL}/api/v1/projects?page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

      if (category) {
        link = `${API_URL}/api/v1/projects?page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
      }

      const { data } = await axios.get(link);
      dispatch({
        type: ALL_PROJECT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PROJECT_FAIL,
        payload: error.response.data.message,
      });
    }
  };

//Get all projects for Admin
export const getAdminProject = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PROJECT_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/v1/admin/projects`);
    dispatch({
      type: ADMIN_PROJECT_SUCCESS,
      payload: data.projects,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_PROJECT_FAIL,
      payload: error.response.data.message,
    });
  }
};

//Create a new project
export const createProject = (projectData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PROJECT_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(`${API_URL}/api/v1/admin/project/new`, projectData, config);
    dispatch({
      type: NEW_PROJECT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_PROJECT_FAIL,
      payload: error.response.data.message,
    });
  }
};

//Update project
export const updateProject = (id, projectData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROJECT_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.put(`${API_URL}/api/v1/admin/project/${id}`, projectData, config);
    dispatch({
      type: UPDATE_PROJECT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PROJECT_FAIL,
      payload: error.response.data.message,
    });
  }
};

//Delete project
export const deleteProject = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PROJECT_REQUEST });
    const { data } = await axios.delete(`${API_URL}/api/v1/admin/project/${id}`);
    dispatch({
      type: DELETE_PROJECT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PROJECT_FAIL,
      payload: error.response.data.message,
    });
  }
};
 
//Get Project Details
export const getProjectDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_DETAILS_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/v1/project/${id}`);
    dispatch({
      type: PROJECT_DETAILS_SUCCESS,
      payload: data.project,
    });
  } catch (error) {
    dispatch({ 
      type: PROJECT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

//Project Review
export const newReviewForProject = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.put(`${API_URL}/api/v1/review`, reviewData, config);
    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};