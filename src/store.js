import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from "redux";
import {thunk} from "redux-thunk";
import {
  allUsersReducer,
  forgotPasswordReducer,
  newUserReviewReducer,
  profileReducer,
  userDetailsReducer,
  userReducer,
} from "./reducers/userReducer";

const rootReducers = combineReducers({
    user: userReducer,
    allUsers: allUsersReducer,
    forgotPassword: forgotPasswordReducer,
    profile: profileReducer,
    userDetails: userDetailsReducer,
    newUserReview: newUserReviewReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducers, composeEnhancers(applyMiddleware(thunk)));

export default store;
