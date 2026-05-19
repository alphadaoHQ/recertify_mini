import { useState } from "react";
import { Icon } from "../../components/Icon";

const EMPTY_TASK = { id: "", title: "", description: "", rewardXp: 50, status: "Instant", icon: "send", sortOrder: 0, is_active: true };

function TaskModal({ task, onSave, onClose, isLoading }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_TASK, ...(task || {}) }));
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-extrabold text-white">{task ? "Edit Task" : "New Task"}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white"><Icon className="size-5" name="x" /></button>
        </div>
        <div className="grid gap-4">
          <Inp label="ID (slug)" value={form.id} onChange={(v) => set("id", v)} disabled={!!task} placeholder="e.g. follow-x" />
          <Inp label="Title" value={form.title} onChange={(v) => set("title", v)} placeholder="e.g. Follow on X" />
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-primary" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Inp label="Reward XP" type="number" value={form.rewardXp} onChange={(v) => set("rewardXp", Number(v))} />
            <Inp label="Status" value={form.status} onChange={(v) => set("status", v)} placeholder="Instant" />
            <Inp label="Icon" value={form.icon} onChange={(v) => set("icon", v)} placeholder="send" />
          </div>
          <Inp label="Sort Order" type="number" value={form.sortOrder} onChange={(v) => set("sortOrder", Number(v))} />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Active
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white">Cancel</button>
          <button type="submit" disabled={isLoading} className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary-bright px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-primary/25 disabled:opacity-60">
            {isLoading ? "Saving…" : "Save Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Inp({ label, value, onChange, type = "text", placeholder = "", disabled = false }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none disabled:opacity-50 focus:border-brand-primary" />
    </div>
  );
}

export function TasksTab({ tasks, isLoading, onAdd, onEdit, onDelete, onSeed }) {
  const [modal, setModal] = useState(null);

  const handleSave = (form) => {
    if (modal === "new") onAdd(form);
    else onEdit(form.id, form);
    setModal(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Tasks</h1>
          <p className="mt-1 text-sm text-slate-400">Manage daily tasks and quests.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onSeed} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5">
            <Icon className="size-4" name="refresh" /> Seed Defaults
          </button>
          <button type="button" onClick={() => setModal("new")} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary-bright px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-primary/25">
            <Icon className="size-4" name="plus" /> Add Task
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-400">Title</th>
              <th className="px-4 py-3 font-bold text-slate-400">Description</th>
              <th className="px-4 py-3 font-bold text-slate-400">XP</th>
              <th className="px-4 py-3 font-bold text-slate-400">Status</th>
              <th className="px-4 py-3 font-bold text-slate-400">Active</th>
              <th className="px-4 py-3 font-bold text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-4 py-3 font-semibold text-white">{t.title}</td>
                <td className="px-4 py-3 text-slate-400 max-w-[200px] truncate">{t.description}</td>
                <td className="px-4 py-3 text-slate-300">{t.rewardXp}</td>
                <td className="px-4 py-3 text-slate-400">{t.status}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${t.is_active ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-400"}`}>
                    {t.is_active ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => setModal(t)} className="mr-2 text-slate-400 hover:text-brand-primary-soft"><Icon className="size-4" name="edit" /></button>
                  <button type="button" onClick={() => { if (confirm(`Delete "${t.title}"?`)) onDelete(t.id); }} className="text-slate-400 hover:text-rose-400"><Icon className="size-4" name="trash" /></button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No tasks yet. Click "Seed Defaults" to populate.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal !== null && <TaskModal task={modal === "new" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} isLoading={isLoading} />}
    </div>
  );
}
