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
import { FaSearch, FaTimes, FaEdit, FaTrash, FaCreditCard, FaStar, FaComments } from "react-icons/fa";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, users } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted, message } = useSelector((state) => state.profile);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const [searchTerm, setSearchTerm] = useState("");

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
      setCurrentPage(1); 
    }
    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, isDeleted, message]);

  // Filter Logic
  const filteredUsers = users?.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search) ||
      user._id?.toLowerCase().includes(search)
    );
  }) || [];

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <MetaData title="All Users - Admin" />

      <div className="admin-master">
        <Sidebar />

        <div className="admin-content">
          <div className="usersListContainer">
            <div className="usersListHeaderContainer">
              <div>
                <h1 className="usersListHeading">All Users</h1>
                <p className="usersCount">Total: {filteredUsers.length} users</p>
              </div>

              {/* Enhanced Search Box */}
              <div className="adminSearchBox">
                <FaSearch className="searchIcon" />
                <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <FaTimes 
                    className="clearSearch" 
                    onClick={() => setSearchTerm("")} 
                  />
                )}
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="emptyState">
                <p>{searchTerm ? `No users found matching "${searchTerm}"` : "No users found."}</p>
                {searchTerm && (
                   <button className="resetSearchBtn" onClick={() => setSearchTerm("")}>Clear Filters</button>
                )}
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
                              to={`/chat/${user._id}`}
                              className="actionBtn review"
                              title="Chat with User"
                              style={{ backgroundColor: "#0ea5e9", color: "#fff" }}
                            >
                              <FaComments />
                            </Link>

                            <Link
                              to={`/admin/users/${user._id}`}
                              className="actionBtn edit"
                              title="Edit User"
                            >
                              <FaEdit />
                            </Link>

                            <button
                              onClick={() => deleteUserHandler(user._id)}
                              className="actionBtn delete"
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>

                            <Link
                              to={`/admin/user/payment/${user._id}`}
                              className="actionBtn payment"
                              title="Make Payment"
                            >
                              <FaCreditCard />
                            </Link>

                            <Link
                              to={`/admin/user/review/${user._id}`}
                              className="actionBtn review"
                              title="Submit Review"
                            >
                              <FaStar />
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
