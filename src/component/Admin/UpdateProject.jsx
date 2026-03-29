// src/component/Admin/UpdateProject.jsx
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProjectDetails, updateProject } from "../../actions/projectAction";
import { UPDATE_PROJECT_RESET } from "../../constants/projectConstant";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import "./NewProject.css"; // Reuse NewProject.css classes for UI consistency

import { 
  FaUser, 
  FaHeading, 
  FaFileAlt, 
  FaRupeeSign, 
  FaFolderOpen, 
  FaUpload, 
  FaSpinner, 
  FaArrowLeft,
  FaImage
} from "react-icons/fa";

const UpdateProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: projectId } = useParams();

  const { loading, error: updateError, isUpdated } = useSelector((state) => state.project);
  const { project, error } = useSelector((state) => state.projectDetails);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Article", "Creative Writing", "Translations", "Speech Writing",
    "Video Editing", "Website Development", "Animation", "Graphic Design",
    "Logo Design", "Photo Editing", "Song Writing", "Audio Making",
    "Fashion Design", "Game Design", "Digital Marketing"
  ];

  useEffect(() => {
    if (!project || project._id !== projectId) {
      dispatch(getProjectDetails(projectId));
    } else {
      setName(project.name || "");
      setTitle(project.title || "");
      setDesc(project.desc || "");
      setCategory(project.category || "");
      setPrice(project.price || "");
      setOldImages(project.images || []);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Project updated successfully!");
      navigate("/admin/projects");
      dispatch({ type: UPDATE_PROJECT_RESET });
    }
  }, [dispatch, error, updateError, isUpdated, navigate, projectId, project]);

  const updateProjectSubmitHandler = (e) => {
    e.preventDefault();

    const projectData = {
      name,
      title,
      desc,
      category,
      price,
    };

    if (images.length > 0) {
      projectData.images = images;
    }

    dispatch(updateProject(projectId, projectData));
  };

  // Helper to compress image
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 1200; // Limit width
          const maxHeight = 1200; // Limit height
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as high-quality compressed JPEG
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7); // 70% quality
          resolve(dataUrl);
        };
      };
    });
  };

  const updateProjectImagesChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    const compressedImages = [];
    
    // Process files one by one with toast feedback if needed
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit per original file for sanity
        toast.error(`${file.name} is too large (>10MB).`);
        continue;
      }
      
      const compressed = await compressImage(file);
      compressedImages.push(compressed);
    }

    setImages(compressedImages);
    setImagesPreview(compressedImages);
  };

  return (
    <Fragment>
      <MetaData title="Modify Project - Admin" />

      <div className="dashboard">
        <Sidebar />

        <main className="new-project-main">
          <div className="new-project-wrapper">
            {/* Header Section */}
            <div className="page-header">
              <div>
                <h1 className="page-title">Modify Project</h1>
                <p className="page-subtitle">Update the core details, budget, or media assets for project #{projectId?.slice(-8).toUpperCase()}</p>
              </div>
              <div className="header-badge">Edit Mode</div>
            </div>

            <form className="project-form-v2" onSubmit={updateProjectSubmitHandler}>
              
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
                  <h3>Project Media Assets</h3>
                </div>

                <div className="media-upload-container">
                  <div className="upload-box">
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={updateProjectImagesChange}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="upload-label">
                      <div className="upload-icon-circle">
                        <FaUpload />
                      </div>
                      <h4>Update project images</h4>
                      <p>Selecting new images will replace existing ones on save</p>
                      <span className="selected-count">{images.length} new files selected</span>
                    </label>
                  </div>

                  {/* PREVIEW CONTAINER */}
                  <div className="images-preview-section">
                    {oldImages.length > 0 && imagesPreview.length === 0 && (
                      <div className="preview-status-badge">
                        <FaImage /> Current Project Images
                      </div>
                    )}
                    {imagesPreview.length > 0 && (
                      <div className="preview-status-badge success">
                        <FaUpload /> New Selection (Pending Save)
                      </div>
                    )}

                    <div className="preview-grid">
                      {/* Show current images if no new ones are selected */}
                      {imagesPreview.length === 0 && oldImages.map((img, index) => (
                        <div key={index} className="preview-card">
                          <img src={img.url} alt={`Current ${index + 1}`} />
                          <div className="preview-overlay">
                            <span>Current {index + 1}</span>
                          </div>
                        </div>
                      ))}

                      {/* Show new selection */}
                      {imagesPreview.map((img, index) => (
                        <div key={index} className="preview-card highlight">
                          <img src={img} alt={`New Preview ${index + 1}`} />
                          <div className="preview-overlay">
                            <span>New {index + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/admin/projects")}
                >
                  <FaArrowLeft style={{ marginRight: "8px" }} /> Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`submit-btn-v2 ${loading ? "busy" : ""}`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spin" /> Updating...
                    </>
                  ) : (
                    "Apply Changes"
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

export default UpdateProject;