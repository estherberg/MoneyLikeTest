import { useState } from "react";
import { login } from "../lib/api";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("adv@moneylike.io");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true); 
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect by role
      const role = data.user.role;
      if (role === "ADMIN") {
        window.location.href = "/Admin/dashboardAdmin";
      } else if (role === "ADVERTISER") {
        window.location.href = "/Advertiser/dashboardAdvertiser";
      } else {
        window.location.href = "/User/dashboardUser";
      }
    } catch (err: any) {
      setError(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-cyan-500 via-blue-700 to-indigo-900 rounded-full blur-3xl opacity-20 animate-spin-slow"></div>
      </div>

      {/* Login card */}
      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.6)] space-y-8"
      >
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-indigo-400 bg-clip-text text-transparent tracking-wider">
          MoneyLike
        </h1>
        <p className="text-center text-gray-300">Enter the future of ads ✨</p>

        {error && (
          <div className="bg-red-500/20 text-red-300 text-sm px-4 py-2 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Email */}
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus-within:border-pink-400">
            <Mail className="text-pink-400 mr-3" size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus-within:border-indigo-400">
            <Lock className="text-indigo-400 mr-3" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading} 
          className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center 
    bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 
    hover:opacity-90 transition duration-300 
    shadow-[0_0_20px_rgba(236,72,153,0.5)] 
    ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Connecting...
            </>
          ) : (
            <>🚀 Sign In</>
          )}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-pink-400 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
