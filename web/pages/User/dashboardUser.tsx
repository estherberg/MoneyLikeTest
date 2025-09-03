import { useEffect, useState } from "react";
import { apiGet} from "../../lib/api";
import { sendInteraction } from "../../lib/interactions";
import { logout as apiLogout } from "../../lib/api";
import Link from "next/link";

import {
  LogOut,
  Coins,
  Heart,
  MousePointerClick,
  ThumbsUp,
} from "lucide-react";

type User = {
  id: string;
  email: string;
  role: "USER" | "ADVERTISER" | "ADMIN";
  wallet?: { balance: number };
};

type Creative = {
  id: string;
  title: string;
  body?: string;
  mediaUrl?: string;
  cta?: string;
};

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null); 
  const [msg, setMsg] = useState<string>("");

  async function load() {
    try {
      const me = await apiGet("/users/me");
      setUser(me);
      const cr = await apiGet("/creatives");
      setCreatives(cr);
    } catch (e: any) {
      if (e.message === "Unauthorized") window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }

  async function interact(creativeId: string, type: "LIKE" | "CLICK" | "VOTE") {
    try {
  setMsg("");
  setPending(creativeId);
  const res = await sendInteraction(creativeId, type, { ui: "user-dashboard" });

  const nb = res.newBalance;
 if (typeof res.newBalance === "number") {
  setUser((u) =>
    u ? { ...u, wallet: { balance: res.newBalance ?? (u.wallet?.balance ?? 0) } } : u
  );
}

  if (!res.credited) {
    setMsg("Already credited for this action on this creative (deduplicated).");
  }
} catch (e: any) {
  console.error("Interaction failed", e);
  setMsg(e?.message || "Interaction failed");
} finally {
  setPending(null);
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

  if (loading) return <div className="p-10 text-gray-300">Loading…</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-6 flex justify-between items-center border-b border-white/10">
        <h1 className="text-2xl font-bold">Welcome {user?.email}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Coins size={18} className="text-yellow-400" />
            <span>{user?.wallet?.balance ?? 0}</span>
          </div>
          <Link
      href="/User/profile"
      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-2"
    >
      Profile
    </Link>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creatives.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
          >
            {c.mediaUrl && (
              <img src={c.mediaUrl} alt={c.title} className="rounded-lg" />
            )}
            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="text-gray-400 text-sm">{c.body}</p>
            <div className="flex gap-2">
              <button
                disabled={pending === c.id}
                onClick={() => interact(c.id, "LIKE")}
                className="flex-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 py-2 flex items-center justify-center gap-1"
              >
                <Heart size={16} /> Like
              </button>
              <button
                disabled={pending === c.id}
                onClick={() => interact(c.id, "CLICK")}
                className="flex-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 py-2 flex items-center justify-center gap-1"
              >
                <MousePointerClick size={16} /> Click
              </button>
              <button
                disabled={pending === c.id}
                onClick={() => interact(c.id, "VOTE")}
                className="flex-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 py-2 flex items-center justify-center gap-1"
              >
                <ThumbsUp size={16} /> Vote
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
