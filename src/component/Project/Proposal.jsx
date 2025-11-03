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

  const { loading, error, success } = useSelector((state) => state.newBid);
  const { bidItems } = useSelector((state) => state.bidItems);

  const [proposal, setProposal] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  const handleProposalChange = (e) => {
    setProposal(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName("No file chosen");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!proposal.trim()) {
      toast.error("Proposal is required");
      return;
    }

    const formData = new FormData();
    formData.append("proposal", proposal);
    if (file) formData.append("file", file);
    bidItems.forEach((item, index) => {
      formData.append(`bidsItems[${index}][project]`, item.project);
      formData.append(`bidsItems[${index}][name]`, item.name);
      formData.append(`bidsItems[${index}][title]`, item.title);
      formData.append(`bidsItems[${index}][category]`, item.category);
      formData.append(`bidsItems[${index}][price]`, item.price);
      formData.append(`bidsItems[${index}][image]`, item.image);
    });

    dispatch(createBid(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Bid placed successfully!");
      navigate("/success");
      setProposal("");
      setFile(null);
      setFileName("No file chosen");
      dispatch({ type: CREATE_BID_RESET });
    }
  }, [dispatch, error, success, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="proposalContainer">
            <form className="proposalForm" onSubmit={handleSubmit}>
              <h2 className="formTitle">Submit Your Proposal</h2>

              <div className="formGroup">
                <label htmlFor="proposal" className="formLabel">
                  Your Proposal <span className="required">*</span>
                </label>
                <textarea
                  id="proposal"
                  className="proposalTextarea"
                  value={proposal}
                  onChange={handleProposalChange}
                  placeholder="Explain your approach, timeline, and why you're the best fit..."
                  rows={8}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="file" className="formLabel">
                  Upload File (Image/Video) <span className="optional">(Optional)</span>
                </label>
                <div className="fileInputWrapper">
                  <input
                    id="file"
                    type="file"
                    className="fileInput"
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                  />
                  <label htmlFor="file" className="fileInputLabel">
                    Choose File
                  </label>
                  <span className="fileName">{fileName}</span>
                </div>
              </div>

              <button type="submit" className="submitButton" disabled={loading}>
                {loading ? "Submitting..." : "Place Bid"}
              </button>
            </form>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Proposal;