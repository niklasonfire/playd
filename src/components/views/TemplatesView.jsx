import Icon from "../Icon";

export default function TemplatesView({ templates, onEdit, onDelete, onStartRun, onCreate }) {
  if (!templates.length) return (
    <div className="empty fade-in"><div className="empty-icon">📋</div>
      <div className="empty-text">No templates yet</div>
      <button className="btn btn-primary" onClick={onCreate}><Icon name="plus" size={14} /> Create Template</button>
    </div>
  );
  return (
    <div className="card-grid fade-in">
      {templates.map((tpl) => {
        const tc = tpl.checklists.reduce((s, c) => s + c.tasks.length, 0);
        const hc = tpl.checklists.reduce((s, c) => s + c.tasks.filter((t) => t.type === "http").length, 0);
        return (
          <div key={tpl.id} className="card">
            <div className="card-body">
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{tpl.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{tpl.description || "No description"}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span>{tpl.checklists.length} checklist{tpl.checklists.length !== 1 && "s"} · {tc} task{tc !== 1 && "s"}</span>
                {hc > 0 && <span className="auto-badge"><Icon name="bolt" size={10} /> {hc} auto</span>}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button className="btn btn-success btn-sm" onClick={() => onStartRun(tpl)}><Icon name="play" size={13} /> Run</button>
                <button className="btn btn-ghost btn-sm" onClick={() => onEdit(tpl)}><Icon name="edit" size={13} /> Edit</button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }} onClick={() => onDelete(tpl.id)}><Icon name="trash" size={13} /></button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
