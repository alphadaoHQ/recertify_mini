import { useState } from "react";
import { Icon } from "../../components/Icon";

export function AdminLogin({ onLogin, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] right-[-80px] size-80 rounded-full bg-brand-primary/20 blur-[100px]" />
        <div className="absolute bottom-[-60px] left-[-60px] size-64 rounded-full bg-emerald-500/10 blur-[80px]" />
      </div>
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-bright shadow-lg shadow-brand-primary/30">
          <Icon className="size-8 text-white" name="shield" />
        </div>
        <h1 className="text-center font-display text-2xl font-extrabold text-white">Admin Panel</h1>
        <p className="mt-2 text-center text-sm text-slate-400">Sign in to manage Recertify Mini</p>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
        )}

        <div className="mt-6 grid gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <Icon className="size-4" name={showPw ? "x" : "eye"} />
              </button>
            </div>
          </div>
          <button type="submit" className="mt-2 w-full rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary-bright px-6 py-3.5 font-display text-sm font-extrabold uppercase tracking-widest text-white shadow-lg shadow-brand-primary/25 transition hover:shadow-xl hover:shadow-brand-primary/40">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
