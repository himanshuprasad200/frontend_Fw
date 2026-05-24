import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-box">
        <div className="modern-spinner">
          <div className="spinner-orbit"></div>
          <div className="spinner-planet"></div>
          <div className="spinner-core"></div>
        </div>
        <div className="loader-brand-text" aria-label="Loading FlexiWork">
          <span>F</span>
          <span>L</span>
          <span>E</span>
          <span>X</span>
          <span>I</span>
          <span>W</span>
          <span>O</span>
          <span>R</span>
          <span>K</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;