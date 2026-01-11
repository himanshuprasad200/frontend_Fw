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

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("title", title);
    myForm.set("desc", desc);
    myForm.set("category", category);
    myForm.set("price", price);

    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(createProject(myForm));
  };

  const createProjectImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]); // store real File objects
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
          <div className="new-project-container">
            <h1 className="page-title">Create New Project</h1>

            <form className="project-form" onSubmit={createProjectSubmitHandler}>
              {/* Name */}
              <div className="form-group">
                <label>
                  <FaUser className="input-icon" />
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Title */}
              <div className="form-group">
                <label>
                  <FaHeading className="input-icon" />
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="Give your project a clear title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>
                  <FaFileAlt className="input-icon" />
                  Project Description
                </label>
                <textarea
                  placeholder="Describe what you need in detail..."
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={5}
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label>
                  <FaRupeeSign className="input-icon" />
                  Budget (₹)
                </label>
                <input
                  type="number"
                  placeholder="How much are you willing to pay?"
                  required
                  min="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label>
                  <FaFolderOpen className="input-icon" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Images */}
              <div className="form-group">
                <label>
                  <FaUpload className="input-icon" />
                  Upload Project Images
                </label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={createProjectImagesChange}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    Choose Files ({images.length} selected)
                  </label>
                </div>
              </div>

              {/* Preview */}
              {imagesPreview.length > 0 && (
                <div className="image-preview-container">
                  {imagesPreview.map((img, index) => (
                    <div key={index} className="preview-item">
                      <img src={img} alt={`Preview ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`submit-btn ${loading ? "loading" : ""}`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spin" /> Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </Fragment>
  );
};

export default NewProject;