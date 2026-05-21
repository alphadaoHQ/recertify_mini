import { Icon } from "../../components/Icon";

export function WhitelistTab({ whitelistUsers, isLoading, onExport }) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Whitelist</h1>
          <p className="mt-1 text-sm text-slate-400">{whitelistUsers.length} eligible users.</p>
        </div>
        <button type="button" onClick={onExport} disabled={whitelistUsers.length === 0}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 disabled:opacity-60">
          <Icon className="size-4" name="download" /> Export CSV
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[750px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-400">Wallet</th>
              <th className="px-4 py-3 font-bold text-slate-400">Username</th>
              <th className="px-4 py-3 font-bold text-slate-400">Rank</th>
              <th className="px-4 py-3 font-bold text-slate-400">Total XP</th>
              <th className="px-4 py-3 font-bold text-slate-400">Tasks</th>
              <th className="px-4 py-3 font-bold text-slate-400">Modules</th>
              <th className="px-4 py-3 font-bold text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {whitelistUsers.map((u) => (
              <tr key={u.wallet_address} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-4 py-3 font-mono text-xs text-slate-300">{u.wallet_address?.slice(0, 8)}…{u.wallet_address?.slice(-4)}</td>
                <td className="px-4 py-3 text-white">{u.username ? `@${u.username}` : "—"}</td>
                <td className="px-4 py-3 font-bold text-white">#{u.rank}</td>
                <td className="px-4 py-3 text-slate-300">{u.total_xp?.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-400">{u.tasks_completed}</td>
                <td className="px-4 py-3 text-slate-400">{u.modules_completed}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-300">{u.status}</span>
                </td>
              </tr>
            ))}
            {whitelistUsers.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No whitelist-eligible users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
