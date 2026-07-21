import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  updateProfile as updateProfileRequest,
} from "../services/authApi";

const defaultAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB9Cs3FnKmxvQzkJNuY_KMFgDQJIQ6iGRe0rTmqzaCCCxNexZe1OCgxF5kfCqnTpbQD3Om9UO4c8xVu1eB0R2Vb4-tqGzhiKVGopUwu5zlNvnpcwEyYefOhnbj4XCWbzC8umzJMQCtDhVWMjGSOQO70z3eQGWLI63o7LuhkupRBTqjQP6ZAPvL5o0hbUD4qlFxb9-fhANySuXcas2cTldpEC8pwr6TiF1iJYVIUv7Cfv1uRIH55TPX7fSwH7YAetDi1HFjptzqTbCY";

const buildInitialForm = (user) => ({
  fullName: user?.fullName || "",
  username: user?.username || "",
  bio: user?.bio || "",
  headline: user?.headline || "",
  location: user?.location || "",
  website: user?.website || "",
  github: user?.github || "",
  availability: user?.availability || "Open to collaborate",
  skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
});

export default function ProfilePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getAuthSession());
  const [formData, setFormData] = useState(() => buildInitialForm(getAuthSession()?.user));
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const user = session?.user;

  if (!user) {
    navigate("/login");
    return null;
  }

  const previewProfile = {
    fullName: formData.fullName.trim() || user.fullName || "",
    username: formData.username.trim() || user.username || "",
    bio: formData.bio.trim() || user.bio || "",
    headline: formData.headline.trim() || user.headline || "",
    location: formData.location.trim() || user.location || "",
    website: formData.website.trim() || user.website || "",
    github: formData.github.trim() || user.github || "",
    availability: formData.availability.trim() || user.availability || "",
    skills: formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
  };
  const displayName = previewProfile.fullName || previewProfile.username || "Developer";
  const focusAreas = previewProfile.skills.slice(0, 4);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({
      loading: true,
      error: "",
      success: "",
    });

    try {
      const payload = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await updateProfileRequest(payload, session.accessToken);
      saveAuthSession(response.data);
      setSession(response.data);
      setFormData(buildInitialForm(response.data.user));
      setStatus({
        loading: false,
        error: "",
        success: "Profile updated successfully.",
      });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || "Unable to update profile.",
        success: "",
      });
    }
  };

  return (
    <section className="min-h-screen bg-[#081124] text-on-surface">
      <div className="mx-auto grid min-h-screen max-w-[1480px] grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="border-r border-white/10 bg-[radial-gradient(circle_at_top,_rgba(169,176,255,0.18),_transparent_38%),linear-gradient(180deg,_#0d142d_0%,_#0a1227_100%)] px-6 py-8 xl:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-label-sm text-on-surface-variant transition-colors hover:bg-white/5 hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">west</span>
            Back to feed
          </button>

          <div className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(3,8,28,0.55)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-label-sm uppercase tracking-[0.32em] text-primary/80">Profile Studio</p>
                <h1 className="mt-3 text-[2.3rem] font-extrabold leading-tight text-white">
                  Shape your developer identity
                </h1>
              </div>
              <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-label-sm text-primary">
                Live
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#101a36]">
              <div className="h-28 bg-[linear-gradient(120deg,_rgba(104,120,255,0.85),_rgba(37,211,197,0.3))]" />
              <div className="px-6 pb-6">
                <div className="-mt-10 flex items-end justify-between gap-4">
                  <img
                    src={defaultAvatar}
                    alt={displayName}
                    className="h-20 w-20 rounded-[24px] border-4 border-[#101a36] object-cover shadow-lg"
                  />
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-label-sm text-emerald-200">
                    {previewProfile.availability || "Open to collaborate"}
                  </div>
                </div>

                <h2 className="mt-4 text-[1.7rem] font-bold text-white">{displayName}</h2>
                <p className="mt-1 text-body-md text-primary">@{previewProfile.username}</p>
                <p className="mt-4 text-body-md text-on-surface-variant">
                  {previewProfile.headline || previewProfile.bio || "Add your role, stack, and what you are building next."}
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { label: "Posts", value: "24" },
                    { label: "Followers", value: "1.8k" },
                    { label: "Following", value: "312" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center">
                      <p className="text-[1.3rem] font-bold text-white">{item.value}</p>
                      <p className="mt-1 text-label-sm text-on-surface-variant">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-label-sm uppercase tracking-[0.24em] text-on-surface-variant">Focus areas</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(focusAreas.length ? focusAreas : ["react", "node", "ui systems"]).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-label-sm text-primary"
                      >
                        #{skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#0d1731] p-4">
                <p className="text-label-sm uppercase tracking-[0.24em] text-on-surface-variant">Location</p>
                <p className="mt-2 text-body-md text-white">{previewProfile.location || "Add your city or timezone"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0d1731] p-4">
                <p className="text-label-sm uppercase tracking-[0.24em] text-on-surface-variant">Links</p>
                <p className="mt-2 truncate text-body-md text-white">{previewProfile.website || previewProfile.github || "Portfolio / GitHub"}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,_rgba(18,28,58,0.96),_rgba(11,17,36,0.98))] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-label-sm uppercase tracking-[0.24em] text-on-surface-variant">Saved Profile Look</p>
                  <h3 className="mt-2 text-xl font-bold text-white">This is how your profile reads after save</h3>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-label-sm text-primary">
                  Preview
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-white/10 bg-[#0b1328] p-5 shadow-[0_18px_60px_rgba(3,8,28,0.45)]">
                <div className="flex items-start gap-4">
                  <img
                    src={defaultAvatar}
                    alt={displayName}
                    className="h-16 w-16 rounded-[20px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-[1.2rem] font-bold text-white">{displayName}</h4>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-label-sm text-emerald-200">
                        {previewProfile.availability || "Open to collaborate"}
                      </span>
                    </div>
                    <p className="mt-1 text-body-sm text-primary">@{previewProfile.username}</p>
                    <p className="mt-3 text-body-md text-on-surface-variant">
                      {previewProfile.headline || previewProfile.bio || "Your profile summary will appear here after saving."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-label-sm uppercase tracking-[0.24em] text-on-surface-variant">About</p>
                    <p className="mt-2 text-body-md text-white">{previewProfile.bio || "Add a short bio to introduce your work."}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-label-sm uppercase tracking-[0.24em] text-on-surface-variant">Links & Location</p>
                    <p className="mt-2 text-body-md text-white">
                      {previewProfile.location || "Location"}
                      {(previewProfile.website || previewProfile.github) ? " · " : ""}
                      {previewProfile.website || previewProfile.github || "Portfolio / GitHub"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(previewProfile.skills.length ? previewProfile.skills : ["react", "node", "ui systems"]).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-label-sm text-primary"
                    >
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="px-5 py-8 md:px-8 xl:px-10">
          <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,_rgba(17,24,47,0.96),_rgba(11,17,36,0.98))] shadow-[0_30px_100px_rgba(3,8,28,0.6)]">
            <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
              <div>
                <p className="text-label-sm uppercase tracking-[0.3em] text-primary/80">Edit Profile</p>
                <h2 className="mt-2 text-[2rem] font-bold text-white">Make your profile feel like you</h2>
                <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
                  Update your intro, links, skills, and availability so your DevHub profile works like a live builder card.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/10 px-5 py-3 text-label-md text-on-surface-variant transition-colors hover:bg-white/5 hover:text-white"
              >
                Logout
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 px-6 py-6 md:px-8 md:py-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-label-sm uppercase tracking-[0.24em] text-on-surface-variant">Identity</p>
                  <div className="mt-5 grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-label-sm text-on-surface-variant">Full name</span>
                      <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ada Lovelace" className="w-full rounded-2xl border border-white/10 bg-[#0d1329] px-4 py-3 text-body-md text-white outline-none transition-colors focus:border-primary" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-label-sm text-on-surface-variant">Username</span>
                      <input name="username" value={formData.username} onChange={handleChange} placeholder="ada_codes" className="w-full rounded-2xl border border-white/10 bg-[#0d1329] px-4 py-3 text-body-md text-white outline-none transition-colors focus:border-primary" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-label-sm text-on-surface-variant">Headline</span>
                      <input name="headline" value={formData.headline} onChange={handleChange} placeholder="Frontend engineer crafting developer tools" className="w-full rounded-2xl border border-white/10 bg-[#0d1329] px-4 py-3 text-body-md text-white outline-none transition-colors focus:border-primary" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-label-sm text-on-surface-variant">Bio</span>
                      <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" maxLength={160} placeholder="Share what you build, what you care about, and the kind of work you want to attract." className="w-full rounded-2xl border border-white/10 bg-[#0d1329] px-4 py-3 text-body-md text-white outline-none transition-colors focus:border-primary" />
                    </label>
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-label-sm uppercase tracking-[0.24em] text-on-surface-variant">Presence</p>
                  <div className="mt-5 grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-label-sm text-on-surface-variant">Location</span>
                      <input name="location" value={formData.location} onChange={handleChange} placeholder="Bengaluru, India" className="w-full rounded-2xl border border-white/10 bg-[#0d1329] px-4 py-3 text-body-md text-white outline-none transition-colors focus:border-primary" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-label-sm text-on-surface-variant">Portfolio / website</span>
                      <input name="website" value={formData.website} onChange={handleChange} placeholder="https://your-site.dev" className="w-full rounded-2xl border border-white/10 bg-[#0d1329] px-4 py-3 text-body-md text-white outline-none transition-colors focus:border-primary" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-label-sm text-on-surface-variant">GitHub</span>
                      <input name="github" value={formData.github} onChange={handleChange} placeholder="github.com/your-handle" className="w-full rounded-2xl border border-white/10 bg-[#0d1329] px-4 py-3 text-body-md text-white outline-none transition-colors focus:border-primary" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-label-sm text-on-surface-variant">Availability</span>
                      <input name="availability" value={formData.availability} onChange={handleChange} placeholder="Open to freelance and collabs" className="w-full rounded-2xl border border-white/10 bg-[#0d1329] px-4 py-3 text-body-md text-white outline-none transition-colors focus:border-primary" />
                    </label>
                  </div>
                </section>
              </div>

              <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-label-sm uppercase tracking-[0.24em] text-on-surface-variant">Tech stack</p>
                    <h3 className="mt-2 text-xl font-bold text-white">Highlight the tools you want to be known for</h3>
                  </div>
                  <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-label-sm text-primary">
                    Separate skills with commas
                  </div>
                </div>
                <textarea name="skills" value={formData.skills} onChange={handleChange} rows="4" placeholder="react, node.js, express, mongodb, design systems" className="mt-5 w-full rounded-2xl border border-white/10 bg-[#0d1329] px-4 py-3 text-body-md text-white outline-none transition-colors focus:border-primary" />
              </section>

              {(status.error || status.success) && (
                <div className={status.error ? "rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-body-md text-red-200" : "rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-body-md text-emerald-200"}>
                  {status.error || status.success}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
                <p className="text-body-sm text-on-surface-variant">
                  Your updates will be reflected in your active DevHub session immediately.
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => navigate("/")} className="rounded-full border border-white/10 px-5 py-3 text-label-md text-on-surface-variant transition-colors hover:bg-white/5 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" disabled={status.loading} className="rounded-full bg-primary px-6 py-3 text-label-md font-bold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                    {status.loading ? "Saving..." : "Save profile"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}
