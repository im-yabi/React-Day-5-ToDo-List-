import React from "react";

export default function Filter({ value, onChange, counts }) {
  return (
    <div className="card filter-card animated-card">
      <h4>Filter</h4>
      <div className="filters">
        <button className={`btn ${value === "all" ? "active" : ""}`} onClick={() => onChange("all")}>
          All <span className="pill">{counts?.all ?? 0}</span>
        </button>
        <button className={`btn ${value === "completed" ? "active" : ""}`} onClick={() => onChange("completed")}>
          Completed <span className="pill">{counts?.completed ?? 0}</span>
        </button>
        <button className={`btn ${value === "notcompleted" ? "active" : ""}`} onClick={() => onChange("notcompleted")}>
          Not Completed <span className="pill">{counts?.notcompleted ?? 0}</span>
        </button>
      </div>
    </div>
  );
}
