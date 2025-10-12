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

  // customer changes
const [editingId, setEditingId] = useState<number | null>(null);
const [isAdding, setIsAdding] = useState<boolean>(false);
const [form, setForm] = useState({first_name: "", last_name: "", email: "", store_id: 1, address_id: 1, active: 1,});

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

  // save the added customer
  async function saveAdd() {
    await fetch(`${API_BASE}/customers/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });
    setIsAdding(false);
    // refresh current page
    fetchCustomers(searchBy as any, query, page);
}

    // save the edited customer
  async function saveEdit() {
    if (editingId == null) return;
    await fetch(`${API_BASE}/customers/edit/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });
    setEditingId(null);
    fetchCustomers(searchBy as any, query, page);
}

  async function handleDelete(id: number) {
    await fetch(`${API_BASE}/customers/delete/${id}`, { method: "DELETE" });
    fetchCustomers(searchBy as any, query, page);
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

  // open add menu
  function openAdd() {
    setIsAdding(true);
    setEditingId(null);
    setForm({ first_name: "", last_name: "", email: "", store_id: 1, address_id: 1, active: 1 });
}

  // open edit menu 
  function openEdit(c: any) {
    setEditingId(c.customer_id);
    setIsAdding(false);
    setForm({
        first_name: c.first_name || "",
        last_name:  c.last_name  || "",
        email:      c.email      || "",
        store_id:   1,
        address_id: 1,
        active:     typeof c.active === "number" ? c.active : 1,});
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
            <button type="button" onClick={() => handleModeClick("id")} style={{
              padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
              background: searchBy === "id" ? "#4f46e5" : "white", color: searchBy === "id" ? "white" : "#374151", fontWeight: 600, cursor: "pointer"
            }}>Search by ID</button>
            <button type="button" onClick={() => handleModeClick("first_name")} style={{
              padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
              background: searchBy === "first_name" ? "#4f46e5" : "white", color: searchBy === "first_name" ? "white" : "#374151", fontWeight: 600, cursor: "pointer"
            }}>Search by First Name</button>
            <button type="button" onClick={() => handleModeClick("last_name")} style={{
              padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
              background: searchBy === "last_name" ? "#4f46e5" : "white", color: searchBy === "last_name" ? "white" : "#374151", fontWeight: 600, cursor: "pointer"
            }}>Search by Last Name</button>
            <button type="submit" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #4f46e5", background: "#4f46e5", color: "white", fontWeight: 700, cursor: "pointer" }}>Search</button>
            <button type="button" onClick={() => { setQuery(""); setSearchBy("all"); fetchCustomers("all", "", page); }} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontWeight: 600, cursor: "pointer" }}>Show All</button>
          </div>
        </div>
      </form>

      {/* Add Customer Button */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={openAdd} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #10b981", background: "#10b981", color: "white", fontWeight: 700, cursor: "pointer" }}>
          + Add Customer
        </button>
      </div>

      {/* Add Customer Form */}
      {isAdding && (
        <div style={{ backgroundColor: "white", borderRadius: 12, padding: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", marginBottom: 16 }}>
          <h3 style={{ margin: 0, marginBottom: 12, fontWeight: 700, color: "#111827" }}>Add New Customer</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                   style={{ height: 44, padding: "0 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 16 }} />
            <input placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                   style={{ height: 44, padding: "0 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 16 }} />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                   style={{ gridColumn: "1 / -1", height: 44, padding: "0 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 16 }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
            <button onClick={() => setIsAdding(false)} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontWeight: 600, cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={saveAdd} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #10b981", background: "#10b981", color: "white", fontWeight: 700, cursor: "pointer" }}>
              Save Customer
            </button>
          </div>
        </div>
      )}

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

                  <div style={{ marginTop: 6, color: "#6b7280", fontSize: 14 }}>
                    {c.email || "No email"}
                  </div>

                  <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 13, color: "#374151" }}>
                    {typeof c.active === "number" && <span>Status: {c.active ? "Active" : "Inactive"}</span>}
                    {c.create_date && <span>Created: {new Date(c.create_date).toLocaleDateString()}</span>}
                  </div>

                  {/* action buttons */}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={() => openEdit(c)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #111827", background: "white", color: "#111827", fontWeight: 600, cursor: "pointer" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c.customer_id)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #b91c1c", background: "white", color: "#b91c1c", fontWeight: 600, cursor: "pointer" }}>
                      Delete
                    </button>
                  </div>

                  {/* inline EDIT form */}
                  {editingId === c.customer_id && (
                    <div style={{ marginTop: 12, padding: 12, border: "1px dashed #e5e7eb", borderRadius: 8 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <input placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                               style={{ height: 36, padding: "0 10px", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                        <input placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                               style={{ height: 36, padding: "0 10px", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                               style={{ gridColumn: "1 / -1", height: 36, padding: "0 10px", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" }}>
                        <button onClick={() => setEditingId(null)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontWeight: 600, cursor: "pointer" }}>
                          Cancel
                        </button>
                        <button onClick={saveEdit} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #111827", background: "white", color: "#111827", fontWeight: 600, cursor: "pointer" }}>
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* pagination */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <button
                disabled={page === 1}
                onClick={prevPage}
                style={{ color: "#111827", padding: "8px 12px", borderRadius: 8, border: "1px solid #111827", background: "white", cursor: page === 1 ? "not-allowed" : "pointer", opacity: 1 }}
              >
                Prev
              </button>
              <div style={{ alignSelf: "center", color: "#6b7280", fontSize: 14 }}>Page {page}</div>
              <button
                disabled={!hasNext}
                onClick={nextPage}
                style={{ color: "#111827", padding: "8px 12px", borderRadius: 8, border: "1px solid #111827", background: "white", cursor: hasNext ? "pointer" : "not-allowed", opacity: 1 }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
 )}
;
