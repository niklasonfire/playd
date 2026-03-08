import { useState } from "react";
import Modal from "../Modal";
import Icon from "../Icon";

export default function MemberModal({ open, onClose, members, onUpdate }) {
  const [n, setN] = useState("");
  const add = () => { const v = n.trim(); if (!v || members.includes(v)) return; onUpdate([...members, v]); setN(""); };
  const rm = (name) => { if (name === "Unassigned") return; onUpdate(members.filter((m) => m !== name)); };
  return (
    <Modal open={open} onClose={onClose} title="Team Members"
      footer={<button className="btn btn-ghost" onClick={onClose}>Done</button>}>
      <div className="inline-add" style={{ marginBottom: 14 }}>
        <input className="input" placeholder="Add member name..." value={n}
          onChange={(e) => setN(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button className="btn btn-primary btn-sm" onClick={add}><Icon name="plus" size={14} /></button>
      </div>
      <div className="tag-list">
        {members.map((m) => (
          <span key={m} className="tag">{m}
            {m !== "Unassigned" && <button className="remove-tag" onClick={() => rm(m)}><Icon name="x" size={14} /></button>}
          </span>
        ))}
      </div>
    </Modal>
  );
}
