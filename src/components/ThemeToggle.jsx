import React from "react";
export default function ThemeToggle({ value, onChange }) {
  return (
    <div className="theme-toggle">
      <button
        className={`theme-btn ${value === "light" ? "active" : ""}`}
        onClick={() => onChange("light")}
        title="Light mode"
      >
        ☀️
      </button>

      <button
        className={`theme-btn ${value === "dark" ? "active" : ""}`}
        onClick={() => onChange("dark")}
        title="Dark mode"
      >
        🌙
      </button>

      <button
        className={`theme-btn ${value === "romantic" ? "active" : ""}`}
        onClick={() => onChange("romantic")}
        title="Romantic bright"
      >
        💖
      </button>
    </div>
  );
}
