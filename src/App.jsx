import React, { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoCard from "./components/TodoCard";
import Filter from "./components/Filter";
import ThemeToggle from "./components/ThemeToggle";

const LOCAL_KEY = "react_todo_tasks_v1";
const THEME_KEY = "react_todo_theme_v1";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState("romantic");
  const [showLeft, setShowLeft] = useState(true); // controls left pane visibility on small screens
  const [isMobile, setIsMobile] = useState(false);

  // load todos & theme
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try { setTodos(JSON.parse(raw)); } catch { setTodos([]); }
    }
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) setTheme(savedTheme);

    // responsive init
    const mq = window.matchMedia("(max-width: 880px)");
    const handler = (e) => {
      setIsMobile(e.matches);
      setShowLeft(!e.matches); // show left by default on desktop, hide on mobile
    };
    handler(mq); // initial
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function addTodo(data) {
    const newTodo = {
      id: Date.now().toString(),
      name: data.name,
      desc: data.desc,
      status: data.status || "notcompleted",
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
    if (isMobile) setShowLeft(false); // hide form after add on mobile to show list
  }

  function updateTodo(id, updates) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    setEditingTodo(null);
  }

  function removeTodo(id) {
    if (!window.confirm("Delete this task?")) return;
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function changeStatus(id, newStatus) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
  }

  const filtered = todos.filter((t) => {
    if (filter === "all") return true;
    if (filter === "completed") return t.status === "completed";
    if (filter === "notcompleted") return t.status === "notcompleted";
    return true;
  });

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <div className="logo-blob" aria-hidden />
          <h1> Todo List ✨</h1>
        </div>

        <div className="header-row">
          <p className="sub"> responsive on phone, tablet & desktop</p>

          <div className="header-controls">
            {/* Toggle left pane visibility on small screens */}
            <button
              className="btn small header-toggle"
              onClick={() => setShowLeft(s => !s)}
              title={showLeft ? "Hide form/filter" : "Show form/filter"}
            >
              {showLeft ? "Hide" : "Show"} Menu
            </button>

            <ThemeToggle value={theme} onChange={setTheme} />
          </div>
        </div>
      </header>

      <main className="container responsive">
        {/* left side (form + filter) - collapsible on small screens */}
        {showLeft && (
          <aside className="left responsive-left">
            <TodoForm
              key={editingTodo ? editingTodo.id : "new"}
              onAdd={addTodo}
              onUpdate={updateTodo}
              editing={editingTodo}
              onCancel={() => setEditingTodo(null)}
            />
            <Filter
              value={filter}
              onChange={setFilter}
              counts={{
                all: todos.length,
                completed: todos.filter(t => t.status === "completed").length,
                notcompleted: todos.filter(t => t.status === "notcompleted").length
              }}
            />
          </aside>
        )}

        <section className="right">
          <div className="cards-grid">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="sparkle" />
                <p>No tasks yet — add your first todo.</p>
                <small>Use the form (open the Menu) to create one.</small>
              </div>
            ) : (
              filtered.map((todo, i) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onEdit={() => { setEditingTodo(todo); if (isMobile) setShowLeft(true); }}
                  onDelete={() => removeTodo(todo.id)}
                  onChangeStatus={(s) => changeStatus(todo.id, s)}
                  index={i}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <small>Made with Todo — responsive layout</small>
      </footer>
    </div>
  );
}
