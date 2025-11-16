import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "./components/ItemCard";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export default function App() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("all");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // theme: "light" | "dark"
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("dg_theme");
      if (saved) return saved;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme; // optional hook for CSS if needed
    localStorage.setItem("dg_theme", theme);
  }, [theme]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (mode !== "all") params.mode = mode;
      if (search.trim()) params.search = search.trim();
      if (maxPrice !== "") {
        const n = Number(maxPrice);
        if (!Number.isNaN(n)) params.maxPrice = n;
      }

      const res = await axios.get(`${API_BASE}/items`, { params });
      if (res?.data?.items) setItems(res.data.items);
      else {
        setItems([]);
        setError("Server returned no items.");
      }
    } catch (err) {
      console.error("API error", err);
      if (err.response) setError(`API error: ${err.response.status} ${err.response.statusText}`);
      else if (err.request) setError("No response from server. Is the server running?");
      else setError("Request error: " + err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const rootClass =
    theme === "dark"
      ? "min-h-screen bg-slate-900 text-slate-100"
      : "min-h-screen bg-slate-50 text-slate-900";

  return (
    <div className={rootClass}>
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6 flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Digvijay Express — Shipments Catalog</h1>
            <p className="text-sm text-slate-400">Filter shipments by mode, price or search text.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              title="Toggle theme"
              className="px-3 py-2 rounded border hover:opacity-90"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <section className={theme === "dark" ? "bg-slate-800 p-4 rounded shadow-sm" : "bg-white p-4 rounded shadow-sm"}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
            className="flex flex-col sm:flex-row gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Search name / origin / destination"
              className={
                "flex-1 rounded px-3 py-2 " + (theme === "dark" ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-white border text-slate-900")
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className={"rounded px-3 py-2 " + (theme === "dark" ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-white border text-slate-900")}
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="all">All modes</option>
              <option value="rail">Rail</option>
              <option value="air">Air</option>
              <option value="sea">Sea</option>
            </select>

            <input
              type="number"
              placeholder="Max price"
              className={
                "rounded px-3 py-2 w-32 " + (theme === "dark" ? "bg-slate-700 border-slate-600 text-slate-100" : "bg-white border text-slate-900")
              }
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("all");
                setSearch("");
                setMaxPrice("");
                load();
              }}
              className="ml-auto text-sm underline"
            >
              Reset
            </button>
          </form>

          <div className="mt-3 text-sm">
            {loading ? (
              <span className="text-slate-400">Loading…</span>
            ) : error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              <span className="text-slate-400">Results: {items.length}</span>
            )}
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="text-sm text-slate-400">Loading…</div>
            ) : items.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {items.map((it) => (
                  <ItemCard key={it.id} item={it} theme={theme} />
                ))}
              </div>
            ) : (
              !error && <div className="text-sm text-slate-400">No items to display.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}