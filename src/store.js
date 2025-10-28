import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from "redux";
import { thunk } from "redux-thunk";
import {
  allUsersReducer,
  forgotPasswordReducer,
  newUserReviewReducer,
  profileReducer,
  userDetailsReducer,
  userReducer,
} from "./reducers/userReducer";
import {
  newProjectReducer,
  newProjectReviewReducer,
  projectDetailsReducer,
  projectReducer,
  projectsReducer,
} from "./reducers/projectReducer";

const rootReducers = combineReducers({
  //Users
  user: userReducer,
  allUsers: allUsersReducer,
  forgotPassword: forgotPasswordReducer,
  profile: profileReducer,
  userDetails: userDetailsReducer,
  newUserReview: newUserReviewReducer,

  //Projects
  projects: projectsReducer,
  projectDetails: projectDetailsReducer,
  newProjectReview: newProjectReviewReducer,
  newProject: newProjectReducer,
  project: projectReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
