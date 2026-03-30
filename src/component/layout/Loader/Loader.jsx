import React from "react";
import "./Loader.css";

const Loader = () => {
  return ( 
    <div className="loader-container">
      <div className="loader-box">
        <div className="loader-rings">
          <div className="ring ring-outer"></div>
          <div className="ring ring-inner"></div>
          <div className="ring ring-center"></div>
        </div>
        <div className="loader-text">Loading Assets...</div>
      </div>
    </div>
  );
};

export default Loader;