import { useEffect, useMemo, useState } from "react";

type Film = any

const API_BASE = "http://localhost:5000/api";

type SearchBy = "all" | "film" | "actor" | "genre";

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [searchBy, setSearchBy] = useState<SearchBy>("all");

  // fetch films
  async function fetchFilms(mode: SearchBy, q: string) {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("by", mode);
    if (q.trim().length) params.set("q", q.trim());
    const res = await fetch(`${API_BASE}/films/search?${params.toString()}`);
    const data: Film[] = await res.json();
    setFilms(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchFilms("all", "");
  }, []);

  // change mode
  function handleModeClick(mode: SearchBy) {
    setSearchBy(mode);
  }

  // submit search
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchFilms(searchBy, query);
  }

  // header style
  const headerStyle = useMemo(
    () => ({
      fontSize: 24,
      fontWeight: 700 as const,
      color: "#1f2937",
      marginBottom: 20,
    }),
    []
  );

  // ui
  return (
    <div style={{ margin: 0, padding: 0, width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* title */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={headerStyle}>Films</h1>
        </div>

        {/* search */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            {/* input */}
            <input
              placeholder={"Search (choose a mode and click Search)"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                height: 44,
                padding: "0 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 16,
                outline: "none",
              }}
            />

            {/* buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => handleModeClick("film")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: searchBy === "film" ? "#4f46e5" : "white",
                  color: searchBy === "film" ? "white" : "#374151",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Search by Film
              </button>
              <button
                type="button"
                onClick={() => handleModeClick("actor")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: searchBy === "actor" ? "#4f46e5" : "white",
                  color: searchBy === "actor" ? "white" : "#374151",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Search by Actor
              </button>
              <button
                type="button"
                onClick={() => handleModeClick("genre")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: searchBy === "genre" ? "#4f46e5" : "white",
                  color: searchBy === "genre" ? "white" : "#374151",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Search by Genre
              </button>
              <button
                type="submit"
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid #4f46e5",
                  background: "#4f46e5",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSearchBy("all");
                  fetchFilms("all", "");
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  color: "#374151",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Show All
              </button>
            </div>
          </div>
        </form>

        {/* results */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {loading ? (
            <div style={{ padding: 20 }}>Loading…</div>
          ) : films.length === 0 ? (
            <div style={{ padding: 20, color: "#6b7280" }}>No films found.</div>
          ) : (
            <div
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
                display: "grid",
                gap: 12,
              }}
            >
              {films.map((f) => (
                <div
                  key={f.film_id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: 14,
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontWeight: 700, color: "#111827" }}>
                        {f.title}
                      </h3>
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#6b7280",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {f.description || "No description."}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          marginTop: 10,
                          fontSize: 13,
                          color: "#374151",
                        }}
                      >
                        {f.category && <span>Genre: {f.category}</span>}
                        {f.actors && <span>Actors: {f.actors}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
