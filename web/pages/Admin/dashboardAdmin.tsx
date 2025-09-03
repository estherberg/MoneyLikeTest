import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "../../lib/api";
import { useRouter } from "next/router";
import { logout as apiLogout } from '../../lib/api';
import {
  Rocket,
  Plus,
  BarChart3,
  Coins,
  Layers,
  Loader2,
  LogOut,
} from "lucide-react";

type Campaign = {
  id?: string;
  name?: string;
  status?: "DRAFT" | "RUNNING" | "PAUSED";
  budget?: number;
  createdAt?: string;
};

export default function Dashboard() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/campaigns"); // GET protected
      setItems(data || []);
    } catch (e: any) {
      if (e.message === "Unauthorized") window.location.href = "/login";
      else if (e.message === "Forbidden")
        setError("Access denied: ADVERTISER/ADMIN role required.");
      else setError(e.message || "API error");
    } finally {
      setLoading(false);
    }
  }

  async function createCampaign() {
    if (!name.trim()) return;
    setCreating(true);
    setError("");
    try {
      await apiPost("/campaigns", { name }); // POST protected
      setName("");
      await load();
    } catch (e: any) {
      if (e.message === "Unauthorized") window.location.href = "/login";
      else setError(e.message || "API error");
    } finally {
      setCreating(false);
    }
  }

  async function logout() {
    try {
      await apiLogout();
    } catch {}
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.replace("/login");
  }

  useEffect(() => {
    load();
  }, []);

  const kpis = useMemo(() => {
    const total = items.length;
    const running = items.filter((c) => c.status === "RUNNING").length;
    const draft = items.filter((c) => c.status === "DRAFT").length;
    const budget = items.reduce((s, c) => s + (c.budget || 0), 0);
    return { total, running, draft, budget };
  }, [items]);

  return (
    <div className="relative min-h-screen text-white bg-black overflow-hidden">
      {/* Futuristic gradient orbs */}
      <div className="pointer-events-none absolute -top-1/2 -left-1/2 w-[1200px] h-[1200px] rounded-full bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 blur-3xl opacity-25" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-cyan-500 via-blue-700 to-indigo-900 blur-3xl opacity-20 animate-spin-slow" />

      {/* Shell */}
      <div className="relative z-10 grid grid-cols-12 min-h-screen">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="p-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.6)]">
              <Rocket size={20} />
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-wide bg-gradient-to-r from-pink-400 to-indigo-300 bg-clip-text text-transparent">
                MoneyLike
              </div>
              <div className="text-xs text-gray-400">Advertiser Console</div>
            </div>
          </div>
          <nav className="px-3 space-y-2">
            <a className="block rounded-lg px-4 py-2 bg-white/10 border border-white/10">
              Dashboard
            </a>
            <a
              className="block rounded-lg px-4 py-2 hover:bg-white/5 border border-white/10"
              href="/campaign/new"
            >
              New Campaign
            </a>
          </nav>
          <div className="px-3 mt-6">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
          <div className="px-3 mt-auto py-6 text-xs text-gray-500">
            <div>Build v1.0 • Neon UI</div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6 md:p-10 space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-pink-400 to-indigo-300 bg-clip-text text-transparent">
                  Admin
                </span>
              </h1>
              <p className="text-gray-400">
                Manage campaigns, track KPIs, and launch new creatives.
              </p>
            </div>
          </header>

          {/* Create inline */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <input
                className="flex-1 rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none placeholder-gray-400 focus:border-pink-400"
                placeholder="Name your next big thing…"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                onClick={() => router.push("/campaign/new")}
                className="inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-xl px-5 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:opacity-90 border border-white/10"
              >
                <Plus size={18} />
                <span>Create campaign</span>
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-300 bg-red-500/10 border border-red-400/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
          </section>

          {/* KPI cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              icon={<Layers size={20} />}
              title="Total campaigns"
              value={kpis.total}
            />
            <KpiCard
              icon={<BarChart3 size={20} />}
              title="Running"
              value={kpis.running}
            />
            <KpiCard
              icon={<Rocket size={20} />}
              title="Drafts"
              value={kpis.draft}
            />
            <KpiCard
              icon={<Coins size={20} />}
              title="Total budget"
              value={`$${(kpis.budget / 100).toFixed(2)}`}
            />
          </section>

          {/* Table / List */}
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Campaigns</h2>
              <div className="text-sm text-gray-400">
                {items.length} item(s)
              </div>
            </div>

            {loading ? (
              <div className="p-10 flex items-center justify-center text-gray-300">
                <Loader2 className="animate-spin mr-2" /> Loading campaigns…
              </div>
            ) : items.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Budget</th>
                      <th className="px-6 py-3">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((c, idx) => (
                      <tr
                        key={c.id || idx}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="px-6 py-3 font-medium">
                          {c.name || c.id}
                        </td>
                        <td className="px-6 py-3">
                          <StatusPill status={c.status || "DRAFT"} />
                        </td>
                        <td className="px-6 py-3">
                          {c.budget ? `$${(c.budget / 100).toFixed(2)}` : "—"}
                        </td>
                        <td className="px-6 py-3">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

/* ========== tiny components ========== */

function KpiCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">{title}</div>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/10">
          {icon}
        </div>
      </div>
      <div className="mt-2 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: "DRAFT" | "RUNNING" | "PAUSED" }) {
  const map: Record<typeof status, string> = {
    DRAFT: "bg-yellow-500/15 text-yellow-300 border-yellow-400/30",
    RUNNING: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    PAUSED: "bg-gray-500/15 text-gray-300 border-gray-400/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs ${map[status]}`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="p-12 text-center space-y-3">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
        <Plus />
      </div>
      <h3 className="text-xl font-semibold">No campaigns yet</h3>
      <p className="text-gray-400">
        Create your first campaign to start collecting interactions and
        insights.
      </p>
    </div>
  );
}
