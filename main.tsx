import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize theme from localStorage or default to light
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
