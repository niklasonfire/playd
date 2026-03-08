import { useState, useEffect } from "react";
import Modal from "../Modal";
import Icon from "../Icon";

export default function TaskConfigModal({ open, onClose, task, members, onSave }) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("Unassigned");
  const [type, setType] = useState("manual");
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setAssignee(task.assignee);
      setType(task.type || "manual");
      const auto = task.automation || {};
      setMethod(auto.method || "GET");
      setUrl(auto.url || "");
      setHeaders(auto.headers ? auto.headers.map((h) => ({ ...h })) : []);
      setBody(auto.body || "");
    }
  }, [open, task]);

  const save = () => {
    if (!title.trim()) return;
    const updated = { ...task, title: title.trim(), assignee, type };
    if (type === "http") {
      updated.automation = { method, url, headers: headers.filter((h) => h.key.trim()), body };
    } else {
      delete updated.automation;
    }
    onSave(updated);
    onClose();
  };

  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const updateHeader = (i, field, val) => setHeaders(headers.map((h, j) => j === i ? { ...h, [field]: val } : h));
  const removeHeader = (i) => setHeaders(headers.filter((_, j) => j !== i));

  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose} title="Configure Task"
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={save} disabled={!title.trim()}>Save</button>
      </>}>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Assignee</label>
        <select className="select" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          {members.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Type</label>
        <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="manual">Manual (checkbox)</option>
          <option value="http">HTTP Request</option>
        </select>
      </div>
      {type === "http" && (
        <>
          <div className="form-group">
            <label className="form-label">Method & URL</label>
            <div style={{ display: "flex", gap: 8 }}>
              <select className="select" style={{ width: 120, flexShrink: 0 }} value={method}
                onChange={(e) => setMethod(e.target.value)}>
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => <option key={m}>{m}</option>)}
              </select>
              <input className="input" placeholder="https://api.example.com/..." value={url}
                onChange={(e) => setUrl(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Headers</label>
            {headers.map((h, i) => (
              <div key={i} className="header-pair">
                <input className="input" placeholder="Key" value={h.key}
                  onChange={(e) => updateHeader(i, "key", e.target.value)} style={{ fontSize: 14 }} />
                <input className="input" placeholder="Value" value={h.value}
                  onChange={(e) => updateHeader(i, "value", e.target.value)} style={{ fontSize: 14 }} />
                <button className="btn-icon" onClick={() => removeHeader(i)}><Icon name="x" size={14} /></button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={addHeader}>
              <Icon name="plus" size={13} /> Add Header
            </button>
          </div>
          {["POST", "PUT", "PATCH"].includes(method) && (
            <div className="form-group">
              <label className="form-label">Body</label>
              <textarea className="textarea" value={body} onChange={(e) => setBody(e.target.value)}
                placeholder='{"key": "value"}' rows={4}
                style={{ fontFamily: "var(--font-mono)", fontSize: 13 }} />
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
