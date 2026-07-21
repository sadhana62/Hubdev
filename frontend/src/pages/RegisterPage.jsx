import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser, saveAuthSession } from "../services/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        loading: false,
        error: "Passwords do not match",
        success: "",
      });
      return;
    }

    if (!formData.terms) {
      setStatus({
        loading: false,
        error: "Please accept the terms to continue",
        success: "",
      });
      return;
    }

    setStatus({
      loading: true,
      error: "",
      success: "",
    });

    try {
      const response = await registerUser({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        bio: formData.bio,
      });

      saveAuthSession(response.data);
      setStatus({
        loading: false,
        error: "",
        success: "Account created! Redirecting...",
      });

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || "Failed to register.",
        success: "",
      });
    }
  };

  return (
    <section className="min-h-screen flex flex-col font-body-md text-on-background bg-[#0f172a] relative">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-max-width mx-auto h-16 px-margin-desktop flex items-center justify-between">
          <div onClick={() => navigate("/")} className="flex items-center gap-sm cursor-pointer">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              terminal
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">DevHub</span>
          </div>
          <NavLink to="/" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Back to Explore
          </NavLink>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center pt-24 pb-16 px-margin-mobile">
        {/* Register Card */}
        <div className="w-full max-w-[480px] glass-card rounded-xl overflow-hidden shadow-2xl">
          {/* Decorative accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          <div className="p-xl md:p-xxl">
            <div className="text-center mb-xl">
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Join DevHub</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Connect with the world's best developers.</p>
            </div>

            <form className="space-y-lg" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">
                    person
                  </span>
                  <input
                    className="w-full bg-[#0d0d15] border border-white/10 rounded-lg py-3 pl-11 pr-4 font-body-md text-on-surface placeholder:text-outline-variant focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                    id="fullName"
                    name="fullName"
                    placeholder="Linus Torvalds"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="username">
                  Username
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">
                    alternate_email
                  </span>
                  <input
                    className="w-full bg-[#0d0d15] border border-white/10 rounded-lg py-3 pl-11 pr-4 font-body-md text-on-surface placeholder:text-outline-variant focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                    id="username"
                    name="username"
                    placeholder="linus_t"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="email">
                  Email
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                  <input
                    className="w-full bg-[#0d0d15] border border-white/10 rounded-lg py-3 pl-11 pr-4 font-body-md text-on-surface placeholder:text-outline-variant focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="bio">
                  Bio
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">
                    edit_note
                  </span>
                  <input
                    className="w-full bg-[#0d0d15] border border-white/10 rounded-lg py-3 pl-11 pr-4 font-body-md text-on-surface placeholder:text-outline-variant focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                    id="bio"
                    name="bio"
                    placeholder="Brief developer bio (max 50 chars)"
                    type="text"
                    required
                    maxLength={160}
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">
                      lock
                    </span>
                    <input
                      className="w-full bg-[#0d0d15] border border-white/10 rounded-lg py-3 pl-11 pr-4 font-body-md text-on-surface placeholder:text-outline-variant focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="confirmPassword">
                    Confirm
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">
                      shield
                    </span>
                    <input
                      className="w-full bg-[#0d0d15] border border-white/10 rounded-lg py-3 pl-11 pr-4 font-body-md text-on-surface placeholder:text-outline-variant focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-sm pt-sm">
                <div className="relative flex items-center h-5">
                  <input
                    className="h-4 w-4 rounded border-white/10 bg-[#0d0d15] text-primary focus:ring-primary/20 cursor-pointer"
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                  />
                </div>
                <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="terms">
                  I accept the{" "}
                  <a className="text-primary hover:underline" href="#">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a className="text-primary hover:underline" href="#">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {/* Status messages */}
              {status.error && (
                <div className="p-3 text-sm text-red-200 bg-red-950/40 border border-red-500/20 rounded-lg">
                  {status.error}
                </div>
              )}
              {status.success && (
                <div className="p-3 text-sm text-emerald-200 bg-emerald-950/40 border border-emerald-500/20 rounded-lg">
                  {status.success}
                </div>
              )}

              {/* Submit CTA */}
              <button
                className="w-full bg-primary text-on-primary font-label-md text-label-md h-12 rounded-lg font-bold flex items-center justify-center gap-sm active:scale-[0.98] transition-transform hover:opacity-90 shadow-lg shadow-primary/10 cursor-pointer disabled:opacity-50"
                type="submit"
                disabled={status.loading}
              >
                {status.loading ? "Creating Account..." : "Create Account"}
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-xl text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Already have an account?
                <NavLink className="text-primary font-medium hover:underline ml-1" to="/login">
                  Login
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Background visual elements */}
      <div className="fixed bottom-10 left-10 opacity-10 pointer-events-none hidden lg:block">
        <span className="material-symbols-outlined text-[120px] text-primary rotate-12">code</span>
      </div>
      <div className="fixed top-24 right-10 opacity-10 pointer-events-none hidden lg:block">
        <span className="material-symbols-outlined text-[80px] text-secondary -rotate-12">database</span>
      </div>

      {/* Footer */}
      <footer className="w-full py-xl border-t border-white/10 bg-surface-container-lowest">
        <div className="max-w-max-width mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md text-center md:text-left">
          <div className="flex flex-col gap-xs">
            <span className="font-headline-md text-headline-md font-bold text-on-surface">DevHub</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              © 2024 DevHub Inc. Built for developers by developers.
            </p>
          </div>
          <div className="flex items-center gap-lg">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Privacy
            </a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Terms
            </a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              API
            </a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
