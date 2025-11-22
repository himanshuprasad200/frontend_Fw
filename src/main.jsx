// src/main.jsx
import axios from "axios";

// THIS MUST BE AT THE TOP
axios.defaults.withCredentials = true;

// CORRECT BASE URL — ONLY backend
axios.defaults.baseURL = "https://backend-i86g.onrender.com";

// DO NOT set baseURL differently in dev/prod for cookies to work
// Just use the backend URL directly

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