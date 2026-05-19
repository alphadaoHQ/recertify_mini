import { useState } from "react";
import { Icon } from "../../components/Icon";

const EMPTY_COURSE = {
  id: "", title: "", subtitle: "", icon: "sparkles", image: "", missionTitle: "", missionLabel: "Project Mission",
  missionCopy: [""], rewardXp: 100, question: "", answers: [{ id: "a", text: "", correct: true }, { id: "b", text: "", correct: false }, { id: "c", text: "", correct: false }],
  nftReward: { id: "", title: "", rarity: "", image: "" }, sortOrder: 0, is_active: true,
};

function CourseModal({ course, onSave, onClose, isLoading }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_COURSE, ...course,
    missionCopy: course?.missionCopy?.length ? course.missionCopy : [""],
    answers: course?.answers?.length ? course.answers : EMPTY_COURSE.answers,
    nftReward: { ...EMPTY_COURSE.nftReward, ...(course?.nftReward || {}) },
  }));

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-20 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-extrabold text-white">{course ? "Edit Course" : "New Course"}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white"><Icon className="size-5" name="x" /></button>
        </div>
        <div className="grid gap-4 max-h-[65vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <Input label="ID (slug)" value={form.id} onChange={(v) => set("id", v)} disabled={!!course} placeholder="e.g. ethereum-core" />
            <Input label="Title" value={form.title} onChange={(v) => set("title", v)} placeholder="e.g. Ethereum" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Subtitle" value={form.subtitle} onChange={(v) => set("subtitle", v)} placeholder="e.g. L1 Fundamentals" />
            <Input label="Icon" value={form.icon} onChange={(v) => set("icon", v)} placeholder="e.g. diamond" />
          </div>
          <Input label="Image URL" value={form.image} onChange={(v) => set("image", v)} placeholder="https://..." />
          <Input label="Mission Title" value={form.missionTitle} onChange={(v) => set("missionTitle", v)} />
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">Mission Copy (paragraphs)</label>
            {form.missionCopy.map((p, i) => (
              <textarea key={i} rows={2} value={p}
                onChange={(e) => { const mc = [...form.missionCopy]; mc[i] = e.target.value; set("missionCopy", mc); }}
                className="mb-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-primary" />
            ))}
            <button type="button" onClick={() => set("missionCopy", [...form.missionCopy, ""])} className="text-xs text-brand-primary-soft hover:underline">+ Add paragraph</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Reward XP" type="number" value={form.rewardXp} onChange={(v) => set("rewardXp", Number(v))} />
            <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(v) => set("sortOrder", Number(v))} />
          </div>
          <Input label="Quiz Question" value={form.question} onChange={(v) => set("question", v)} />
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">Answers</label>
            {form.answers.map((a, i) => (
              <div key={a.id} className="mb-2 flex items-center gap-2">
                <input type="text" value={a.text}
                  onChange={(e) => { const ans = [...form.answers]; ans[i] = { ...a, text: e.target.value }; set("answers", ans); }}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-primary"
                  placeholder={`Answer ${a.id.toUpperCase()}`} />
                <label className="flex items-center gap-1 text-xs text-slate-400">
                  <input type="radio" name="correct" checked={a.correct}
                    onChange={() => { const ans = form.answers.map((x, j) => ({ ...x, correct: j === i })); set("answers", ans); }} />
                  Correct
                </label>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">NFT Reward</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="NFT ID" value={form.nftReward.id} onChange={(v) => set("nftReward", { ...form.nftReward, id: v })} />
              <Input label="NFT Title" value={form.nftReward.title} onChange={(v) => set("nftReward", { ...form.nftReward, title: v })} />
              <Input label="Rarity" value={form.nftReward.rarity} onChange={(v) => set("nftReward", { ...form.nftReward, rarity: v })} />
              <Input label="NFT Image URL" value={form.nftReward.image} onChange={(v) => set("nftReward", { ...form.nftReward, image: v })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Active
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white">Cancel</button>
          <button type="submit" disabled={isLoading} className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary-bright px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-primary/25 disabled:opacity-60">
            {isLoading ? "Saving…" : "Save Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "", disabled = false }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition disabled:opacity-50 focus:border-brand-primary" />
    </div>
  );
}

export function CoursesTab({ courses, isLoading, onAdd, onEdit, onDelete, onSeed }) {
  const [modal, setModal] = useState(null); // null | "new" | course object

  const handleSave = (form) => {
    if (modal === "new") onAdd(form);
    else onEdit(form.id, form);
    setModal(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Courses</h1>
          <p className="mt-1 text-sm text-slate-400">Manage learning modules shown to users.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onSeed} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5">
            <Icon className="size-4" name="refresh" /> Seed Defaults
          </button>
          <button type="button" onClick={() => setModal("new")} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary-bright px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-primary/25">
            <Icon className="size-4" name="plus" /> Add Course
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-400">Title</th>
              <th className="px-4 py-3 font-bold text-slate-400">Subtitle</th>
              <th className="px-4 py-3 font-bold text-slate-400">XP</th>
              <th className="px-4 py-3 font-bold text-slate-400">Status</th>
              <th className="px-4 py-3 font-bold text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-4 py-3 font-semibold text-white">{c.title}</td>
                <td className="px-4 py-3 text-slate-400">{c.subtitle}</td>
                <td className="px-4 py-3 text-slate-300">{c.rewardXp}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${c.is_active ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-400"}`}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => setModal(c)} className="mr-2 text-slate-400 hover:text-brand-primary-soft"><Icon className="size-4" name="edit" /></button>
                  <button type="button" onClick={() => { if (confirm(`Delete "${c.title}"?`)) onDelete(c.id); }} className="text-slate-400 hover:text-rose-400"><Icon className="size-4" name="trash" /></button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No courses yet. Click "Seed Defaults" to populate from built-in data.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <CourseModal course={modal === "new" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} isLoading={isLoading} />
      )}
    </div>
  );
}
