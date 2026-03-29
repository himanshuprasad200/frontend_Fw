// src/components/admin/UpdateUser.jsx
import React, { Fragment, useEffect, useState } from "react";
import "./UpdateUser.css";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserDetails, updateUser, clearErrors } from "../../actions/userAction";
import { UPDATE_USER_RESET } from "../../constants/userConstant";
import Loader from "../layout/Loader/Loader";
import { FaUser, FaEnvelope, FaUserShield, FaArrowLeft } from "react-icons/fa";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, user } = useSelector((state) => state.userDetails);
  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // Force fetch user data on mount
  useEffect(() => {
    dispatch(getUserDetails(id));
  }, [dispatch, id]);

  // Sync local state with user data from Redux
  useEffect(() => {
    if (user && (user._id === id || user.id === id)) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "");
    }
  }, [user, id]);

  // Error/Success Handling
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("User Updated Successfully");
      navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, error, navigate, isUpdated, updateError]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      role
    };
    dispatch(updateUser(id, userData));
  };

  return (
    <Fragment>
      <MetaData title="Modify User - Admin" />

      <div className="admin-master">
        <Sidebar />

        <div className="admin-content">
          <div className="updateUserContainer">
            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <div className="updateUserHeader">
                   <h1 className="updateUserHeading">Update User Settings</h1>
                   <p className="usersCount">Modifying Profile for ID: #{id?.slice(-8).toUpperCase()}</p>
                </div>

                <form className="updateUserForm" onSubmit={updateUserSubmitHandler}>
                  <div className="formInputGroup">
                    <FaUser className="formIcon" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="formInputGroup">
                    <FaEnvelope className="formIcon" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="formInputGroup">
                    <FaUserShield className="formIcon" />
                    <select value={role} onChange={(e) => setRole(e.target.value)} required>
                      <option value="">Select Role Type</option>
                      <option value="admin">Administrator</option>
                      <option value="superadmin">Super Administrator</option>
                      <option value="user">Standard User</option>
                    </select>
                  </div>

                  <button
                    className="updateUserBtn"
                    type="submit"
                    disabled={updateLoading || role === ""}
                  >
                    {updateLoading ? "Saving Changes..." : "Apply Updates"}
                  </button>

                  <div className="formFooter">
                    <Link to="/admin/users" className="backBtn">
                      <FaArrowLeft /> Back to Users List
                    </Link>
                  </div>
                </form>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
