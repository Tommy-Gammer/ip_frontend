import { useEffect, useState } from "react";

type Customer = any

const API_BASE = "http://localhost:5000/api";
type SearchBy = "all" | "id" | "first_name" | "last_name";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [searchBy, setSearchBy] = useState<SearchBy>("all");

  // pagination
  const [page, setPage] = useState<number>(1);
  const pageSize = 25;
  const [hasNext, setHasNext] = useState<boolean>(false);

  // fetch all customers
  async function fetchCustomers(mode: SearchBy, q: string, pg: number) {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("by", mode);
    if (q.trim()) params.set("q", q.trim());
    params.set("page", String(pg));
    params.set("page_size", String(pageSize));

    const res = await fetch(`${API_BASE}/customers/search?${params.toString()}`);
    const data = await res.json();
    setCustomers(data.items || []);
    setHasNext(!!data.has_next);
    setLoading(false);
  }

  // initially load all customers
  useEffect(() => {
    fetchCustomers("all", "", 1);
  }, []);

  // change search mode
  function handleModeClick(mode: SearchBy) {
    setSearchBy(mode);
  }

  // submit search
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchCustomers(searchBy, query, 1);
  }

  // pagination controls
  function prevPage() {
    const next = Math.max(1, page - 1);
    setPage(next);
    fetchCustomers(searchBy, query, next);
  }
  function nextPage() {
    const next = page + 1;
    setPage(next);
    fetchCustomers(searchBy, query, next);
  }

  return (
    <div style={{ margin: 0, padding: 0, width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* search */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
            <input
              placeholder={"Search (choose a mode and click Search)"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ height: 44, padding: "0 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 16, outline: "none" }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => handleModeClick("id")}
                style={{
                  padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
                  background: searchBy === "id" ? "#4f46e5" : "white", color: searchBy === "id" ? "white" : "#374151",
                  fontWeight: 600, cursor: "pointer"
                }}
              >
                Search by ID
              </button>
              <button
                type="button"
                onClick={() => handleModeClick("first_name")}
                style={{
                  padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
                  background: searchBy === "first_name" ? "#4f46e5" : "white", color: searchBy === "first_name" ? "white" : "#374151",
                  fontWeight: 600, cursor: "pointer"
                }}
              >
                Search by First Name
              </button>
              <button
                type="button"
                onClick={() => handleModeClick("last_name")}
                style={{
                  padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
                  background: searchBy === "last_name" ? "#4f46e5" : "white", color: searchBy === "last_name" ? "white" : "#374151",
                  fontWeight: 600, cursor: "pointer"
                }}
              >
                Search by Last Name
              </button>
              <button
                type="submit"
                style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #4f46e5", background: "#4f46e5", color: "white", fontWeight: 700, cursor: "pointer" }}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => { setQuery(""); setSearchBy("all"); setPage(1); fetchCustomers("all", "", 1); }}
                style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontWeight: 600, cursor: "pointer" }}
              >
                Show All
              </button>
            </div>
          </div>
        </form>

        {/* results */}
        <div style={{ backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {loading ? (
            <div style={{ padding: 20 }}>Loading…</div>
          ) : customers.length === 0 ? (
            <div style={{ padding: 20, color: "#6b7280" }}>No customers found.</div>
          ) : (
            <>
              <div style={{ maxHeight: "70vh", overflowY: "auto", display: "grid", gap: 12 }}>
                {customers.map((c) => (
                  <div key={c.customer_id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 14, background: "#fff" }}>
                    <h3 style={{ margin: 0, fontWeight: 700, color: "#111827" }}>
                      {c.first_name} {c.last_name} <span style={{ color: "#6b7280", fontWeight: 400 }}>#{c.customer_id}</span>
                    </h3>
                  </div>
                ))}
              </div>

              {/* pagination */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                <button disabled={page === 1} onClick={prevPage} style={{ color: page === 1 ? "#9CA3AF" : "#111827", padding: "8px 12px", borderRadius: 8, border: "1px solid #111827", background: "white", cursor: page === 1 ? "not-allowed" : "pointer" }}>
                  Prev
                </button>
                <div style={{ alignSelf: "center", color: "#6b7280", fontSize: 14 }}>Page {page}</div>
                <button disabled={!hasNext} onClick={nextPage} style={{ color: hasNext ? "#111827" : "#9CA3AF", padding: "8px 12px", borderRadius: 8, border: "1px solid #111827", background: hasNext ? "white" : "#f9fafb", cursor: hasNext ? "pointer" : "not-allowed" }}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
