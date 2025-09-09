import React, { useState, useEffect, useRef } from "react";
export default function TodoCard({
  todo,
  onEdit,
  onDelete,
  onChangeStatus,
  index = 0,
}) {
  const [openStatus, setOpenStatus] = useState(false);
  const cardRef = useRef(null);
  const dropdownRef = useRef(null);
  const delay = Math.min(index * 60, 360);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--enter-delay", `${delay}ms`);
    }
  }, [delay]);

  useEffect(() => {
    function onDocClick(e) {
      if (
        openStatus &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        cardRef.current &&
        !cardRef.current.contains(e.target)
      ) {
        setOpenStatus(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setOpenStatus(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openStatus]);
  function toggleStatusDropdown(e) {
    e.stopPropagation();
    setOpenStatus((v) => !v);
  }

  function onOptionKey(e, status) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChangeStatus(status);
      setOpenStatus(false);
    }
  }

  function handleSelect(status) {
    onChangeStatus(status);
    setOpenStatus(false);
  }

  const createdText = todo.createdAt
    ? new Date(todo.createdAt).toLocaleString()
    : "";

  return (
    <article
      ref={cardRef}
      className={`card todo-card animated-card ${todo.status === "completed" ? "done" : ""}`}
      data-id={todo.id}
      aria-labelledby={`todo-title-${todo.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const btn = cardRef.current?.querySelector(".status-btn");
          if (btn) btn.focus();
        } else if (e.key.toLowerCase() === "e") {
          onEdit();
        } else if (e.key.toLowerCase() === "d") {
          onDelete();
        }
      }}
    >
      <div className="card-top">
        <div className="title">
          <strong id={`todo-title-${todo.id}`}>{todo.name}</strong>
          <div className="meta">
            <small>{createdText}</small>
          </div>
        </div>

        <div className="actions">
          <div className="status-control" ref={dropdownRef}>
            <button
              type="button"
              className={`btn status-btn ${todo.status === "completed" ? "complete" : "not"}`}
              onClick={toggleStatusDropdown}
              aria-haspopup="menu"
              aria-expanded={openStatus}
              aria-controls={`status-menu-${todo.id}`}
              title={`Status: ${todo.status}`}
            >
              <span className="status-dot" aria-hidden />
              <span className="status-label">
                {todo.status === "completed" ? "Completed" : "Not Completed"}
              </span>
            </button>

            {openStatus && (
              <div
                id={`status-menu-${todo.id}`}
                role="menu"
                className="status-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  role="menuitem"
                  tabIndex={0}
                  className="option"
                  onClick={() => handleSelect("completed")}
                  onKeyDown={(e) => onOptionKey(e, "completed")}
                >
                  Completed
                </div>

                <div
                  role="menuitem"
                  tabIndex={0}
                  className="option"
                  onClick={() => handleSelect("notcompleted")}
                  onKeyDown={(e) => onOptionKey(e, "notcompleted")}
                >
                  Not Completed
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit task"
            aria-label={`Edit ${todo.name}`}
          >
            Edit
          </button>

          <button
            type="button"
            className="btn small danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete task"
            aria-label={`Delete ${todo.name}`}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="card-body" title={todo.desc || ""}>
        <p className="desc">{todo.desc || <i>No description</i>}</p>
      </div>
    </article>
  );
}
