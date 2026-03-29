import React, { Fragment, useEffect, useState } from "react";
import "./Project.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProject } from "../../actions/projectAction";
import ProjectCard from "../Home/ProjectCard";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";

const categories = [
  "Article", "Creative Writing", "Translations", "Speech Writing",
  "Video Editing", "Website Development", "Animation", "Graphic Design",
  "Logo Design", "Photo Editing", "Song Writing", "Audio Making",
  "Fashion Design", "Game Design", "Digital Marketing",
];

const ProjectsSkeleton = () => (
  <div className="projects-grid">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="project-skeleton-card">
        <div className="skel-img skel-shimmer"></div>
        <div className="skel-content">
          <div className="skel-title skel-shimmer"></div>
          <div className="skel-desc skel-shimmer"></div>
          <div className="skel-meta skel-shimmer"></div>
        </div>
      </div>
    ))}
  </div>
);

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyword } = useParams();

  const [searchKeyword, setSearchKeyword] = useState(keyword || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const { projects, loading, error, projectsCount, resultPerPage } =
    useSelector((state) => state.projects);

  const totalPages = Math.ceil((projectsCount || 0) / (resultPerPage || 8)) || 1;

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    // Using the URL param 'keyword' for fetching
    dispatch(getProject(keyword || "", currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, error]);

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
                <i className="fas fa-search search-icon"></i>
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

            {/* Price Filter */}
            <div className="modern-filter-group">
              <label>Budget Range</label>
              <div className="filter-price-display">
                <span>₹{price[0].toLocaleString()}</span>
                <span> - </span>
                <span>₹{price[1].toLocaleString()}+</span>
              </div>
              <div className="modern-range-container">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="500"
                  value={price[0]}
                  onChange={(e) => setPrice([+e.target.value, price[1]])}
                  className="modern-range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="500"
                  value={price[1]}
                  onChange={(e) => setPrice([price[0], +e.target.value])}
                  className="modern-range-slider"
                />
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="modern-filter-group">
              <label>Minimum Client Rating</label>
              <div className="modern-rating-display">
                <i className="fas fa-star text-yellow-500"></i> {ratings} & Up
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
                    {category === cat && <i className="fas fa-check"></i>}
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
              <ProjectsSkeleton />
            ) : projects && projects.length > 0 ? (
              <div className="projects-grid animated-fade-in-up">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="no-projects-found animated-fade-in-up">
                 <div className="empty-state-icon"><i className="fas fa-search"></i></div>
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
                  <i className="fas fa-chevron-left"></i> Prev
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
                  Next <i className="fas fa-chevron-right"></i>
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