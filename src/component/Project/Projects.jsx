import React, { Fragment, useEffect, useState } from "react";
import "./Project.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProject } from "../../actions/projectAction";
import ProjectCard from "../Home/ProjectCard";
import { useParams, useNavigate } from "react-router-dom";
import toast from "../../utils/CustomToast";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import useDebounce from "../../hooks/useDebounce";
import { FaSearch, FaStar, FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const categories = [
  "Article", "Creative Writing", "Translations", "Speech Writing",
  "Video Editing", "Website Development", "Animation", "Graphic Design",
  "Logo Design", "Photo Editing", "Song Writing", "Audio Making",
  "Fashion Design", "Game Design", "Digital Marketing",
];

const budgetRanges = [
  { label: "Under ₹5k", value: [0, 5000] },
  { label: "₹5k — ₹15k", value: [5000, 15000] },
  { label: "₹15k — ₹30k", value: [15000, 30000] },
  { label: "₹30k+", value: [30000, 1000000] },
];

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyword } = useParams();

  const [searchKeyword, setSearchKeyword] = useState(keyword || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  // Enterprise Debounce Search
  const debouncedSearch = useDebounce(searchKeyword, 500);

  const { projects, loading, error, projectsCount, resultPerPage } =
    useSelector((state) => state.projects);

  const totalPages = Math.ceil((projectsCount || 0) / (resultPerPage || 8)) || 1;

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    
    // Live Search Fetch using debounced keyword
    dispatch(getProject(debouncedSearch || "", currentPage, price, category, ratings));
    
    // If user types, reset to first page to see relevant results
    if (debouncedSearch !== keyword) {
       // Only navigate if we want the URL to reflect the search specifically
       // But for enterprise "live" feel, we can just update the state
    }
  }, [dispatch, debouncedSearch, currentPage, price, category, ratings, error]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/projects/${searchKeyword}`);
    } else {
      navigate("/projects");
    }
  };

  const clearFilters = () => {
    setPrice([0, 100000]);
    setCategory("");
    setRatings(0);
    setCurrentPage(1);
    if (keyword) {
      setSearchKeyword("");
      navigate("/projects");
    }
  };

  return (
    <Fragment>
      <MetaData title="Explore Projects — FlexiWork" />

      <div className="projects-master-container">
        
        {/* Modern Header Section */}
        <div className="projects-hero">
          <div className="hero-content">
             <span className="badge-modern">Discover Work</span>
             <h1>Find the Perfect Project</h1>
             <p>Browse thousands of freelance opportunities tailored for your skills.</p>
             
             <form className="projects-search-bar" onSubmit={handleSearchSubmit}>
                <FaSearch className="pj-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by title, skill, or keyword..." 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button type="submit" className="search-modern-btn">Search</button>
             </form>
          </div>
        </div>

        <div className="projects-main-layout">
          {/* Sidebar Filter */}
          <aside className="modern-filter-sidebar">
            <div className="filter-header">
              <h3>Filters</h3>
              {(price[0] > 0 || price[1] < 100000 || category || ratings > 0 || keyword) && (
                <button className="clear-filter-btn" onClick={clearFilters}>Clear All</button>
              )}
            </div>

            {/* Simplified Budget Filter */}
            <div className="modern-filter-group">
              <label>Project Budget</label>
              <div className="budget-chip-container">
                {budgetRanges.map((range) => (
                  <button 
                    key={range.label}
                    className={`budget-chip ${price[0] === range.value[0] && price[1] === range.value[1] ? "active" : ""}`}
                    onClick={() => {
                      setPrice(range.value);
                      setCurrentPage(1);
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="modern-filter-group">
              <label>Minimum Client Rating</label>
              <div className="modern-rating-display">
                <FaStar className="star-icon-small" /> {ratings} & Up
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={ratings}
                onChange={(e) => setRatings(+e.target.value)}
                className="modern-range-slider single"
              />
            </div>

            {/* Categories */}
            <div className="modern-filter-group">
              <label>Specialized Categories</label>
              <ul className="modern-category-list">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={`modern-category-item ${category === cat ? "active" : ""}`}
                    onClick={() => {
                      setCategory(cat === category ? "" : cat);
                      setCurrentPage(1);
                    }}
                  >
                    {cat}
                    {category === cat && <FaCheck className="cat-check-icon" />}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Projects Content Area */}
          <main className="modern-projects-content">
            <div className="content-top-bar">
               <p className="results-count">
                 {loading ? "Searching..." : `Showing ${projects?.length || 0} of ${projectsCount || 0} projects`}
                 {keyword && <span> for <strong>"{keyword}"</strong></span>}
               </p>
            </div>

            {loading ? (
              <Loader />
            ) : projects && projects.length > 0 ? (
              <div className="projects-grid animated-fade-in-up">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="no-projects-found animated-fade-in-up">
                 <div className="empty-state-icon"><FaSearch /></div>
                 <h2>No Projects Found</h2>
                 <p>Try adjusting your search filters or browse other categories.</p>
                 <button className="reset-search-btn" onClick={clearFilters}>Reset Filters</button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && !loading && (
              <div className="modern-pagination">
                <button 
                  onClick={() => goToPage(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className="mp-btn mp-prev"
                >
                  <FaChevronLeft /> Prev
                </button>

                <div className="mp-numbers">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`mp-num-btn ${currentPage === page ? "active" : ""}`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <span key={page} className="mp-dots">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={() => goToPage(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                  className="mp-btn mp-next"
                >
                  Next <FaChevronRight />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </Fragment>
  );
};

export default Projects;