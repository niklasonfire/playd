import { useState, useEffect } from "react";
import Modal from "../Modal";
import Icon from "../Icon";
import { uid } from "../../services/storage";

export default function TemplateEditorModal({ open, onClose, onSave, initial, members, onEditTask }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cls, setCls] = useState([]);
  const [newCl, setNewCl] = useState("");
  const [newTasks, setNewTasks] = useState({});

  useEffect(() => {
    if (open && initial) { setName(initial.name); setDesc(initial.description); setCls(JSON.parse(JSON.stringify(initial.checklists))); }
    else if (open) { setName(""); setDesc(""); setCls([]); }
    setNewTasks({}); setNewCl("");
  }, [open, initial]);

  const addCl = () => { if (!newCl.trim()) return; setCls([...cls, { id: uid(), name: newCl.trim(), tasks: [] }]); setNewCl(""); };
  const rmCl = (id) => setCls(cls.filter((c) => c.id !== id));
  const addTask = (clId) => {
    const t = (newTasks[clId] || "").trim(); if (!t) return;
    setCls(cls.map((c) => c.id === clId ? { ...c, tasks: [...c.tasks, { id: uid(), title: t, assignee: "Unassigned", type: "manual" }] } : c));
    setNewTasks({ ...newTasks, [clId]: "" });
  };
  const rmTask = (clId, tId) => setCls(cls.map((c) => c.id === clId ? { ...c, tasks: c.tasks.filter((t) => t.id !== tId) } : c));
  const updateTask = (clId, updated) => setCls(cls.map((c) => c.id === clId ? { ...c, tasks: c.tasks.map((t) => t.id === updated.id ? updated : t) } : c));

  const save = () => { if (!name.trim()) return; onSave({ id: initial?.id || uid(), name: name.trim(), description: desc.trim(), checklists: cls }); onClose(); };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Template" : "New Template"}
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={save} disabled={!name.trim()}>{initial ? "Save" : "Create"}</button>
      </>}>
      <div className="form-group">
        <label className="form-label">Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Incident Response" />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What is this playbook for?" rows={2} />
      </div>
      <div className="form-group">
        <label className="form-label">Checklists</label>
        {cls.map((cl) => (
          <div key={cl.id} className="card" style={{ marginBottom: 10 }}>
            <div className="card-header">
              <span style={{ fontSize: 13, fontWeight: 600 }}>{cl.name}</span>
              <button className="btn-icon" onClick={() => rmCl(cl.id)}><Icon name="trash" size={14} /></button>
            </div>
            <div style={{ padding: "8px 12px" }}>
              {cl.tasks.map((t) => (
                <div key={t.id} className="task-row-tpl"
                  onClick={() => onEditTask({ task: t, clId: cl.id, onSave: (updated) => updateTask(cl.id, updated) })}>
                  <div style={{ flex: 1, fontSize: 13, display: "flex", alignItems: "center", gap: 6, paddingLeft: 4 }}>
                    {(t.type === "http") && <Icon name="bolt" size={13} />}
                    <span>{t.title}</span>
                  </div>
                  {t.type === "http" && <span className="method-badge">{t.automation?.method || "GET"}</span>}
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.assignee !== "Unassigned" ? t.assignee : ""}</span>
                  <button className="btn-icon" onClick={(e) => { e.stopPropagation(); rmTask(cl.id, t.id); }}><Icon name="x" size={14} /></button>
                </div>
              ))}
              <div className="inline-add">
                <input className="input" style={{ fontSize: 14 }} placeholder="Add task..."
                  value={newTasks[cl.id] || ""} onChange={(e) => setNewTasks({ ...newTasks, [cl.id]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addTask(cl.id)} />
                <button className="btn btn-ghost btn-sm" onClick={() => addTask(cl.id)}><Icon name="plus" size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        <div className="inline-add" style={{ marginTop: 4 }}>
          <input className="input" placeholder="New checklist name..." value={newCl}
            onChange={(e) => setNewCl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCl()} />
          <button className="btn btn-ghost btn-sm" onClick={addCl}><Icon name="plus" size={14} /></button>
        </div>
      </div>
    </Modal>
  );
}
