import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./component/layout/Header/Header";
import Home from "./component/Home/Home";
import LoginSignUp from "./component/User/LoginSignUp";
import Profile from "./component/User/Profile";
import ProjectDetails from "./component/Project/ProjectDetails";
import Projects from "./component/Project/Projects";
import BidDetails from "./component/Bid/BidDetails";
import Proposal from "./component/Project/Proposal";
import Footer from "./component/layout/Footer/Footer";
import BidSuccess from "./component/Project/BidSuccess";

function App() {
  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:keyword" element={<Projects />} />
        <Route path="/bid/:id" element={<BidDetails />} />
        <Route path="/proposal" element={<Proposal />} />
          <Route path="/success" element={<BidSuccess />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
