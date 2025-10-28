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
  DELETE_PROJECT_RESET,
  DELETE_PROJECT_SUCCESS,
  NEW_PROJECT_FAIL,
  NEW_PROJECT_REQUEST,
  NEW_PROJECT_RESET,
  NEW_PROJECT_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_RESET,
  NEW_REVIEW_SUCCESS,
  PROJECT_DETAILS_FAIL,
  PROJECT_DETAILS_REQUEST,
  PROJECT_DETAILS_SUCCESS,
  UPDATE_PROJECT_FAIL,
  UPDATE_PROJECT_REQUEST,
  UPDATE_PROJECT_RESET,
  UPDATE_PROJECT_SUCCESS,
} from "../constants/projectConstant";

export const projectsReducer = (state = { projects: [] }, action) => {
  switch (action.type) {
    case ALL_PROJECT_REQUEST:
    case ADMIN_PROJECT_REQUEST:
      return {
        loading: true,
        projects: [],
      };
    case ALL_PROJECT_SUCCESS:
      return {
        loading: false,
        projects: action.payload.projects,
        projectsCount: action.payload.projectsCount,
        resultPerPage: action.payload.resultPerPage,
      };
    case ADMIN_PROJECT_SUCCESS:
      return {
        loading: false,
        projects: action.payload,
      };
    case ALL_PROJECT_FAIL:
    case ADMIN_PROJECT_FAIL:
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

export const newProjectReducer = (state = { project: {} }, action) => {
  switch (action.type) {
    case NEW_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_PROJECT_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        project: action.payload.project,
      };
    case NEW_PROJECT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_PROJECT_RESET:
      return {
        ...state,
        success: false,
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

export const projectReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PROJECT_REQUEST:
    case UPDATE_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_PROJECT_FAIL:
    case UPDATE_PROJECT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_PROJECT_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_PROJECT_RESET:
      return {
        ...state,
        isUpdated: false,
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

export const projectDetailsReducer = (state = { project: {} }, action) => {
  switch (action.type) {
    case PROJECT_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case PROJECT_DETAILS_SUCCESS:
      return {
        loading: false,
        project: action.payload,
      };
    case PROJECT_DETAILS_FAIL:
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

export const newProjectReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_REVIEW_SUCCESS:
      return {
        loading: false,
        success: action.payload,
      };
    case NEW_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_REVIEW_RESET:
      return {
        ...state,
        success: false,
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