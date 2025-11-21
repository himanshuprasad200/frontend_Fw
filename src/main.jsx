// src/main.jsx  ← REPLACE YOUR CURRENT FILE WITH THIS

import axios from "axios";

// THIS MUST BE AT THE VERY TOP — BEFORE ANY OTHER IMPORTS
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.PROD
  ? "https://backend-i86g.onrender.com"  // ← CHANGE TO YOUR ACTUAL BACKEND URL
  : "http://localhost:4050";

// NOW import React and others
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import store from "./store.js";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

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