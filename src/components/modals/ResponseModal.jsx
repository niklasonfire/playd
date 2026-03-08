import Modal from "../Modal";

export default function ResponseModal({ open, onClose, result }) {
  if (!result) return null;
  let prettyBody = result.body || "";
  try {
    const parsed = JSON.parse(prettyBody);
    prettyBody = JSON.stringify(parsed, null, 2);
  } catch { /* keep as-is */ }

  return (
    <Modal open={open} onClose={onClose} title="Response Details"
      footer={<button className="btn btn-ghost" onClick={onClose}>Close</button>}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <span className={`badge ${result.ok ? "done" : ""}`} style={result.ok ? {} : { background: "var(--danger-dim)", color: "var(--danger)" }}>
            {result.ok ? "Success" : "Failed"}
          </span>
          {result.status > 0 && <span className="method-badge">{result.status} {result.statusText}</span>}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {new Date(result.timestamp).toLocaleString()}
        </div>
      </div>
      {result.error && (
        <div style={{ padding: 10, borderRadius: "var(--radius)", background: "var(--danger-dim)", color: "var(--danger)", fontSize: 13, marginBottom: 10 }}>
          {result.error}
        </div>
      )}
      {prettyBody && (
        <div className="form-group">
          <label className="form-label">Response Body</label>
          <pre className={`auto-result ${result.ok ? "ok" : "fail"}`}
            style={{ maxHeight: 400 }}>{prettyBody}</pre>
        </div>
      )}
    </Modal>
  );
}
