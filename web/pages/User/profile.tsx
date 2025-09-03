import { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";
import { Coins, User as UserIcon, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

type User = { 
  id: string; 
  email: string; 
  role: "USER" | "ADVERTISER" | "ADMIN"; 
  wallet?: { balance: number }; 
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const me = await apiGet("/users/me");
      setUser(me);
      setBalance(me?.wallet?.balance ?? 0);

      try {
        const w = await apiGet("/wallet/me");
        if (typeof w?.balance === "number") setBalance(w.balance);
      } catch {}
    } catch (e: any) {
      if (e.message === "Unauthorized") window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-10 text-gray-300">Loading…</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="mb-8 border-b border-white/10 pb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <UserIcon size={28} className="text-pink-400" />
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
        <Link
          href="/User/dashboardUser"
          className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </header>

      <div className="max-w-xl space-y-6">
        {/* User Info Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3 shadow-[0_0_25px_rgba(236,72,153,0.15)]">
          <p>
            <span className="text-white/60">Email:</span>{" "}
            <span className="font-medium">{user?.email}</span>
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span className="text-white/60">Role:</span>{" "}
            <span className="font-medium">{user?.role}</span>
          </p>
        </div>

        {/* Wallet Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-yellow-500/10 via-amber-400/5 to-transparent p-6 flex items-center justify-between shadow-[0_0_25px_rgba(251,191,36,0.25)]">
          <div className="flex items-center gap-3">
            <Coins size={28} className="text-yellow-400" />
            <div>
              <p className="text-white/60 text-sm">Wallet Balance</p>
              <p className="text-2xl font-bold">{balance} credits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
