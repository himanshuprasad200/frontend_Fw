// src/component/Admin/NewProject.jsx
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, createProject } from "../../actions/projectAction";
import { NEW_PROJECT_RESET } from "../../constants/projectConstant";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import "./NewProject.css";

import { 
  FaUser, 
  FaHeading, 
  FaFileAlt, 
  FaRupeeSign, 
  FaFolderOpen, 
  FaUpload, 
  FaSpinner 
} from "react-icons/fa";

const NewProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.newProject);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Article", "Creative Writing", "Translations", "Speech Writing",
    "Video Editing", "Website Development", "Animation", "Graphic Design",
    "Logo Design", "Photo Editing", "Song Writing", "Audio Making",
    "Fashion Design", "Game Design", "Digital Marketing"
  ];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Project created successfully!");
      navigate("/admin/joinasclient");
      dispatch({ type: NEW_PROJECT_RESET });
    }
  }, [dispatch, error, success, navigate]);

  const createProjectSubmitHandler = (e) => {
    e.preventDefault();

    const projectData = {
      name,
      title,
      desc,
      category,
      price,
      images, // these are now base64 strings
    };

    dispatch(createProject(projectData));
  };

  const createProjectImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Collect results to update state appropriately
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Create New Project" />

      <div className="dashboard">
        <Sidebar />

        <main className="new-project-main">
          <div className="new-project-wrapper">
            {/* Header Section */}
            <div className="page-header">
              <div>
                <h1 className="page-title">Create New Project</h1>
                <p className="page-subtitle">Fill in the details below to post your project to the marketplace.</p>
              </div>
              <div className="header-badge">Admin Mode</div>
            </div>

            <form className="project-form-v2" onSubmit={createProjectSubmitHandler}>
              
              {/* SECTION 1: BASIC INFO */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">01</div>
                  <h3>General Information</h3>
                </div>
                
                <div className="form-grid">
                  <div className="form-group-v2">
                    <label>
                      <FaUser className="input-icon" />
                      Client Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe / Company Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group-v2">
                    <label>
                      <FaHeading className="input-icon" />
                      Project Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Modern E-commerce Website Development"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group-v2 full-width">
                  <label>
                    <FaFileAlt className="input-icon" />
                    Detailed Description
                  </label>
                  <textarea
                    placeholder="Describe the scope, requirements, and deliverables..."
                    required
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>

              {/* SECTION 2: BUDGET & CATEGORY */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">02</div>
                  <h3>Budget & Classification</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group-v2">
                    <label>
                      <FaFolderOpen className="input-icon" />
                      Project Category
                    </label>
                    <div className="select-wrapper">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group-v2">
                    <label>
                      <FaRupeeSign className="input-icon" />
                      Budget Range (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      required
                      min="100"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: MEDIA */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">03</div>
                  <h3>Media Assets</h3>
                </div>

                <div className="media-upload-container">
                  <div className="upload-box">
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={createProjectImagesChange}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="upload-label">
                      <div className="upload-icon-circle">
                        <FaUpload />
                      </div>
                      <h4>Click or Drag images to upload</h4>
                      <p>Supports: JPG, PNG, WEBP (Max 5MB each)</p>
                      <span className="selected-count">{images.length} files selected</span>
                    </label>
                  </div>

                  {imagesPreview.length > 0 && (
                    <div className="preview-grid">
                      {imagesPreview.map((img, index) => (
                        <div key={index} className="preview-card">
                          <img src={img} alt={`Preview ${index + 1}`} />
                          <div className="preview-overlay">
                            <span>Image {index + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/admin/joinasclient")}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`submit-btn-v2 ${loading ? "busy" : ""}`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spin" /> Publishing...
                    </>
                  ) : (
                    "Publish Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </Fragment>
  );
};

export default NewProject;