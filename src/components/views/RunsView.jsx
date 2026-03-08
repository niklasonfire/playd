export default function RunsView({ runs, onSelect, emptyText }) {
  if (!runs.length) return <div className="empty fade-in"><div className="empty-icon">▶</div><div className="empty-text">{emptyText}</div></div>;
  return (
    <div className="card-grid fade-in">
      {runs.map((r) => {
        const total = r.checklists.reduce((s, c) => s + c.tasks.length, 0);
        const dn = r.checklists.reduce((s, c) => s + c.tasks.filter((t) => t.done).length, 0);
        const pct = total > 0 ? Math.round((dn / total) * 100) : 0;
        return (
          <div key={r.id} className="card card-clickable" onClick={() => onSelect(r.id)}>
            <div className="card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 15, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                <span className={`badge ${r.status === "finished" ? "done" : "active"}`}><span className="badge-dot" />{r.status === "finished" ? "Done" : "Active"}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{r.templateName} · {new Date(r.startedAt).toLocaleDateString()}</div>
              <div className="progress-wrap"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 4 }}>{dn}/{total} · {pct}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
