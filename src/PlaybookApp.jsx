import { useState, useEffect } from "react";
import { StorageService } from "./services/storage";
import { DEFAULT_MEMBERS, DEFAULT_TEMPLATES } from "./data/defaults";
import { STYLES } from "./styles";
import Icon from "./components/Icon";
import TemplateEditorModal from "./components/modals/TemplateEditorModal";
import StartRunModal from "./components/modals/StartRunModal";
import MemberModal from "./components/modals/MemberModal";
import TaskConfigModal from "./components/modals/TaskConfigModal";
import TemplatesView from "./components/views/TemplatesView";
import RunsView from "./components/views/RunsView";
import RunDetailView from "./components/views/RunDetailView";

export default function PlaybookApp() {
  const [templates, setTemplates] = useState([]);
  const [runs, setRuns] = useState([]);
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [view, setView] = useState("templates");
  const [selRunId, setSelRunId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [tplModal, setTplModal] = useState({ open: false, initial: null });
  const [runModal, setRunModal] = useState({ open: false, template: null });
  const [memModal, setMemModal] = useState(false);
  const [taskCfg, setTaskCfg] = useState({ open: false, task: null, clId: null, onSave: null });

  useEffect(() => {
    (async () => {
      const t = await StorageService.load("playbook:templates");
      const r = await StorageService.load("playbook:runs");
      const m = await StorageService.load("playbook:members");
      setTemplates(t || DEFAULT_TEMPLATES); setRuns(r || []); setMembers(m || DEFAULT_MEMBERS); setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) StorageService.save("playbook:templates", templates); }, [templates, loaded]);
  useEffect(() => { if (loaded) StorageService.save("playbook:runs", runs); }, [runs, loaded]);
  useEffect(() => { if (loaded) StorageService.save("playbook:members", members); }, [members, loaded]);

  const nav = (v) => { setView(v); setSelRunId(null); };
  const saveTpl = (tpl) => setTemplates((p) => { const i = p.findIndex((t) => t.id === tpl.id); return i >= 0 ? p.map((t) => t.id === tpl.id ? tpl : t) : [...p, tpl]; });
  const delTpl = (id) => setTemplates((p) => p.filter((t) => t.id !== id));
  const startRun = (r) => { setRuns((p) => [r, ...p]); setView("runs"); };
  const updRun = (r) => setRuns((p) => p.map((x) => x.id === r.id ? r : x));
  const delRun = (id) => setRuns((p) => p.filter((r) => r.id !== id));

  const active = runs.filter((r) => r.status === "in-progress");
  const finished = runs.filter((r) => r.status === "finished");
  const selRun = runs.find((r) => r.id === selRunId);
  const titles = { templates: "Templates", runs: "Active Runs", finished: "Finished", members: "Team" };

  if (!loaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg-primary)", color: "var(--text-muted)" }}><style>{STYLES}</style>Loading...</div>;

  const fabAction = () => {
    if (view === "templates") setTplModal({ open: true, initial: null });
    else if (view === "members") setMemModal(true);
  };

  const openTaskCfg = ({ task, clId, onSave }) => {
    setTaskCfg({ open: true, task, clId, onSave });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-layout">
        {/* Desktop Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header"><div className="sidebar-logo"><span className="dot" /> PLAYBOOK</div></div>
          <nav className="sidebar-nav">
            <div className="nav-section">
              <div className="nav-section-label">Playbooks</div>
              <button className={`nav-item ${view === "templates" ? "active" : ""}`} onClick={() => nav("templates")}><Icon name="template" size={16} /> Templates <span className="count">{templates.length}</span></button>
              <button className={`nav-item ${view === "runs" ? "active" : ""}`} onClick={() => nav("runs")}><Icon name="run" size={16} /> Active <span className="count">{active.length}</span></button>
              <button className={`nav-item ${view === "finished" ? "active" : ""}`} onClick={() => nav("finished")}><Icon name="check" size={16} /> Finished <span className="count">{finished.length}</span></button>
            </div>
            <div className="nav-section">
              <div className="nav-section-label">Team</div>
              <button className={`nav-item ${view === "members" ? "active" : ""}`} onClick={() => { nav("members"); }}><Icon name="users" size={16} /> Members <span className="count">{members.length}</span></button>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="main-content">
          <div className="topbar">
            <div className="topbar-title">
              {selRun
                ? <><button className="btn-icon" onClick={() => setSelRunId(null)} style={{ marginRight: 2 }}><Icon name="back" size={18} /></button>Run</>
                : <><span className="dot" style={{ marginRight: 4 }} />{titles[view]}</>
              }
            </div>
            {view === "templates" && !selRun && (
              <button className="btn btn-primary btn-sm desktop-only" onClick={() => setTplModal({ open: true, initial: null })}><Icon name="plus" size={14} /> New</button>
            )}
          </div>

          <div className="content-area">
            {selRun ? (
              <RunDetailView run={selRun} members={members} onUpdate={updRun} onBack={() => setSelRunId(null)} onDelete={delRun} />
            ) : view === "templates" ? (
              <TemplatesView templates={templates} onEdit={(t) => setTplModal({ open: true, initial: t })} onDelete={delTpl}
                onStartRun={(t) => setRunModal({ open: true, template: t })} onCreate={() => setTplModal({ open: true, initial: null })} />
            ) : view === "runs" ? (
              <RunsView runs={active} onSelect={setSelRunId} emptyText="No active runs — start one from a template" />
            ) : view === "finished" ? (
              <RunsView runs={finished} onSelect={setSelRunId} emptyText="No finished runs yet" />
            ) : (
              <div className="fade-in" style={{ paddingTop: 8 }}>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>Manage team members for task assignment.</div>
                <div className="tag-list">
                  {members.map((m) => (
                    <span key={m} className="tag">{m}
                      {m !== "Unassigned" && <button className="remove-tag" onClick={() => setMembers(members.filter((x) => x !== m))}><Icon name="x" size={14} /></button>}
                    </span>
                  ))}
                </div>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setMemModal(true)}><Icon name="plus" size={14} /> Add Member</button>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Tabs */}
        <div className="bottom-bar">
          <div className="bottom-bar-inner">
            <button className={`tab-btn ${view === "templates" && !selRun ? "active" : ""}`} onClick={() => nav("templates")}>
              <span className="tab-icon"><Icon name="template" size={20} /></span>Templates
            </button>
            <button className={`tab-btn ${view === "runs" && !selRun ? "active" : ""}`} onClick={() => nav("runs")}>
              <span className="tab-icon"><Icon name="run" size={20} />{active.length > 0 && <span className="tab-badge">{active.length}</span>}</span>Active
            </button>
            <button className={`tab-btn ${view === "finished" && !selRun ? "active" : ""}`} onClick={() => nav("finished")}>
              <span className="tab-icon"><Icon name="check" size={20} /></span>Done
            </button>
            <button className={`tab-btn ${view === "members" ? "active" : ""}`} onClick={() => nav("members")}>
              <span className="tab-icon"><Icon name="users" size={20} /></span>Team
            </button>
          </div>
        </div>

        {/* Mobile FAB */}
        {(view === "templates" || view === "members") && !selRun && (
          <button className="fab" onClick={fabAction}><Icon name="plus" size={24} /></button>
        )}

        {/* Modals */}
        <TemplateEditorModal open={tplModal.open} onClose={() => setTplModal({ open: false, initial: null })} onSave={saveTpl}
          initial={tplModal.initial} members={members} onEditTask={openTaskCfg} />
        <StartRunModal open={runModal.open} onClose={() => setRunModal({ open: false, template: null })} template={runModal.template} onStart={startRun} />
        <MemberModal open={memModal} onClose={() => setMemModal(false)} members={members} onUpdate={setMembers} />
        <TaskConfigModal open={taskCfg.open} onClose={() => setTaskCfg({ open: false, task: null, clId: null, onSave: null })}
          task={taskCfg.task} members={members} onSave={(updated) => { if (taskCfg.onSave) taskCfg.onSave(updated); }} />
      </div>
    </>
  );
}
