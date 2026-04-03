import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaArrowRight, FaHistory, FaBriefcase } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getProject } from "../../../actions/projectAction";
import useDebounce from "../../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import "./SearchModal.css";

const SearchModal = ({ isOpen, onClose }) => {
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 500);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects } = useSelector((state) => state.projects);

  const popularSuggestions = ["React Developer", "Logo Design", "Mobile App", "Content Writing", "VFX Artist"];

  useEffect(() => {
    if (debouncedKeyword.trim()) {
      setIsSearching(true);
      dispatch(getProject(debouncedKeyword)).then(() => {
        setIsSearching(false);
      });
    } else {
      setIsSearching(false);
    }
  }, [debouncedKeyword, dispatch]);

  const handleResultClick = (projectId) => {
    navigate(`/project/${projectId}`);
    onClose();
    setKeyword("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/projects/${keyword}`);
      onClose();
      setKeyword("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`search-modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <form className="search-modal-form" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for projects, skills, or services..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
            />
            {isSearching && <div className="modal-search-loader"></div>}
          </div>
        </form>

        <div className="search-modal-body">
          {keyword.trim() === "" ? (
            <div className="search-suggestions-section">
              <div className="suggestion-group">
                <h4><FaHistory /> Popular Searches</h4>
                <div className="suggestion-tags">
                  {popularSuggestions.map((s, i) => (
                    <span key={i} className="suggestion-tag" onClick={() => setKeyword(s)}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="search-hint">
                <p>Type to see real-time match results...</p>
              </div>
            </div>
          ) : (
            <div className="search-results-section">
              <div className="results-header">
                <span>Matching Projects ({projects?.length || 0})</span>
                {projects?.length > 0 && (
                  <button onClick={handleSearchSubmit}>View All <FaArrowRight /></button>
                )}
              </div>
              
              <div className="modal-results-list">
                {projects?.length > 0 ? (
                  projects.slice(0, 6).map((project) => (
                    <div 
                      key={project._id} 
                      className="modal-result-item"
                      onClick={() => handleResultClick(project._id)}
                    >
                      <div className="result-icon">
                        <FaBriefcase />
                      </div>
                      <div className="result-info">
                        <span className="result-name">{project.name}</span>
                        <span className="result-meta">{project.category} • {project.employmentType}</span>
                      </div>
                      <div className="result-price">
                        {project.price > 0 ? `₹${project.price}` : "Negotiable"}
                      </div>
                    </div>
                  ))
                ) : (
                  !isSearching && (
                    <div className="no-results-state">
                      <p>No projects found matching "<strong>{keyword}</strong>"</p>
                      <span>Try different keywords or browse projects</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="search-modal-footer">
          <div className="shortcut-hints">
            <span><strong>Esc</strong> to close</span>
            <span><strong>Enter</strong> to search all</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
