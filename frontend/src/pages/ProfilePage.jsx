import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  updateProfile as updateProfileRequest,
} from "../services/authApi";
import { getPosts } from "../services/postApi";

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

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const user = session?.user;

  const displayName = formData.fullName.trim() || user?.fullName || user?.username || "Developer";

  useEffect(() => {
    if (!user) return;
    const loadUserPosts = async () => {
      setPostsLoading(true);
      try {
        const response = await getPosts(1, 50);
        if (response && response.posts) {
          const filtered = response.posts.filter(
            (p) => p.title?.toLowerCase() === displayName.toLowerCase() || p.title?.toLowerCase() === user.username.toLowerCase()
          );
          setUserPosts(filtered);
        }
      } catch (err) {
        console.error("Failed to load user posts:", err);
      } finally {
        setPostsLoading(false);
      }
    };
    loadUserPosts();
  }, [displayName, user?.username]);

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
      setTimeout(() => {
        setIsEditing(false);
        setStatus((prev) => ({ ...prev, success: "" }));
      }, 1000);
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || "Unable to update profile.",
        success: "",
      });
    }
  };

  const skillsToRender = previewProfile.skills.length > 0 ? previewProfile.skills : ["React", "Next.js", "Rust", "GraphQL", "Docker"];

  if (isEditing) {
    return (
      <section className="min-h-screen bg-[#081124] text-on-surface">
        <div className="mx-auto grid min-h-screen max-w-[1480px] grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="border-r border-white/10 bg-[radial-gradient(circle_at_top,_rgba(169,176,255,0.18),_transparent_38%),linear-gradient(180deg,_#0d142d_0%,_#0a1227_100%)] px-6 py-8 xl:px-8">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-label-sm text-on-surface-variant transition-colors hover:bg-white/5 hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">west</span>
              Back to Profile
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
                  className="rounded-full border border-white/10 px-5 py-3 text-label-md text-on-surface-variant transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
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
                    <button type="button" onClick={() => setIsEditing(false)} className="rounded-full border border-white/10 px-5 py-3 text-label-md text-on-surface-variant transition-colors hover:bg-white/5 hover:text-white cursor-pointer">
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

  // Read-only dashboard view
  return (
    <div className="min-h-screen bg-[#0f172a] text-on-surface flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#13131b]/70 backdrop-blur-xl border-b border-white/10 shadow-sm w-full sticky top-0 z-50">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1480px] mx-auto w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="font-headline-md text-headline-md font-bold text-on-surface tracking-tighter bg-transparent border-none outline-none cursor-pointer">
              DevHub
            </button>
            <nav className="hidden md:flex gap-lg items-center ml-8">
              <button onClick={() => navigate("/")} className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md bg-transparent border-none cursor-pointer">
                Explore
              </button>
              <button onClick={() => navigate("/stack")} className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md bg-transparent border-none cursor-pointer">
                Projects
              </button>
              <button onClick={() => navigate("/search")} className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md bg-transparent border-none cursor-pointer">
                Community
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-md">
            <button onClick={() => navigate("/")} className="bg-primary-container text-on-primary-container font-bold px-lg py-sm rounded-lg active:scale-95 transition-all font-label-md text-label-md cursor-pointer border-none">
              Create Post
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10">
              <img className="w-full h-full object-cover" alt="avatar" src={defaultAvatar} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow flex w-full max-w-[1480px] mx-auto overflow-hidden">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/10 bg-surface-container-lowest px-4 py-6">
          <nav className="flex flex-col gap-xs flex-grow">
            <button onClick={() => navigate("/")} className="text-on-surface-variant hover:bg-white/5 px-4 py-3 flex items-center gap-md font-label-md text-label-md transition-all duration-200 w-full text-left bg-transparent border-none cursor-pointer rounded-lg">
              <span className="material-symbols-outlined">home</span>
              Home
            </button>
            <button onClick={() => navigate("/")} className="text-on-surface-variant hover:bg-white/5 px-4 py-3 flex items-center gap-md font-label-md text-label-md transition-all duration-200 w-full text-left bg-transparent border-none cursor-pointer rounded-lg">
              <span className="material-symbols-outlined">explore</span>
              Explore
            </button>
            <button className="text-on-surface-variant hover:bg-white/5 px-4 py-3 flex items-center gap-md font-label-md text-label-md transition-all duration-200 w-full text-left bg-transparent border-none cursor-pointer rounded-lg">
              <span className="material-symbols-outlined">notifications</span>
              Notifications
            </button>
            <button className="text-on-surface-variant hover:bg-white/5 px-4 py-3 flex items-center gap-md font-label-md text-label-md transition-all duration-200 w-full text-left bg-transparent border-none cursor-pointer rounded-lg">
              <span className="material-symbols-outlined">mail</span>
              Messages
            </button>
            <button className="bg-secondary-container/20 text-primary border-r-4 border-primary px-4 py-3 flex items-center gap-md font-label-md text-label-md transition-all duration-200 w-full text-left bg-transparent border-none cursor-pointer rounded-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              Profile
            </button>
          </nav>

          <div className="px-2 mt-auto">
            <button onClick={() => navigate("/")} className="w-full bg-[#8083ff] text-[#0d0096] py-3 rounded-xl font-label-md text-label-md font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer border-none">
              New Snippet
            </button>
            <button className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 py-3 font-label-md text-label-md font-bold text-on-surface-variant hover:text-white transition-colors hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">settings</span>
              Settings
            </button>
          </div>
        </aside>

        {/* Dashboard Body Grid */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 max-w-[1100px] mx-auto">
            
            {/* Left Column (Cover, Bio, Tabs, Projects) */}
            <div className="space-y-6">
              
              {/* Cover Banner Card */}
              <div className="bg-[#1f1f27] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                
                {/* Banner Style */}
                <div className="h-48 w-full bg-[#080b11] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(120,119,198,0.15),transparent_100%)]"></div>
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1f1f27] to-transparent"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(99,102,241,0.08)_0%,rgba(168,85,247,0.04)_50%,rgba(0,0,0,0)_100%)]"></div>
                </div>

                {/* Avatar and Buttons */}
                <div className="relative px-6 pb-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 mb-6 gap-4">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
                      <img
                        src={defaultAvatar}
                        alt={displayName}
                        className="h-28 w-28 rounded-full border-4 border-[#1f1f27] object-cover shadow-xl relative z-10"
                      />
                      <div className="mb-2">
                        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 justify-center md:justify-start">
                          {displayName}
                        </h2>
                        <p className="text-primary font-medium">@{previewProfile.username}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mb-2 justify-center">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold px-5 py-2.5 rounded-xl transition-all font-label-md text-label-md flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Edit Profile
                      </button>
                      <button
                        className="bg-primary text-[#0f172a] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all font-label-md text-label-md cursor-pointer border-none"
                      >
                        Follow
                      </button>
                    </div>
                  </div>

                  {/* Bio and Tags */}
                  <div className="mt-4 border-t border-white/5 pt-4 text-center md:text-left">
                    <p className="text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
                      {previewProfile.headline || previewProfile.bio || "Add your role, stack, and what you are building next."}
                    </p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                      {skillsToRender.map((skill) => (
                        <span
                          key={skill}
                          className="bg-white/5 border border-white/10 text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex justify-around md:justify-start gap-8 border-t border-white/5 pt-6 mt-6 text-center">
                    <div>
                      <div className="text-2xl font-extrabold text-white">{142 + userPosts.length}</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mt-1">Posts</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-white">2.4k</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mt-1">Likes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-white">1.1k</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mt-1">Followers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-white">480</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mt-1">Following</div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Tabs Section */}
              <div className="border-b border-white/10">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab("projects")}
                    className={`pb-3 font-semibold text-sm transition-all bg-transparent border-none cursor-pointer ${activeTab === "projects" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-white"}`}
                  >
                    Projects
                  </button>
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`pb-3 font-semibold text-sm transition-all bg-transparent border-none cursor-pointer ${activeTab === "posts" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-white"}`}
                  >
                    Recent Posts
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "projects" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project 1 */}
                  <div className="bg-[#1e293b]/40 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col justify-between hover:border-white/20 transition-all group">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-primary">
                          <span className="material-symbols-outlined text-[20px]">widgets</span>
                        </div>
                        <a href="#" className="text-on-surface-variant hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                        </a>
                      </div>
                      <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">TurboCache</h4>
                      <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                        A distributed Redis wrapper for Rust applications with zero-copy serialization.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        1.2k
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                        Rust
                      </span>
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div className="bg-[#1e293b]/40 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col justify-between hover:border-white/20 transition-all group">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-primary">
                          <span className="material-symbols-outlined text-[20px]">account_tree</span>
                        </div>
                        <a href="#" className="text-on-surface-variant hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                        </a>
                      </div>
                      <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">GQL-Gen</h4>
                      <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                        Type-safe GraphQL client generator for Next.js 14 and App Router.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        840
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        TypeScript
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {postsLoading ? (
                    <p className="text-sm text-on-surface-variant">Loading posts...</p>
                  ) : userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <div key={post._id} className="bg-[#1e293b]/30 rounded-2xl border border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-2 text-xs text-on-surface-variant">
                          <span className="font-bold text-white">@{user.username}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <p className="text-body-md text-white whitespace-pre-line">{post.body}</p>
                        <div className="flex gap-4 mt-4 text-xs text-on-surface-variant">
                          <span>{post.likes?.length || 0} Likes</span>
                          <span>{post.comments?.length || 0} Comments</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-on-surface-variant border border-dashed border-white/10 rounded-2xl">
                      <span className="material-symbols-outlined text-3xl">post_add</span>
                      <p className="mt-2 text-sm">No recent posts found.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <footer className="mt-12 pt-6 border-t border-white/10 opacity-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
                <div>
                  <span className="font-bold text-white text-sm">DevHub</span>
                  <p className="mt-1">© 2024 DevHub Inc. Built for developers by developers.</p>
                </div>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-white">Privacy</a>
                  <a href="#" className="hover:text-white">Terms</a>
                  <a href="#" className="hover:text-white">API</a>
                  <a href="#" className="hover:text-white">Status</a>
                  <a href="#" className="hover:text-white">GitHub</a>
                </div>
              </footer>

            </div>

            {/* Right Column (Widgets) */}
            <div className="space-y-6">
              
              {/* Activity Card */}
              <div className="bg-[#1e293b]/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-6">Activity</h3>
                <div className="relative pl-6 border-l border-white/10 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[30px] top-1 bg-[#c0c1ff] w-3 h-3 rounded-full border-4 border-[#0f172a]"></span>
                    <div className="text-sm font-bold text-white">Pushed to turbocache-rs</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">4 commits yesterday</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[30px] top-1 bg-[#c0c1ff]/70 w-3 h-3 rounded-full border-4 border-[#0f172a]"></span>
                    <div className="text-sm font-bold text-white">Starred react-query</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">3 days ago</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[30px] top-1 bg-[#c0c1ff]/45 w-3 h-3 rounded-full border-4 border-[#0f172a]"></span>
                    <div className="text-sm font-bold text-white">Published v1.2.0 of gql-gen</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">1 week ago</div>
                  </div>
                </div>
              </div>

              {/* DevScore Card */}
              <div className="bg-[#1e293b]/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">DevScore</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-extrabold text-white">2,840</span>
                  <span className="bg-[#c0c1ff]/20 text-[#c0c1ff] text-xs px-2.5 py-0.5 rounded-full font-bold">TOP 1%</span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
