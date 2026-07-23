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
      <section className="min-h-screen bg-[#f4f2ee] text-black/90 font-sans pt-6 pb-16">
        <div className="mx-auto max-w-[1128px] px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column - Form Info Banner */}
          <aside className="col-span-12 lg:col-span-4 bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold text-black/60 transition-colors hover:bg-gray-100 hover:text-black cursor-pointer bg-white"
            >
              <span className="material-symbols-outlined text-[16px]">west</span>
              Back to Profile
            </button>

            <div className="mt-5 border-t border-gray-200 pt-5">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0a66c2]">Profile Studio</p>
              <h1 className="mt-2 text-xl font-bold leading-tight text-black/90">
                Shape your developer identity
              </h1>
            </div>

            {/* Profile widget mockup */}
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="h-16 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500" />
              <div className="px-4 pb-4">
                <div className="-mt-8 flex items-end justify-between gap-2">
                  <img
                    src={defaultAvatar}
                    alt={displayName}
                    className="h-16 w-16 rounded-full border-2 border-white object-cover shadow bg-white"
                  />
                  <div className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    {previewProfile.availability || "Open to collaborate"}
                  </div>
                </div>

                <h2 className="mt-3 text-base font-bold text-black/90">{displayName}</h2>
                <p className="text-xs text-[#0a66c2] font-semibold">@{previewProfile.username}</p>
                <p className="mt-2 text-xs text-black/60 line-clamp-2">
                  {previewProfile.headline || previewProfile.bio || "Add your role, stack, and what you are building next."}
                </p>

                <div className="mt-4">
                  <p className="text-[10px] uppercase font-bold text-black/45 tracking-wider">Focus areas</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {(focusAreas.length ? focusAreas : ["react", "node", "ui systems"]).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[#0a66c2]/10 px-2 py-0.5 text-[10px] text-[#0a66c2] font-semibold"
                      >
                        #{skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Center Column - Form details */}
          <main className="col-span-12 lg:col-span-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0a66c2]">Edit Profile</p>
                <h2 className="mt-1 text-lg font-bold text-black/90">Make your profile feel like you</h2>
                <p className="text-xs text-black/60">
                  Update your intro, links, skills, and availability so your DevHub profile works like a live builder card.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 bg-white cursor-pointer"
              >
                Logout
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-bold text-black/60 border-b border-gray-200 pb-1 uppercase tracking-wider">Identity</p>
                  <div className="mt-4 grid gap-3">
                    <label className="block">
                      <span className="mb-1 block text-xs text-black/60">Full name</span>
                      <input 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        placeholder="Ada Lovelace" 
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-black outline-none transition-colors focus:border-[#0a66c2]" 
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs text-black/60">Username</span>
                      <input 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        placeholder="ada_codes" 
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-black outline-none transition-colors focus:border-[#0a66c2]" 
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs text-black/60">Headline</span>
                      <input 
                        name="headline" 
                        value={formData.headline} 
                        onChange={handleChange} 
                        placeholder="Frontend engineer crafting developer tools" 
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-black outline-none transition-colors focus:border-[#0a66c2]" 
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs text-black/60">Bio</span>
                      <textarea 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleChange} 
                        rows="3" 
                        maxLength={160} 
                        placeholder="Share what you build..." 
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-black outline-none transition-colors focus:border-[#0a66c2] resize-none" 
                      />
                    </label>
                  </div>
                </section>

                <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-bold text-black/60 border-b border-gray-200 pb-1 uppercase tracking-wider">Presence</p>
                  <div className="mt-4 grid gap-3">
                    <label className="block">
                      <span className="mb-1 block text-xs text-black/60">Location</span>
                      <input 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        placeholder="Bengaluru, India" 
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-black outline-none transition-colors focus:border-[#0a66c2]" 
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs text-black/60">Portfolio / website</span>
                      <input 
                        name="website" 
                        value={formData.website} 
                        onChange={handleChange} 
                        placeholder="https://your-site.dev" 
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-black outline-none transition-colors focus:border-[#0a66c2]" 
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs text-black/60">GitHub</span>
                      <input 
                        name="github" 
                        value={formData.github} 
                        onChange={handleChange} 
                        placeholder="github.com/your-handle" 
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-black outline-none transition-colors focus:border-[#0a66c2]" 
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs text-black/60">Availability</span>
                      <input 
                        name="availability" 
                        value={formData.availability} 
                        onChange={handleChange} 
                        placeholder="Open to freelance and collabs" 
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-black outline-none transition-colors focus:border-[#0a66c2]" 
                      />
                    </label>
                  </div>
                </section>
              </div>

              <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-black/90">Highlight the tools you want to be known for</h3>
                    <p className="text-xs text-black/60 mt-0.5">Separate skills with commas (e.g. react, rust, node)</p>
                  </div>
                </div>
                <textarea 
                  name="skills" 
                  value={formData.skills} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="react, node.js, express, mongodb, design systems" 
                  className="mt-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-black outline-none transition-colors focus:border-[#0a66c2] resize-none" 
                />
              </section>

              {(status.error || status.success) && (
                <div className={status.error ? "rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800" : "rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"}>
                  {status.error || status.success}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 md:flex-row md:items-center md:justify-between">
                <p className="text-[11px] text-black/45 m-0">
                  Your updates will be reflected in your active DevHub session immediately.
                </p>
                <div className="flex gap-2.5">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="rounded-full border border-gray-300 px-5 py-2 text-xs font-bold text-black/60 transition-colors hover:bg-gray-100 bg-white cursor-pointer font-sans"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={status.loading} 
                    className="rounded-full bg-[#0a66c2] hover:bg-[#004182] px-6 py-2 text-xs font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer font-sans border-none"
                  >
                    {status.loading ? "Saving..." : "Save profile"}
                  </button>
                </div>
              </div>
            </form>
          </main>
        </div>
      </section>
    );
  }

  /* Read-only dashboard view */
  return (
    <div className="w-full bg-[#f4f2ee] text-black/90 font-sans pb-16 pt-6">
      {/* Main Container */}
      <div className="max-w-[1128px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Cover, Bio, Tabs, Projects) (Grid Span 9) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            
            {/* Cover Banner Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              
              {/* Banner Style */}
              <div className="h-44 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500 relative" />

              {/* Avatar and Buttons */}
              <div className="relative px-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between -mt-14 mb-4 gap-4">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-3 text-center md:text-left">
                    <img
                      src={defaultAvatar}
                      alt={displayName}
                      className="h-28 w-28 rounded-full border-4 border-white object-cover bg-white shadow-md relative z-10"
                    />
                    <div className="mb-1">
                      <h2 className="text-xl font-bold text-black/90 flex items-center gap-2 justify-center md:justify-start m-0">
                        {displayName}
                      </h2>
                      <p className="text-[#0a66c2] font-semibold text-sm m-0">@{previewProfile.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2.5 mb-1 justify-center">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white border border-gray-300 hover:bg-gray-50 text-black/60 hover:text-black/90 font-bold px-4 py-2 rounded-full transition-all text-xs flex items-center gap-1.5 cursor-pointer font-sans"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Edit Profile
                    </button>
                    <button
                      className="bg-[#0a66c2] text-white hover:bg-[#004182] font-bold px-5 py-2 rounded-full transition-all text-xs cursor-pointer border-none font-sans"
                    >
                      Follow
                    </button>
                  </div>
                </div>

                {/* Bio and Tags */}
                <div className="mt-4 border-t border-gray-100 pt-4 text-center md:text-left">
                  <p className="text-sm text-black/60 max-w-3xl leading-relaxed m-0">
                    {previewProfile.headline || previewProfile.bio || "Add your role, stack, and what you are building next."}
                  </p>
                  
                  {previewProfile.location && (
                    <p className="text-xs text-black/45 mt-2 flex items-center justify-center md:justify-start gap-1">
                      <span className="material-symbols-outlined text-sm leading-none">location_on</span>
                      {previewProfile.location}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-4">
                    {skillsToRender.map((skill) => (
                      <span
                        key={skill}
                        className="bg-[#edf3f8] text-black/75 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex justify-around md:justify-start gap-8 border-t border-gray-100 pt-4 mt-5 text-center text-xs">
                  <div>
                    <div className="text-lg font-bold text-black/90">{142 + userPosts.length}</div>
                    <div className="text-[10px] text-black/45 uppercase tracking-wider font-semibold mt-0.5">Posts</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-black/90">2.4k</div>
                    <div className="text-[10px] text-black/45 uppercase tracking-wider font-semibold mt-0.5">Likes</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-black/90">1.1k</div>
                    <div className="text-[10px] text-black/45 uppercase tracking-wider font-semibold mt-0.5">Followers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-black/90">480</div>
                    <div className="text-[10px] text-black/45 uppercase tracking-wider font-semibold mt-0.5">Following</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-b border-gray-200 mt-2">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`pb-2.5 font-bold text-sm transition-all bg-transparent border-none cursor-pointer ${activeTab === "projects" ? "text-[#0a66c2] border-b-2 border-[#0a66c2]" : "text-black/60 hover:text-black/90"}`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`pb-2.5 font-bold text-sm transition-all bg-transparent border-none cursor-pointer ${activeTab === "posts" ? "text-[#0a66c2] border-b-2 border-[#0a66c2]" : "text-black/60 hover:text-black/90"}`}
                >
                  Recent Posts
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "projects" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project 1 */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition-all group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-[#0a66c2]/10 p-2 rounded-lg text-[#0a66c2]">
                        <span className="material-symbols-outlined text-[20px]">widgets</span>
                      </div>
                      <a href="#" className="text-black/60 hover:text-[#0a66c2] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      </a>
                    </div>
                    <h4 className="text-base font-bold text-black/90 group-hover:text-[#0a66c2] transition-colors m-0">TurboCache</h4>
                    <p className="text-xs text-black/60 mt-2 leading-relaxed m-0">
                      A distributed Redis wrapper for Rust applications with zero-copy serialization.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-5 pt-3 border-t border-gray-100 text-[11px] text-black/60">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      1.2k
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Rust
                    </span>
                  </div>
                </div>

                {/* Project 2 */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition-all group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-[#0a66c2]/10 p-2 rounded-lg text-[#0a66c2]">
                        <span className="material-symbols-outlined text-[20px]">account_tree</span>
                      </div>
                      <a href="#" className="text-black/60 hover:text-[#0a66c2] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      </a>
                    </div>
                    <h4 className="text-base font-bold text-black/90 group-hover:text-[#0a66c2] transition-colors m-0">GQL-Gen</h4>
                    <p className="text-xs text-black/60 mt-2 leading-relaxed m-0">
                      Type-safe GraphQL client generator for Next.js 14 and App Router.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-5 pt-3 border-t border-gray-100 text-[11px] text-black/60">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      840
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      TypeScript
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {postsLoading ? (
                  <p className="text-xs text-black/60 italic">Loading posts...</p>
                ) : userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div key={post._id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-xs text-black/60">
                        <span className="font-bold text-black/90">@{user.username}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-black/90 whitespace-pre-line leading-relaxed m-0">{post.body}</p>
                      <div className="flex gap-4 mt-4 pt-2 border-t border-gray-100 text-xs text-black/45">
                        <span>{post.likes?.length || 0} Likes</span>
                        <span>{post.comments?.length || 0} Comments</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-black/45 border border-dashed border-gray-300 rounded-lg bg-white">
                    <span className="material-symbols-outlined text-3xl">post_add</span>
                    <p className="mt-2 text-xs">No recent posts found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <footer className="mt-6 pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-black/45">
              <div>
                <span className="font-bold text-black/90 text-xs">DevHub</span>
                <p className="mt-1 m-0">© 2026 DevHub Corporation. Built for developers.</p>
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:text-[#0a66c2] hover:underline">Privacy</a>
                <a href="#" className="hover:text-[#0a66c2] hover:underline">Terms</a>
                <a href="#" className="hover:text-[#0a66c2] hover:underline">API</a>
                <a href="#" className="hover:text-[#0a66c2] hover:underline">GitHub</a>
              </div>
            </footer>

          </div>

          {/* Right Column (Widgets) (Grid Span 4) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            
            {/* Activity Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-black/90 mb-4">Activity</h3>
              <div className="relative pl-6 border-l border-gray-200 space-y-5">
                <div className="relative">
                  <span className="absolute -left-[30px] top-1 bg-[#0a66c2] w-2.5 h-2.5 rounded-full border-2 border-white"></span>
                  <div className="text-xs font-bold text-black/90">Pushed to turbocache-rs</div>
                  <div className="text-[10px] text-black/45 mt-0.5">4 commits yesterday</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[30px] top-1 bg-gray-400 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
                  <div className="text-xs font-bold text-black/90">Starred react-query</div>
                  <div className="text-[10px] text-black/45 mt-0.5">3 days ago</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[30px] top-1 bg-gray-400 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
                  <div className="text-xs font-bold text-black/90">Published v1.2.0 of gql-gen</div>
                  <div className="text-[10px] text-black/45 mt-0.5">1 week ago</div>
                </div>
              </div>
            </div>

            {/* DevScore Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <h3 className="text-[10px] font-bold text-black/45 uppercase tracking-wider m-0">DevScore</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-black/90">2,840</span>
                <span className="bg-[#0a66c2]/10 text-[#0a66c2] text-[10px] px-2 py-0.5 rounded-full font-bold">TOP 1%</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
