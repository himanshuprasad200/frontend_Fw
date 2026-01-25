// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import axios from "axios";

import "./index.css";
import App from "./App.jsx";
import store from "./store.js";

// ===============================================
// 1. AXIOS GLOBAL CONFIG (Backend + Auth Token)
// ===============================================
axios.defaults.baseURL = "https://backend-1-mp9a.onrender.com";
axios.defaults.withCredentials = true;

// Automatically attach JWT token to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================================
// 2. GSAP + SCROLLTRIGGER SETUP (FOR HOME PAGE ANIMATIONS)
// ===============================================
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

// Make gsap globally available so Home.jsx can useEffect can access it safely
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

// Optional: You can also expose ScrollTrigger globally if needed
// window.ScrollTrigger = ScrollTrigger;

// ===============================================
// 3. RENDER APP
// ===============================================
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);