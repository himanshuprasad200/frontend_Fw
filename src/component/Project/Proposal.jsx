// src/component/Project/Proposal.jsx
import React, { Fragment, useEffect, useState } from "react";
import "./Proposal.css";
import { useDispatch, useSelector } from "react-redux";
import { createBid, clearErrors } from "../../actions/bidAction";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../layout/Loader/Loader";
import { CREATE_BID_RESET } from "../../constants/bidConstant";

const Proposal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, bid } = useSelector((state) => state.newBid);
  const bidItems = useSelector((state) => state.bidItems?.bidItems || []);
  const { isAuthenticated } = useSelector((state) => state.user);

  const [proposal, setProposal] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  // Load selected projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bidItems");
    if (saved) {
      try {
        const items = JSON.parse(saved);
        items.forEach((item) =>
          dispatch({ type: "ADD_TO_BIDITEMS", payload: item })
        );
      } catch (e) {
        localStorage.removeItem("bidItems");
      }
    }
  }, [dispatch]);

  // Auth guard
  useEffect(() => {
    if (isAuthenticated === false) {
      toast.error("Please login to submit a proposal");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!proposal.trim()) {
      toast.error("Please write your proposal");
      return;
    }
    if (bidItems.length === 0) {
      toast.error("No projects selected. Please go back and add projects.");
      return;
    }

    const formData = new FormData();
    formData.append("proposal", proposal.trim());
    bidItems.forEach((item) => formData.append("bidsItems[]", item.project));
    if (file) formData.append("file", file);

    dispatch(createBid(formData));
  };

  // Handle success → redirect + clear everything
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success && bid) {
      toast.success("Bid placed successfully!");

      localStorage.removeItem("bidItems");
      dispatch({ type: "CLEAR_BID_ITEMS" });
      dispatch({ type: CREATE_BID_RESET });

      setProposal("");
      setFile(null);
      setFileName("No file chosen");

      navigate("/success", { state: { bid }, replace: true });
    }
  }, [error, success, bid, dispatch, navigate]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <div className="proposalContainer">

        {/* Form Only */}
        <form className="proposalForm" onSubmit={handleSubmit} encType="multipart/form-data">

          <div className="formGroup">
            <label className="formLabel">
              Your Proposal <span className="required">*</span>
            </label>
            <textarea
              className="proposalTextarea"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Explain your approach, timeline, experience, and why you're the best fit for the project(s)..."
              rows="12"
              required
            />
          </div>

          <div className="formGroup">
            <label className="formLabel">
              Attach File <span className="optional">(Optional)</span>
            </label>
            <div className="fileInputWrapper">
              <input
                type="file"
                id="file-upload"
                className="fileInput"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setFile(f);
                    setFileName(f.name);
                  }
                }}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              <label htmlFor="file-upload" className="fileInputLabel">
                Choose File
              </label>
              <span className="fileName">{fileName}</span>
            </div>
          </div>

          <button
            type="submit"
            className="submitButton"
            disabled={loading || bidItems.length === 0}
          >
            {loading
              ? "Submitting Bid..."
              : `Place Bid on ${bidItems.length} Project${bidItems.length > 1 ? "s" : ""}`}
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default Proposal;