import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import ProjectCard from "../Home/ProjectCard";
import axios from "axios";
import toast from "../../utils/CustomToast";
import { FiBookmark } from "react-icons/fi";
import { useSelector } from "react-redux";
import "./SavedProjects.css";

const SavedProjects = () => {
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);

  const fetchSavedProjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/projects/saved");
      if (data.success) {
        setSavedProjects(data.savedProjects || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch saved projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProjects();
  }, [user]); // Re-fetch if user toggles bookmark on this or other pages

  return (
    <>
      <MetaData title="Saved Projects - FlexiWork" />
      {loading ? (
        <div className="saved-projects-loader">
          <Loader />
        </div>
      ) : (
        <div className="saved-projects-container">
          <div className="saved-projects-header">
            <h1 className="sp-title">Saved Projects</h1>
            <p className="sp-subtitle">Manage and apply to the projects you've saved for later</p>
          </div>

          {savedProjects.length === 0 ? (
            <div className="sp-empty-state">
              <div className="sp-empty-icon-box">
                <FiBookmark className="sp-empty-icon" />
              </div>
              <h3>No Saved Projects Yet</h3>
              <p>Explore projects and tap the bookmark button to save them here for quick access later.</p>
              <Link to="/projects" className="sp-explore-btn-link">
                Explore Projects
              </Link>
            </div>
          ) : (
            <div className="sp-grid">
              {savedProjects.map((project) => (
                <div key={project._id} className="sp-card-wrapper">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SavedProjects;
