import "./lib/pwa-install";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

// Preserve links shared before the move from hash URLs to ordinary paths.
if (window.location.hash.startsWith("#/")) {
  const legacyPath = window.location.hash.slice(2);
  window.history.replaceState(null, "", `${import.meta.env.BASE_URL}${legacyPath}`);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
