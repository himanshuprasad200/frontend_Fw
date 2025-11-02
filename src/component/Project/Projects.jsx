import React, { Fragment, useEffect, useState } from "react";
import "./Project.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProject } from "../../actions/projectAction";
import Loader from "../layout/Loader/Loader";
import ProjectCard from "../Home/ProjectCard";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";

const categories = [
  "Article", "Creative Writing", "Translations", "Speech Writing",
  "Video Editing", "Website Development", "Animation", "Graphic Design",
  "Logo Design", "Photo Editing", "Song Writing", "Audio Making",
  "Fashion Design", "Game Design", "Digital Marketing",
];

const Projects = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 90000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const { projects, loading, error, projectsCount, resultPerPage } =
    useSelector((state) => state.projects);

  // Total pages
  const totalPages = Math.ceil(projectsCount / resultPerPage);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProject(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, error]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Projects — FlexiWork" />

          <h2 className="projectsHeading">Projects</h2>

          {/* Project List */}
          <div className="projects">
            {projects?.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>

          {/* Filter Box */}
          <div className="filterBox">
            {/* Price Range */}
            <div className="filterItem">
              <label>Price: ₹{price[0]} - ₹{price[1]}</label>
              <input
                type="range"
                min="0"
                max="90000"
                step="1000"
                value={price[0]}
                onChange={(e) => setPrice([+e.target.value, price[1]])}
                className="rangeSlider"
              />
              <input
                type="range"
                min="0"
                max="90000"
                step="1000"
                value={price[1]}
                onChange={(e) => setPrice([price[0], +e.target.value])}
                className="rangeSlider"
              />
            </div>

            {/* Categories */}
            <div className="filterItem">
              <label>Categories</label>
              <ul className="categoryBox">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={`category-link ${category === cat ? "active" : ""}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ratings */}
            <div className="filterItem">
              <label>Ratings Above: {ratings} stars</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={ratings}
                onChange={(e) => setRatings(+e.target.value)}
                className="rangeSlider"
              />
            </div>
          </div>

          {/* Raw Pagination */}
          {totalPages > 1 && (
            <div className="paginationBox">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="pageBtn"
              >
                First
              </button>

              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pageBtn"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`pageBtn ${currentPage === page ? "active" : ""}`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return <span key={page} className="pageDots">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pageBtn"
              >
                Next
              </button>

              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="pageBtn"
              >
                Last
              </button>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Projects;