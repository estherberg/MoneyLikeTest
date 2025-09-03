import { useState } from "react";
import { apiPost } from "../lib/api";
import { Mail, Lock, User, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADVERTISER">("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPost("/auth/register", { email, password, role });
      // après inscription -> redirige vers login
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message || "Register error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Fond animé */}
      <div className="absolute inset-0">
        <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500 via-blue-700 to-cyan-900 rounded-full blur-3xl opacity-20 animate-spin-slow"></div>
      </div>

      {/* Carte register */}
      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.6)] space-y-8"
      >
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent tracking-wider">
          Create Account
        </h1>
        <p className="text-center text-gray-300">Join MoneyLike 🚀</p>

        {error && (
          <div className="bg-red-500/20 text-red-300 text-sm px-4 py-2 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Email */}
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3">
            <Mail className="text-pink-400 mr-3" size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3">
            <Lock className="text-indigo-400 mr-3" size={20} />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
              required
            />
          </div>

          {/* Role */}
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3">
            <User className="text-cyan-400 mr-3" size={20} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "USER" | "ADVERTISER")}
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
            >
              <option value="USER">User</option>
              <option value="ADVERTISER">Advertiser</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center 
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
          hover:opacity-90 transition duration-300 
          shadow-[0_0_20px_rgba(168,85,247,0.5)] 
          ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Creating...
            </>
          ) : (
            <>✨ Register</>
          )}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
