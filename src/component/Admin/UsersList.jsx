// src/components/admin/UsersList.jsx
import React, { Fragment, useEffect, useState } from "react";
import "./UsersList.css";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstant";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, users } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted, message } = useSelector((state) => state.profile);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const deleteUserHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success(message || "User deleted successfully");
      dispatch({ type: DELETE_USER_RESET });
      setCurrentPage(1); // Reset to first page
    }
    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, isDeleted, message]);

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users ? users.slice(indexOfFirstUser, indexOfLastUser) : [];
  const totalPages = users ? Math.ceil(users.length / usersPerPage) : 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <MetaData title="All Users - Admin" />

      <div className="admin-master">
        <Sidebar />

        <div className="admin-content">
          <div className="usersListContainer">
            <h1 className="usersListHeading">All Users</h1>
            <p className="usersCount">Total: {users?.length || 0} users</p>

            {users && users.length === 0 ? (
              <div className="emptyState">
                <p>No users found.</p>
              </div>
            ) : (
              <>
                <div className="usersTableWrapper">
                  <div className="usersTable">
                    {/* Table Header */}
                    <div className="tableHeader">
                      <div className="headerCell">Avatar</div>
                      <div className="headerCell">Name</div>
                      <div className="headerCell">Email</div>
                      <div className="headerCell">Role</div>
                      <div className="headerCell">Account</div>
                      <div className="headerCell">UPI</div>
                      <div className="headerCell">Actions</div>
                    </div>

                    {/* Table Rows */}
                    {currentUsers.map((user) => (
                      <div key={user._id} className="tableRow">
                        <div className="tableCell avatar">
                          <img
                            src={user.avatar?.url || "/default-avatar.png"}
                            alt={user.name}
                            className="userAvatar"
                          />
                        </div>
                        <div className="tableCell name">
                          <span className="mobileLabel">Name:</span>
                          {user.name}
                        </div>
                        <div className="tableCell email">
                          <span className="mobileLabel">Email:</span>
                          {user.email}
                        </div>
                        <div className="tableCell role">
                          <span className="mobileLabel">Role:</span>
                          <span className={`roleBadge ${user.role}`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="tableCell account">
                          <span className="mobileLabel">Account:</span>
                          {user.accountNo || "-"}
                        </div>
                        <div className="tableCell upi">
                          <span className="mobileLabel">UPI:</span>
                          {user.upiId || "-"}
                        </div>
                        <div className="tableCell actions">
                          <div className="actionButtons">
                            <Link
                              to={`/admin/user/${user._id}`}
                              className="actionBtn edit"
                              title="Edit User"
                            >
                              <svg viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                              </svg>
                            </Link>

                            <button
                              onClick={() => deleteUserHandler(user._id)}
                              className="actionBtn delete"
                              title="Delete User"
                            >
                              <svg viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                              </svg>
                            </button>

                            <Link
                              to={`/admin/user/payment/${user._id}`}
                              className="actionBtn payment"
                              title="Make Payment"
                            >
                              <svg viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                              </svg>
                            </Link>

                            <Link
                              to={`/admin/user/review/${user._id}`}
                              className="actionBtn review"
                              title="Submit Review"
                            >
                              <svg viewBox="0 0 24 24">
                                <path d="M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24z" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pageBtn prev"
                      >
                        Previous
                      </button>

                      <div className="pageNumbers">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`pageBtn ${currentPage === i + 1 ? "active" : ""}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pageBtn next"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;