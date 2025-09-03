import React from 'react';
import Link from 'next/link';
import {
  Rocket,
  Coins,
  BarChart3,
  Shield,
  Zap,
  Wand2,
  LineChart,
  PlusCircle,
  LogIn,
} from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      {/* === Decorative Background === */}
      <BackgroundFX />

      {/* === Top Navigation === */}
      <header className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 shadow-lg shadow-pink-600/20" />
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
              MoneyLike
            </span>
            <span className="ml-2 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/70">
              v•next
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <Link href="/campaign/new" className="hover:text-white transition">Create</Link>
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link href="/docs" className="hover:text-white transition">Docs</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md ring-1 ring-white/15 hover:bg-white/15 transition"
            >
              <LogIn size={16} /> Login
            </Link>
            <Link
              href="/campaign/new"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 px-4 py-2 text-sm font-semibold shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:opacity-90 transition"
            >
              <PlusCircle size={16} /> New Campaign
            </Link>
          </div>
        </div>
      </header>

      {/* === Hero === */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-8 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
              <Zap size={14} className="text-pink-400" /> Real‑time Rewards • AI‑Optimized Reach
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              A Futuristic Ad Platform where <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">attention</span> becomes <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">currency</span>.
            </h1>
            <p className="mt-4 text-white/70 max-w-xl">
              Launch high‑performance campaigns, reward your audience instantly, and monitor KPIs with live on‑chain‑style transparency.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/Advertiser/dashboardAdvertiser"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 px-5 py-3 font-semibold shadow-[0_0_30px_rgba(236,72,153,0.45)] hover:opacity-90 transition"
              >
                <Rocket size={18} /> Go to Advertiser
              </Link>
              <Link
                href="/User/dashboardUser"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 font-semibold backdrop-blur ring-1 ring-white/15 hover:bg-white/15 transition"
              >
                <Coins size={18} /> Go to User
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard label="Active campaigns" value="128" trend="+12%" />
              <StatCard label="Avg. CTR" value="3.9%" trend="+0.4%" />
              <StatCard label="Rewards paid" value="$42k" trend="+18%" />
            </div>
          </div>

          <div className="relative">
            {/* Holographic Preview Card */}
            <div className="group relative mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.5)]">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-indigo-600/30 blur-2xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Campaign • #ML‑2099</span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300 ring-1 ring-emerald-400/30">RUNNING</span>
                </div>
                <h3 className="mt-3 text-lg font-bold">Galaxy‑Fold Launch</h3>
                <p className="text-sm text-white/60">Objective: CTR • Budget: $50,000 • CPC: $0.24</p>
                <div className="mt-5 space-y-3">
                  <div className="h-2 w-full overflow-hidden rounded bg-white/10">
                    <div className="h-full w-2/3 bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-600" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <p className="text-white/60">Impressions</p>
                      <p className="font-semibold">2.1M</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <p className="text-white/60">Clicks</p>
                      <p className="font-semibold">81.2k</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <p className="text-white/60">CTR</p>
                      <p className="font-semibold">3.86%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* floating orbs */}
            <div className="pointer-events-none absolute -top-6 -left-8 h-28 w-28 rounded-full bg-pink-500/30 blur-2xl animate-pulse" />
            <div className="pointer-events-none absolute -bottom-10 -right-8 h-24 w-24 rounded-full bg-indigo-500/30 blur-2xl animate-[ping_4s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* === Feature Grid === */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<LineChart className="text-pink-300" size={18} />}
            title="AI Bidding"
            desc="Smart bidding that adapts to context & audience in real time."
          />
          <FeatureCard
            icon={<Shield className="text-indigo-300" size={18} />}
            title="Fraud‑Safe"
            desc="Human‑signal verification reduces bot traffic and waste."
          />
          <FeatureCard
            icon={<Wand2 className="text-purple-300" size={18} />}
            title="1‑Click Creatives"
            desc="Generate & A/B test assets directly from your brief."
          />
        </div>

        {/* Quick Links */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLink href="/login" label="Login" icon={<LogIn size={16} />} />
          <QuickLink href="/campaign/new" label="Create Campaign" icon={<PlusCircle size={16} />} />
          <QuickLink href="/Advertiser/dashboardAdvertiser" label="Advertiser Dashboard" icon={<BarChart3 size={16} />} />
          <QuickLink href="/User/dashboardUser" label="User Dashboard" icon={<Coins size={16} />} />
        </div>
      </section>

      {/* === Footer === */}
      <footer className="relative z-10 border-t border-white/10 bg-gradient-to-b from-white/0 to-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>© {new Date().getFullYear()} MoneyLike. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px]">Alpha Preview</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ===================== Helpers ===================== */
function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <p className="text-xs text-white/60">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <p className="text-2xl font-bold">{value}</p>
        <span className="text-xs text-emerald-300">{trend}</span>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition">
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-2xl" />
      <div className="relative flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-white/10 p-2 ring-1 ring-white/15">{icon}</div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="mt-1 text-sm text-white/70">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-semibold backdrop-blur hover:bg-white/10 hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] transition"
    >
      <span>{label}</span>
      <span className="ml-3 inline-flex items-center gap-2 text-white/70 group-hover:text-white">
        {icon}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition -translate-x-0.5 group-hover:translate-x-0">
          <path d="M5 12h14m0 0-5 5m5-5-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </Link>
  );
}

function BackgroundFX() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.2) 1px, transparent 1px)",
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-[-20%] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-pink-500/30 via-purple-500/25 to-indigo-600/20 blur-3xl" />

      {/* Conic spotlight */}
      <div
        className="absolute bottom-[-20%] left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.18), rgba(236,72,153,0.15), rgba(59,130,246,0.18))',
        }}
      />

      {/* Soft rings */}
      <div className="absolute right-10 top-24 h-44 w-44 rounded-full ring-1 ring-pink-400/25" />
      <div className="absolute left-12 bottom-24 h-36 w-36 rounded-full ring-1 ring-indigo-400/20" />
    </div>
  );
}
