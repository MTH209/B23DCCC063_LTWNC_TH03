"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { LogIn, Loader2, AlertCircle, KeyRound, Mail, UserCheck } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  useEffect(() => {
    if (urlError) {
      if (urlError === "OAuthSignin" || urlError === "OAuthCallback") {
        setError("Lỗi xác thực với GitHub OAuth. Vui lòng kiểm tra Client ID / Secret hoặc thử lại!");
      } else if (urlError === "Configuration") {
        setError("Chưa cấu hình AUTH_GITHUB_ID hoặc AUTH_GITHUB_SECRET trong .env.local!");
      } else {
        setError("Đã xảy ra lỗi đăng nhập (" + urlError + "). Vui lòng thử lại!");
      }
    }
  }, [urlError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!");
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!");
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    setIsGithubLoading(true);
    try {
      await signIn("github", { callbackUrl });
    } catch {
      setError("Không thể chuyển hướng đến GitHub. Vui lòng kiểm tra kết nối!");
      setIsGithubLoading(false);
    }
  };

  const handleQuickFill = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError(null);
  };

  return (
    <div className="space-y-5">
      {/* Nút nạp nhanh tài khoản */}
      <div className="flex items-center gap-2 pb-1">
        <button
          type="button"
          onClick={() => handleQuickFill("admin@ptit.edu.vn", "admin123")}
          className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <UserCheck className="w-3.5 h-3.5" />
          Nạp nhanh Admin
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill("sv@ptit.edu.vn", "sv123456")}
          className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <UserCheck className="w-3.5 h-3.5" />
          Nạp nhanh Sinh viên
        </button>
      </div>

      {/* Nút Đăng nhập bằng GitHub (OAuth) */}
      <button
        type="button"
        onClick={handleGithubSignIn}
        disabled={isGithubLoading || isLoading}
        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
      >
        {isGithubLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang chuyển đến GitHub...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>Đăng nhập với GitHub</span>
          </>
        )}
      </button>

      {/* Đường phân cách */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-slate-400 font-medium text-[11px]">
            hoặc đăng nhập bằng email học viện
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email input */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Email học viện
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@ptit.edu.vn hoặc sv@ptit.edu.vn"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Password input */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Mật khẩu
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isGithubLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xác thực...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Đăng nhập với Email PTIT
            </>
          )}
        </button>
      </form>
    </div>
  );
}
