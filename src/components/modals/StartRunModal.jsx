import { useState, useEffect } from "react";
import Modal from "../Modal";
import Icon from "../Icon";
import { uid } from "../../services/storage";

export default function StartRunModal({ open, onClose, template, onStart }) {
  const [runName, setRunName] = useState("");
  useEffect(() => { if (open && template) setRunName(`${template.name} – ${new Date().toLocaleDateString()}`); }, [open, template]);
  if (!template) return null;
  const go = () => {
    if (!runName.trim()) return;
    onStart({
      id: uid(), templateId: template.id, templateName: template.name,
      name: runName.trim(), status: "in-progress", startedAt: new Date().toISOString(),
      checklists: template.checklists.map((cl) => ({
        ...cl, id: uid(),
        tasks: cl.tasks.map((t) => ({
          ...t, id: uid(), done: false, lastResult: null,
        })),
      })),
    });
    onClose();
  };
  const httpCount = template.checklists.reduce((s, c) => s + c.tasks.filter((t) => t.type === "http").length, 0);
  return (
    <Modal open={open} onClose={onClose} title="Start Run"
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-success" onClick={go}><Icon name="play" size={14} /> Start</button>
      </>}>
      <div className="form-group">
        <label className="form-label">Run Name</label>
        <input className="input" value={runName} onChange={(e) => setRunName(e.target.value)} />
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
        <p style={{ marginBottom: 6 }}>Creates tasks from <strong>{template.name}</strong>:</p>
        {template.checklists.map((cl) => (
          <div key={cl.id} style={{ padding: "3px 0 3px 10px" }}>
            {cl.name} ({cl.tasks.length} tasks)
          </div>
        ))}
        {httpCount > 0 && (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="bolt" size={14} style={{ color: "var(--warning)" }} />
            <span style={{ color: "var(--warning)" }}>{httpCount} automated step{httpCount !== 1 && "s"}</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
