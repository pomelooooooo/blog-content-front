"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("เข้าสู่ระบบสำเร็จ");
      router.replace("/admin");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-950 via-gray-900 to-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 shadow-lg shadow-primary-500/30">
            <PenLine className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Blog Admin</h1>
          <p className="mt-1 text-gray-400">เข้าสู่ระบบเพื่อจัดการเนื้อหา</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card space-y-5 p-8"
        >
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@blog.com"
              className="input"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
