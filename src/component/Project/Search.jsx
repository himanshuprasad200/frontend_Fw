import React, { useState, Fragment } from "react";
import MetaData from "../layout/MetaData";
import "./Search.css";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Directs the user to the refined projects page with their filtered keyword
      navigate(`/projects/${keyword}`);
    } else {
      navigate("/projects");
    }
  };

  return (
    <Fragment>
      <MetaData title="Explore FlexiWork - Search" />
      <div className="search-overlay">
        <form className="searchBox" onSubmit={searchSubmitHandler}>
          <div className="search-header">
             <h2>Find Work & Talent</h2>
             <p>Search over thousands of projects, skills, and professional services</p>
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Search (e.g. Graphic Designer, Resume, Python Developer)..."
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
              autoComplete="off"
            />
            <button type="submit">
              <i className="fas fa-search"></i> Search
            </button>
          </div>
          <div className="search-shortcuts">
             <span>Quick Links:</span>
             <button type="button" onClick={() => navigate("/projects/Resume")}>Resume</button>
             <button type="button" onClick={() => navigate("/projects/Developer")}>Developer</button>
             <button type="button" onClick={() => navigate("/projects/Designer")}>Designer</button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Search;
