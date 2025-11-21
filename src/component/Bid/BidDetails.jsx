import React, { Fragment, useEffect } from "react";
import "./BidDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getBidDetails } from "../../actions/bidAction";
import { Link, useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import toast from "react-hot-toast";

const BidDetails = () => {
  const { bid, error, loading } = useSelector((state) => state.bidDetails);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getBidDetails(id));
  }, [dispatch, error, id]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Bid Details" />

          {/* Main Bid Info */}
          <div className="bidDetailsPage">
            <div className="bidDetailsContainer">
              <h1 className="bidHeader">Bid #{bid?._id}</h1>

              <h2 className="sectionHeader">Bid Info</h2>
              <div className="bidDetailsContainerBox">
                <div className="bidDetail">
                  <p className="bidDetailLabel">Name:</p>
                  <span className="bidDetailValue">
                    {bid?.user?.name || "N/A"}
                  </span>
                </div>
                <div className="bidDetail">
                  <p className="bidDetailLabel">Proposal:</p>
                  <p className="bidDetailValue">{bid?.proposal || "N/A"}</p>
                </div>
              </div>

              <h2 className="sectionHeader">Bid Response</h2>
              <div className="bidDetailsContainerBox">
                <div className="bidDetail">
                  <span
                    className={`statusLabel ${
                      bid?.response === "Approved"
                        ? "greenColor"
                        : bid?.response === "Pending"
                        ? "orangeColor"
                        : "redColor"
                    }`}
                  >
                    {bid?.response || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bid Items */}
          <div className="bidDetailsBidItems">
            <h3 className="sectionTitle">Bid Items:</h3>
            <div className="bidDetailsBidItemsContainer">
             {bid?.bidsItems && bid.bidsItems.length > 0 ? (
  bid.bidsItems.map((item) => (
    <div key={item.project} className="bidItemCard">
      <div className="bidItemImageContainer">
        <img
          src={item.image || "/default.jpg"}
          alt={item.title}
          className="bidItemImage"
        />
      </div>
      <div className="bidItemContent">
        <p className="bidItemName">
          Client: <strong>{item.name || "N/A"}</strong>
        </p>
        <Link to={`/project/${item.project}`} className="bidItemTitle">
          {item.title || "Untitled Project"}
        </Link>
        <p className="bidItemCategory">Category: {item.category || "N/A"}</p>
        <p className="bidItemPrice">
          ₹ {item.price ? item.price.toLocaleString() : "0"}
        </p>
      </div>
    </div>
  ))
) : (
  <p className="noItems">No bid items found.</p>
)}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default BidDetails;