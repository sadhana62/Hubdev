import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser, saveAuthSession } from "../services/authApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const moveX = (e.clientX - window.innerWidth / 4) / 120;
      const moveY = (e.clientY - window.innerHeight / 2) / 120;
      setMousePos({ x: moveX, y: moveY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({
      loading: true,
      error: "",
      success: "",
    });

    try {
      const response = await loginUser(formData);
      saveAuthSession(response.data);

      setStatus({
        loading: false,
        error: "",
        success: "Login successful! Redirecting...",
      });

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || "Failed to log in.",
        success: "",
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center font-body-md overflow-hidden bg-[#0F172A]">
      <div className="flex w-full h-screen">
        {/* Left Side: Illustration & Branding */}
        <div className="hidden lg:flex relative w-1/2 h-full items-center justify-center overflow-hidden">
          {/* Background Image with Parallax */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDafBd5h_Ipue6s4xZeAul4WEnKVkIpR8v6xjrJPllZvHeLor8B5QsjMuDIMhvbbItgVycdC_y0K6m-QknenUl_Bam0akNVgKg_KVvfsiOsOAcWPz6tpgXPnE4Q14WuRqJ7dwSEGeYM6gYUVTbZ9yKlV2lHskilVGI8KPLNFw07W9ddAB5cqfy-ziKMb9Iz116sTI9aWvhP3P9Io_tIg2uNCT-EooYPnSxqRRokjnaeOuccwJn1Y79ONCh7PUPvs4LwQLkxxtpikKQ')",
              transform: `scale(1.1) translate(${mousePos.x}px, ${mousePos.y}px)`,
              transition: "transform 0.1s ease-out",
            }}
          />
          {/* Glassmorphic Overlay Content */}
          <div className="relative z-10 glass-card p-xl rounded-xl max-w-lg mx-auto text-center transform hover:scale-105 transition-transform duration-500">
            <div className="flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-primary text-4xl mr-sm">terminal</span>
              <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">DevHub</h1>
            </div>
            <h2 className="font-display text-display leading-tight mb-md text-on-surface">Unlock the developer network.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Join 2M+ engineers building the future of the open web.
            </p>
            <div className="mt-xl flex justify-center gap-md">
              <div className="flex -space-x-4">
                <img
                  className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover"
                  alt="Sarah Henderson"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh60U4wQ_AUnqqzorD0-1_N3hEut_zQM643983iq7okXLSAftB0sQClXy89wB0EidzIhZk83AnTely4d45nM2DW0MMiyh2xUEoNVe1kEjGm9aI5NboLFNM1LT0oo6XSF0bq9M_O5V-qkDxMnOS0mxBzXaumnZjCKa4RvJnu8YimE84GRBTFft7W_kKWL1gELuD-Ky99UOVwCxQGsnBYfajMeTviCmj8u640Bwy3y8vsxBnYq3g9UyJgBuvE-J65VHVlur08fNaz1o"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover"
                  alt="Sarah Jenkins"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuByqxmsrqKUye14e7fenn3nwB26WQbneFoP9fBq_fA7_evX3t5qz5gLfJnTTIsqK0zFF1P4tS6UZG77HJLcyJ8CV5BC3NLvPRI22V8q7LW5LfxHcW4g2gaiiTkNclVnNQJmMjsLMJOEysTy-nlYqykWCn5ASMq4y35Ynpk-odxEmMERygT2F3__9o5M4HKBREYt6q4ZCpboxSzFb1UIL13xakmgnY0mDI4LtgCO2iTh78Lno20HRC6F4UmcpyD4B2xFMVWPG-h8BhA"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover"
                  alt="D. Patterson"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDuN9D3ckA4_vnnCBFp9YIcc8e984r9c50daDKglM8H4AB_6JoEooyWwp8iSVmWvUQo5pAndUOlFF7CyS4oFxJ3d9oG2LBB3AifbDvTZROyHRN4289QUKYvu-q85p8XR_oSC3pMbA_y2mcfDkb6iDyk0sr62aA2bMJ4PosEDbtMhTomiODbJst4L_w8GQ-cyg2jzO5zr7J3RqJICU__Qy7YnTlod1IZN4WEqp4vSTOZC0_0EE5wXtZvWz5yxuqCU9Dn44uGenH02w"
                />
              </div>
              <p className="font-label-md text-label-md text-primary self-center">Active now</p>
            </div>
          </div>
          {/* Bottom tag */}
          <div className="absolute bottom-10 left-10 opacity-40">
            <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
              Precision &amp; Performance
            </span>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-md bg-[#0F172A] relative">
          {/* Top Bar Navigation */}
          <div className="absolute top-6 left-8 right-8 flex justify-between items-center">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <span className="material-symbols-outlined text-primary text-3xl mr-sm">terminal</span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface">DevHub</span>
            </div>
            <NavLink to="/" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Explore
            </NavLink>
          </div>

          <div className="w-full max-w-md bg-[#1E293B] p-xl rounded-xl border border-white/10 shadow-2xl">
            <div className="mb-xl text-center lg:text-left">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Welcome back</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Please enter your details to sign in.</p>
            </div>

            <form className="space-y-lg" onSubmit={handleSubmit}>
              {/* Email address */}
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-lg">
                    mail
                  </span>
                  <input
                    className="w-full bg-[#0F172A] border border-outline-variant rounded-lg py-md pl-12 pr-md text-on-surface font-body-md transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                    id="email"
                    name="email"
                    placeholder="dev@example.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-xs">
                <div className="flex justify-between items-center">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                    Password
                  </label>
                  <a
                    className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-lg">
                    lock
                  </span>
                  <input
                    className="w-full bg-[#0F172A] border border-outline-variant rounded-lg py-md pl-12 pr-12 text-on-surface font-body-md transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
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
                className="w-full bg-[#c0c1ff] hover:opacity-90 text-[#1000a9] font-label-md py-md rounded-lg transition-all active:scale-[0.98] font-bold shadow-lg shadow-primary/10 cursor-pointer disabled:opacity-50"
                type="submit"
                disabled={status.loading}
              >
                {status.loading ? "Signing in..." : "Login"}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-sm">
                <div className="flex-grow border-t border-outline-variant"></div>
                <span className="flex-shrink mx-md font-label-sm text-label-sm text-outline uppercase tracking-widest">
                  or
                </span>
                <div className="flex-grow border-t border-outline-variant"></div>
              </div>

              {/* Google login mock */}
              <button
                className="w-full bg-transparent border border-outline-variant hover:bg-white/5 text-on-surface font-label-md py-md rounded-lg flex items-center justify-center gap-sm transition-all active:scale-[0.98] cursor-pointer"
                type="button"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.44-1.2 1.2-2.92 1.88-5.72 1.88-4.12 0-7.52-3.32-7.52-7.44s3.4-7.44 7.52-7.44c2.24 0 4 .8 5.32 2.08l2.32-2.32C18.12 3.44 15.68 2 12.48 2 6.48 2 2 6.48 2 12s4.48 10 10.48 10c3.24 0 5.72-1.08 7.64-3.08 2-2 2.64-4.8 2.64-7.12 0-.44-.04-.88-.12-1.32h-10.16z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Continue with Google
              </button>
            </form>

            <div className="mt-xl text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Don't have an account?
                <NavLink className="text-primary font-semibold hover:underline ml-1" to="/register">
                  Create one
                </NavLink>
              </p>
            </div>
          </div>

          {/* Footer links */}
          <div className="absolute bottom-md left-0 w-full px-xl flex justify-center gap-lg font-label-sm text-label-sm text-outline">
            <a className="hover:text-on-surface-variant transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-on-surface-variant transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-on-surface-variant transition-colors" href="#">
              Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
