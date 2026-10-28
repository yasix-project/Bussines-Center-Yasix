import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// 1. Import font DULUAN (tambahkan weight 700 untuk bold)
import "@fontsource/geist-sans";
import "@fontsource/geist-sans/700.css";
import "@fontsource/geist-mono";

// 2. Import index.css SETELAH font di-load
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
