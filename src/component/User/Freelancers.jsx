import React, { Fragment, useEffect, useState } from "react";
import "./Freelancers.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getFreelancers, getCategories } from "../../actions/userAction";
import FreelancerCard from "./FreelancerCard";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast from "../../utils/CustomToast";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import useDebounce from "../../hooks/useDebounce";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Removed static categories array to use dynamic categories from Redux

const Freelancers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category: urlCategory } = useParams();
  const location = useLocation();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState(urlCategory || "");

  // Debounce Search
  const debouncedSearch = useDebounce(searchKeyword, 500);

  const { freelancers, loading, error, freelancersCount, resultPerPage } =
    useSelector((state) => state.allFreelancers);
  const { categories } = useSelector((state) => state.dynamicCategories);

  const totalPages = Math.ceil((freelancersCount || 0) / (resultPerPage || 12)) || 1;

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    // Update category state if URL parameter changes
    if (urlCategory) {
      setCategory(urlCategory);
    } else {
      const searchParams = new URLSearchParams(location.search);
      const catParam = searchParams.get("category");
      if (catParam) setCategory(catParam);
    }
  }, [urlCategory, location.search]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    
    dispatch(getFreelancers(debouncedSearch, category, currentPage));
    
  }, [dispatch, debouncedSearch, category, currentPage, error]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const clearFilters = () => {
    setCategory("");
    setSearchKeyword("");
    setCurrentPage(1);
    navigate("/freelancers");
  };

  return (
    <Fragment>
      <MetaData title="Browse Top Talent — FlexiWork" />

      <div className="freelancers-page-container">
        {/* Talent Hero Section */}
        <div className="talent-hero">
          <div className="talent-hero-content">
             <span className="talent-badge">HIRE THE BEST</span>
             <h1>Find Top Freelance Talent</h1>
             <p>Work with curated professionals from around the globe to scale your business.</p>
             
             <div className="talent-search-bar">
                <FaSearch className="ts-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by name, role, or skills..." 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
             </div>
          </div>
        </div>

        <div className="talent-main-layout">
          {/* Category Filter Chips */}
          <div className="talent-categories-ribbon">
             <button 
                className={`category-chip ${category === "" ? "active" : ""}`}
                onClick={clearFilters}
             >
               All Talent
             </button>
             {categories.map((cat) => (
                <button 
                  key={cat}
                  className={`category-chip ${category === cat ? "active" : ""}`}
                  onClick={() => {
                    setCategory(cat);
                    setCurrentPage(1);
                    navigate(`/freelancers/${encodeURIComponent(cat)}`);
                  }}
                >
                  {cat}
                </button>
             ))}
          </div>

          <div className="talent-results-info">
             <p>
               {loading ? "Discovering talent..." : `Showing ${freelancers?.length || 0} of ${freelancersCount || 0} professionals`}
               {category && <span> in <strong>{category}</strong></span>}
             </p>
          </div>

          {loading ? (
            <div className="talent-loader-wrap">
              <Loader />
            </div>
          ) : freelancers && freelancers.length > 0 ? (
            <div className="talent-grid">
              {freelancers.map((freelancer) => (
                <FreelancerCard key={freelancer._id} freelancer={freelancer} />
              ))}
            </div>
          ) : (
            <div className="no-talent-found">
               <div className="talent-empty-icon"><FaSearch /></div>
               <h2>No Talent Found</h2>
               <p>We couldn't find any professionals matching your criteria. Try adjusting your filters.</p>
               <button className="reset-talent-btn" onClick={clearFilters}>Reset Filters</button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="talent-pagination">
              <button 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="tp-btn"
              >
                <FaChevronLeft /> Prev
              </button>

              <div className="tp-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => goToPage(i + 1)}
                    className={`tp-num ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="tp-btn"
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Freelancers;
