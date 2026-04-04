// src/components/admin/UsersList.jsx
import React, { Fragment, useEffect, useState } from "react";
import "./UsersList.css";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import toast from "../../utils/CustomToast";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstant";
import { FaSearch, FaTimes, FaEdit, FaTrash, FaCreditCard, FaStar, FaComments, FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
                  placeholder="Search name, email, or role..."
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
              <div className="usersTableWrapper">
                <div className="usersTableScroll">
                  <table className="usersTable">
                    <thead>
                      <tr>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Account</th>
                        <th>UPI</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="tableCell avatar">
                            <img
                              src={user.avatar?.url || "/default-avatar.png"}
                              alt={user.name}
                              className="userAvatar"
                            />
                          </td>
                          <td className="tableCell name">{user.name}</td>
                          <td className="tableCell email">{user.email}</td>
                          <td className="tableCell role">
                            <span className={`roleBadge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="tableCell account">{user.accountNo || "-"}</td>
                          <td className="tableCell upi">{user.upiId || "-"}</td>
                          <td className="tableCell actions">
                            <div className="actionButtons">
                              <Link
                                to={`/chat/${user._id}`}
                                className="actionBtn chat"
                                title="Chat with User"
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

                              <Link
                                to={`/admin/user/review/${user._id}`}
                                className="actionBtn review"
                                title="Submit Review"
                              >
                                <FaStar />
                              </Link>

                              <button
                                onClick={() => deleteUserHandler(user._id)}
                                className="actionBtn delete"
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pageBtn prev"
                    >
                      <FaChevronLeft /> Previous
                    </button>

                    <div className="pageNumbers">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={`pageBtn number ${currentPage === i + 1 ? "active" : ""}`}
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
                      Next <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;

