import React, { useEffect, useState } from "react";

export default function TodoForm({ onAdd, editing, onUpdate, onCancel }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("notcompleted");

  useEffect(() => {
    if (editing) {
      setName(editing.name || "");
      setDesc(editing.desc || "");
      setStatus(editing.status || "notcompleted");
    } else {
      setName("");
      setDesc("");
      setStatus("notcompleted");
    }
  }, [editing]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Task name is required");
      return;
    }
    const payload = { name: name.trim(), desc: desc.trim(), status };
    if (editing) {
      onUpdate(editing.id, payload);
    } else {
      onAdd(payload);
      setName("");
      setDesc("");
      setStatus("notcompleted");
    }
  }

  return (
    <div className="card form-card animated-card">
      <h3>{editing ? "Edit Task" : "Create Task"}</h3>
      <form onSubmit={handleSubmit} className="todo-form">
        <label className={`float ${name ? "filled" : ""}`}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder=" "
            autoComplete="off"
          />
          <span className="label">Task name</span>
        </label>

        <label className={`float ${desc ? "filled" : ""}`}>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder=" "
          />
          <span className="label">Description (optional)</span>
        </label>

    

        <div className="form-actions">
          <button type="submit" className="btn primary glowing">
            {editing ? "Update" : "Add Task"}
          </button>
          {editing ? (
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
