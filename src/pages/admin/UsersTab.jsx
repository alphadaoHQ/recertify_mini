import { useState } from "react";
import { Icon } from "../../components/Icon";

export function UsersTab({ users, isLoading, onAdjustXp, onDelete }) {
  const [search, setSearch] = useState("");
  const [xpModal, setXpModal] = useState(null);
  const [newXp, setNewXp] = useState(0);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q) || u.wallet_address?.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Users</h1>
          <p className="mt-1 text-sm text-slate-400">{users.length} registered profiles.</p>
        </div>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" name="search" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…"
            className="rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand-primary" />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-400">User</th>
              <th className="px-4 py-3 font-bold text-slate-400">Wallet</th>
              <th className="px-4 py-3 font-bold text-slate-400">XP</th>
              <th className="px-4 py-3 font-bold text-slate-400">Level</th>
              <th className="px-4 py-3 font-bold text-slate-400">Title</th>
              <th className="px-4 py-3 font-bold text-slate-400">Whitelist</th>
              <th className="px-4 py-3 font-bold text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.wallet_address} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="size-8 rounded-lg object-cover" />
                    <div>
                      <p className="font-semibold text-white">{u.name}</p>
                      {u.username && <p className="text-xs text-slate-400">@{u.username}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{u.wallet_address?.slice(0, 8)}…{u.wallet_address?.slice(-4)}</td>
                <td className="px-4 py-3 font-bold text-white">{u.xp?.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-300">{u.level}</td>
                <td className="px-4 py-3 text-slate-400">{u.title}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${u.whitelist_eligible ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-400"}`}>
                    {u.whitelist_eligible ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => { setXpModal(u); setNewXp(u.xp || 0); }} className="mr-2 text-slate-400 hover:text-brand-primary-soft" title="Adjust XP"><Icon className="size-4" name="edit" /></button>
                  <button type="button" onClick={() => { if (confirm(`Delete user "${u.name}"? This removes all their data.`)) onDelete(u.wallet_address); }} className="text-slate-400 hover:text-rose-400" title="Delete"><Icon className="size-4" name="trash" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">{users.length === 0 ? "No users yet." : "No users match your search."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* XP Adjust Modal */}
      {xpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2 className="font-display text-lg font-extrabold text-white">Adjust XP</h2>
            <p className="mt-1 text-sm text-slate-400">User: {xpModal.name}</p>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">New XP Value</label>
              <input type="number" value={newXp} onChange={(e) => setNewXp(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-primary" />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setXpModal(null)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white">Cancel</button>
              <button type="button" disabled={isLoading} onClick={() => { onAdjustXp(xpModal.wallet_address, newXp); setXpModal(null); }}
                className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary-bright px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-primary/25 disabled:opacity-60">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
