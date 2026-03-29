import React, { Fragment, useEffect, useState } from "react";
import "./ProjectList.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaEdit, 
  FaTrashAlt, 
  FaFolderOpen, 
  FaRupeeSign, 
  FaSearch, 
  FaFilter, 
  FaChevronLeft, 
  FaChevronRight 
} from "react-icons/fa";

import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { clearErrors, deleteProject, getAdminProject } from "../../actions/projectAction";
import { DELETE_PROJECT_RESET } from "../../constants/projectConstant";
import Loader from "../layout/Loader/Loader";

const ProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, projects, loading } = useSelector((state) => state.projects);
  const { error: deleteError, isDeleted, loading: deleteLoading } = useSelector((state) => state.project);

  // States for Search, Filter, and Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  const deleteProjectHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(id));
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
      toast.success("Project Deleted Successfully");
      dispatch({ type: DELETE_PROJECT_RESET });
    }
    dispatch(getAdminProject());
  }, [dispatch, error, deleteError, isDeleted, navigate]);

  // Derived state: latest projects first
  const sortedProjects = projects ? [...projects].reverse() : [];

  // Filter projects by Search Term and Category
  const filteredProjects = sortedProjects.filter((project) => {
    const matchesSearch = 
      (project.name && project.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.desc && project.desc.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "" || project.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Extract unique categories dynamically for the dropdown
  const categoriesList = [...new Set(sortedProjects.map(p => p.category).filter(Boolean))];

  // Pagination calculations
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Reset to first page if search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <MetaData title="All Projects (Admin) - FlexiWork" />
      
      <div className="dashboard">
        <Sidebar />
        
        <main className="project-list-main">
          {loading ? (
            <Loader />
          ) : (
            <div className="admin-page-wrapper">
              
              {/* Premium Header */}
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">All Projects Directory</h1>
                  <p className="admin-page-subtitle">Manage and monitor all marketplace projects</p>
                </div>
                <div className="header-badge">
                  {filteredProjects.length} Projects
                </div>
              </div>

              {/* Advanced Toolbar: Search & Filter */}
              <div className="admin-toolbar">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search by client, title, or description..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="filter-box">
                  <FaFilter className="filter-icon" />
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categoriesList.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Modern Table */}
              <div className="admin-table-container">
                {currentProjects.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Client Name</th>
                        <th>Title & Description</th>
                        <th><FaFolderOpen /> Category</th>
                        <th><FaRupeeSign /> Budget</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProjects.map((item) => (
                        <tr key={item._id} className="table-row-hover">
                          <td className="image-cell">
                            {item.images && item.images.length > 0 ? (
                              <img src={item.images[0].url} alt={item.title} className="project-thumbnail" />
                            ) : (
                              <div className="no-image-placeholder">No Image</div>
                            )}
                          </td>
                          <td className="client-cell font-semibold">
                            {item.name}
                          </td>
                          <td className="title-desc-cell">
                            <div className="project-title-text">{item.title}</div>
                            <div className="project-desc-text">
                              {item.desc?.length > 55 ? item.desc.substring(0, 55) + "..." : item.desc}
                            </div>
                          </td>
                          <td>
                            <span className="category-badge">
                              {item.category}
                            </span>
                          </td>
                          <td className="price-cell font-bold">
                            ₹{item.price?.toLocaleString() || 'N/A'}
                          </td>
                          <td className="actions-cell text-right">
                            <Link 
                              to={`/admin/project/${item._id}`} 
                              className="action-btn edit-btn"
                              title="Edit Project"
                            >
                              <FaEdit /> <span>Update</span>
                            </Link>
                            <button 
                              onClick={() => deleteProjectHandler(item._id)} 
                              className="action-btn delete-btn"
                              disabled={deleteLoading}
                              title="Delete Project"
                            >
                              <FaTrashAlt /> <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <FaSearch className="empty-icon" />
                    <p>No projects match your search criteria.</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="page-nav-btn"
                  >
                    <FaChevronLeft /> Prev
                  </button>
                  
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="page-nav-btn"
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </Fragment>
  );
};

export default ProjectList;