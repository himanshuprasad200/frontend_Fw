// src/main.jsx
import axios from "axios";

// CRITICAL: Use proxy → baseURL must be EMPTY
axios.defaults.baseURL = "";  // ← EMPTY STRING
axios.defaults.withCredentials = true;

// Force credentials on every request
axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

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