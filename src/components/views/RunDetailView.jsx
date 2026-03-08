import { useState } from "react";
import Icon from "../Icon";
import ResponseModal from "../modals/ResponseModal";
import { executeAutomation } from "../../services/automation";

export default function RunDetailView({ run, members, onUpdate, onBack, onDelete }) {
  const [executing, setExecuting] = useState({});
  const [viewResult, setViewResult] = useState(null);

  const updateRun = (u) => {
    const total = u.checklists.reduce((s, c) => s + c.tasks.length, 0);
    const dn = u.checklists.reduce((s, c) => s + c.tasks.filter((t) => t.done).length, 0);
    u.status = dn === total && total > 0 ? "finished" : "in-progress";
    onUpdate(u);
  };

  const toggle = (ci, ti) => {
    const u = JSON.parse(JSON.stringify(run));
    u.checklists[ci].tasks[ti].done = !u.checklists[ci].tasks[ti].done;
    updateRun(u);
  };

  const assign = (ci, ti, a) => {
    const u = JSON.parse(JSON.stringify(run));
    u.checklists[ci].tasks[ti].assignee = a;
    onUpdate(u);
  };

  const execTask = async (ci, ti) => {
    const task = run.checklists[ci].tasks[ti];
    if (!task.automation?.url) return;

    const key = `${ci}-${ti}`;
    setExecuting((p) => ({ ...p, [key]: true }));

    const result = await executeAutomation(task.automation);

    const u = JSON.parse(JSON.stringify(run));
    u.checklists[ci].tasks[ti].lastResult = result;
    if (result.ok) {
      u.checklists[ci].tasks[ti].done = true;
    }
    updateRun(u);
    setExecuting((p) => ({ ...p, [key]: false }));
  };

  const total = run.checklists.reduce((s, c) => s + c.tasks.length, 0);
  const dn = run.checklists.reduce((s, c) => s + c.tasks.filter((t) => t.done).length, 0);
  const pct = total > 0 ? Math.round((dn / total) * 100) : 0;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <button className="btn-icon" onClick={onBack} style={{ padding: 10 }}><Icon name="back" size={20} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{run.name}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{run.templateName} · {new Date(run.startedAt).toLocaleDateString()}</div>
        </div>
        <span className={`badge ${run.status === "finished" ? "done" : "active"}`}><span className="badge-dot" />{run.status === "finished" ? "Done" : "Active"}</span>
      </div>

      <div style={{ marginBottom: 18, background: "var(--bg-secondary)", padding: 12, borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
          <span>Progress</span><span style={{ fontFamily: "var(--font-mono)" }}>{dn}/{total} · {pct}%</span>
        </div>
        <div className="progress-wrap" style={{ height: 6 }}><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
      </div>

      {run.checklists.map((cl, ci) => {
        const cd = cl.tasks.filter((t) => t.done).length;
        return (
          <div key={cl.id} className="checklist">
            <div className="checklist-header">
              <span className="checklist-name"><Icon name="list" size={15} /> {cl.name}</span>
              <span className="checklist-progress">{cd}/{cl.tasks.length}</span>
            </div>
            {cl.tasks.map((task, ti) => {
              const isHttp = task.type === "http";
              const isRunning = executing[`${ci}-${ti}`];
              return (
                <div key={task.id} className="task-item">
                  <button className={`task-checkbox ${task.done ? "checked" : ""}`} onClick={() => toggle(ci, ti)}>
                    {task.done && <Icon name="check" size={14} />}
                  </button>
                  <div className="task-content">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {isHttp && <Icon name="bolt" size={13} style={{ color: "var(--warning)", flexShrink: 0 }} />}
                      <div className={`task-title ${task.done ? "done" : ""}`}>{task.title}</div>
                    </div>
                    <div className="task-meta">
                      <select className="select" value={task.assignee} onChange={(e) => assign(ci, ti, e.target.value)}
                        style={{
                          width: "auto", padding: "5px 28px 5px 10px", fontSize: 12, minHeight: 30,
                          background: task.assignee === "Unassigned" ? "var(--bg-tertiary)" : "var(--accent-dim)",
                        }}>
                        {members.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      {isHttp && (
                        <>
                          <span className="method-badge">{task.automation?.method || "GET"}</span>
                          <button className="btn-execute" onClick={() => execTask(ci, ti)} disabled={isRunning}>
                            {isRunning
                              ? <><Icon name="loader" size={13} className="spinning" /> Running...</>
                              : <><Icon name="send" size={13} /> Execute</>}
                          </button>
                        </>
                      )}
                    </div>
                    {isHttp && task.lastResult && (
                      <div className={`auto-result ${task.lastResult.ok ? "ok" : "fail"}`}
                        style={{ cursor: "pointer" }} onClick={() => setViewResult(task.lastResult)}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <span style={{ color: task.lastResult.ok ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>
                            {task.lastResult.ok ? "OK" : "FAIL"} {task.lastResult.status > 0 && task.lastResult.status}
                          </span>
                          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                            {new Date(task.lastResult.timestamp).toLocaleTimeString()} · tap to expand
                          </span>
                        </div>
                        {task.lastResult.error && <div style={{ color: "var(--danger)" }}>{task.lastResult.error}</div>}
                        {!task.lastResult.error && task.lastResult.body && (
                          <div style={{ maxHeight: 60, overflow: "hidden" }}>
                            {task.lastResult.body.slice(0, 200)}
                            {task.lastResult.body.length > 200 && "..."}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
        <button className="btn btn-danger btn-sm" onClick={() => { onDelete(run.id); onBack(); }}><Icon name="trash" size={14} /> Delete Run</button>
      </div>

      <ResponseModal open={!!viewResult} onClose={() => setViewResult(null)} result={viewResult} />
    </div>
  );
}
