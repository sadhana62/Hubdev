import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthSession, clearAuthSession } from "../services/authApi";
import { getPosts, createPost } from "../services/postApi";

export default function FeedPage() {
  const navigate = useNavigate();
  const authSession = getAuthSession();
  const username = authSession?.user?.username || "developer";
  const userBio = authSession?.user?.bio || "Building tools and sharing ideas";

  // Initial pre-populated posts matching the Stitch design
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Sarah Chen",
      handle: "@schen_io",
      time: "2h ago",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDljKnOzEpf_svp1H7bhHUfXKcQAfJZlZGbY7Iot23UkjQEyDQuGw84268JUDluCOCVAduyymG7uTODbNh_wpbmad6zUu29NNSQHET9kEqhuVkPKxmzpa2lGjzOHBSL_RG-cvlpKfdySsJbEdQNAJVHl1Qhpw1XOdPQz8PuWfW78OxEZDQxkMd-pn0YudiGscvgEeHfNL-UBRPW5bCplbWQvM0ldiY6ZXkHiGTXXXfh0gI2dB1g56tS1Xi-MPJBh5jonAMibDp7fiE",
      text: "Just optimized our async message queue using Tokio. The performance gains in Rust are honestly breathtaking. Check out this trait implementation for our worker pool! 🦀✨",
      code: {
        filename: "worker_pool.rs",
        content: `pub trait Worker {
    type Input;
    async fn process(&self, data: Self::Input) -> Result<(), Error>;
}

#[tokio::main]
async fn main() {
    let pool = Pool::new(32).await;
    pool.spawn_workers().await?;
}`
      },
      likes: "1.2k",
      comments: 48,
    },
    {
      id: 2,
      author: "Marcus T.",
      handle: "@marcus_builds",
      time: "5h ago",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGYSzQs0_BByK_cibiR8_LUugtNrA17EJq8iDQCX6I8sNvtia1l6rET-WyJd4Gmi4OHrsQqIQWic8w2c0akUZWo8c2s3YP1VfS0IBFXkx41L3AZbhtlZenHAlreew3hxelXXyhdKS6HvfIaWDLAMxXEQkqx6XAxLaGIXC6ze5H2FVm_DmvMM9YRJcXpxSB_C7Uosd22VVVDJev0voHqcaZhzvPQa7Evd6iX7rEnbGZcydrhZRYLnz18OOBcoEWOgfiWoWovU-lISk",
      text: "Finally shipped the beta of \"Nebula Dash\" — an open-source dashboard for Kubernetes clusters. Built with Next.js 14 and Three.js for real-time visualization.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUuurDV2JWAuNhEOFe5-NDXqusmSDuMPt39Ly33D0qIBlJlHHKrIu2fiYRGbjtm5Z8WaGWBroJM0N-P-NVaL0dZVvBT1_dwKNLu18MVnxuEN0IH0YoRXX2UWy1RedFfLG6sXUsYvyyFGwPBTC66t5Qyx_sPI2VBVf9xw3MqjCSdyBOKl-AHg8I8KoKqtm-6pulJ_GKjbfDN-tiu3WCRxqrqAblphTCROpzfuLrkENG7dpF9w3oJsuIyjrrJRMA2vcyTih1EJiVl0Q",
      likes: "842",
      comments: 124,
    }
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await getPosts();
        if (response && response.posts) {
          const backendPosts = response.posts.map((p) => ({
            id: p._id,
            author: p.title || "DevHub Engineer",
            handle: `@dev_member`,
            time: "Just now",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9Cs3FnKmxvQzkJNuY_KMFgDQJIQ6iGRe0rTmqzaCCCxNexZe1OCgxF5kfCqnTpbQD3Om9UO4c8xVu1eB0R2Vb4-tqGzhiKVGopUwu5zlNvnpcwEyYefOhnbj4XCWbzC8umzJMQCtDhVWMjGSOQO70z3eQGWLI63o7LuhkupRBTqjQP6ZAPvL5o0hbUD4qlFxb9-fhANySuXcas2cTldpEC8pwr6TiF1iJYVIUv7Cfv1uRIH55TPX7fSwH7YAetDi1HFjptzqTbCY",
            text: p.body,
            likes: p.likes?.length || 0,
            comments: p.comments?.length || 0,
          }));

          setPosts((prev) => [
            ...backendPosts,
            ...prev.filter((x) => typeof x.id === "number"),
          ]);
        }
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    };
    loadPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const titleVal = username.charAt(0).toUpperCase() + username.slice(1);

    try {
      const response = await createPost({
        title: titleVal,
        body: newPostText,
      });

      if (response && response.post) {
        const newPostBackend = {
          id: response.post._id,
          author: titleVal,
          handle: `@${username}`,
          time: "Just now",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl8Tr-b7rkNigRE1UnhaBQhjKDIyNG8jIh7YIxFQcYysPdHSomYxYS80xW1bnFszVacYc5BbOVp6FQCx8jVDMVbGvmvhJyhVrGZlVgVZeJ1gewI6A8Y3BEToZ1qHyFMRVir_zGvICmD0Nu1Z9oOINvWQqadSdAJYPgEhkzbi_xKZi84jqmciul3wWa-8fKwl4fiU-YK5sFQf8kIwB4dImRxBkrqhWEMSwT32mHnzdqqz8O7ulzlhvAvR6hMM9h7wFiiGCl07dX7a8",
          text: response.post.body,
          likes: 0,
          comments: 0,
        };

        setPosts((current) => [newPostBackend, ...current]);
        setNewPostText("");
      }
    } catch (err) {
      console.error("Failed to create post on backend:", err);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <div className="max-w-max-width mx-auto flex min-h-screen relative bg-[#0f172a] text-on-surface">
      {/* LEFT SIDEBAR */}
      <aside className="bg-surface-container-lowest h-screen sticky top-0 w-64 hidden lg:flex flex-col border-r border-white/10 py-md px-4 z-40">
        <div className="mb-xl px-2">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">DevHub</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">Developer Network</p>
        </div>
        <nav className="flex flex-col gap-xs flex-grow">
          <a className="bg-secondary-container/20 text-primary border-r-4 border-primary px-4 py-3 flex items-center gap-md font-label-md text-label-md transition-all duration-200" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            Home
          </a>
          <a className="text-on-surface-variant hover:bg-white/5 px-4 py-3 flex items-center gap-md font-label-md text-label-md transition-all duration-200" href="#" onClick={(e) => { e.preventDefault(); navigate("/stack"); }}>
            <span className="material-symbols-outlined">explore</span>
            Explore
          </a>
          <a className="text-on-surface-variant hover:bg-white/5 px-4 py-3 flex items-center gap-md font-label-md text-label-md transition-all duration-200" href="#">
            <span className="material-symbols-outlined">notifications</span>
            Notifications
          </a>
          <a className="text-on-surface-variant hover:bg-white/5 px-4 py-3 flex items-center gap-md font-label-md text-label-md transition-all duration-200" href="#">
            <span className="material-symbols-outlined">mail</span>
            Messages
          </a>
          <a className="text-on-surface-variant hover:bg-white/5 px-4 py-3 flex items-center gap-md font-label-md text-label-md transition-all duration-200" href="#">
            <span className="material-symbols-outlined">bookmark</span>
            Bookmarks
          </a>
        </nav>

        <div className="px-2 mb-xl">
          <button className="w-full bg-primary-container text-on-primary-container py-3 rounded-xl font-label-md text-label-md font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer">
            New Snippet
          </button>
        </div>

        {/* Profile Card */}
        <div className="relative mt-auto">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="bg-surface-container-low p-md rounded-xl border border-white/10 flex items-center gap-md cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img 
                className="w-full h-full object-cover" 
                alt={username} 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9Cs3FnKmxvQzkJNuY_KMFgDQJIQ6iGRe0rTmqzaCCCxNexZe1OCgxF5kfCqnTpbQD3Om9UO4c8xVu1eB0R2Vb4-tqGzhiKVGopUwu5zlNvnpcwEyYefOhnbj4XCWbzC8umzJMQCtDhVWMjGSOQO70z3eQGWLI63o7LuhkupRBTqjQP6ZAPvL5o0hbUD4qlFxb9-fhANySuXcas2cTldpEC8pwr6TiF1iJYVIUv7Cfv1uRIH55TPX7fSwH7YAetDi1HFjptzqTbCY"
              />
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="font-label-md text-label-md font-bold text-on-surface truncate">
                {username.charAt(0).toUpperCase() + username.slice(1)}
              </div>
              <div className="font-label-sm text-label-sm text-on-surface-variant truncate">@{username}</div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">more_horiz</span>
          </div>

          {showProfileMenu && (
            <div className="absolute bottom-16 left-0 right-0 bg-[#1E293B] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left font-label-md text-label-md text-red-400 hover:bg-white/5 transition-colors flex items-center gap-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout Session
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-xs mt-lg pb-md">
          <a className="text-on-surface-variant hover:text-on-surface px-4 py-1 flex items-center gap-md font-label-sm text-label-sm transition-all" href="#">
            <span className="material-symbols-outlined text-sm">settings</span>
            Settings
          </a>
          <a className="text-on-surface-variant hover:text-on-surface px-4 py-1 flex items-center gap-md font-label-sm text-label-sm transition-all" href="#">
            <span className="material-symbols-outlined text-sm">help</span>
            Support
          </a>
        </div>
      </aside>

      {/* CENTER FEED */}
      <main className="flex-grow min-w-0 border-r border-white/5">
        <div className="w-full max-w-2xl mx-auto px-4 md:px-lg py-xl">
          {/* Header for mobile/tablet */}
          <div className="lg:hidden flex justify-between items-center mb-xl">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">DevHub</h1>
            <div 
              onClick={handleLogout}
              className="w-8 h-8 rounded-full overflow-hidden border border-white/10 cursor-pointer"
              title="Logout"
            >
              <img 
                className="w-full h-full object-cover" 
                alt="user avatar" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFYdPY92ED5Y6cHKbojwLSWd3QuetaRrQn8Gqfk637tnVeTRfmBI1KBzZG4l3KRnSlzy0oJkkrbgyFG-RuWnKEK8HU73yHuzEvkNGvsEDR5IBfliXgzV2Z90YKV8nHlBMW0a99B_ySxQ37WnNjDOb6LG_87nz2Lh2q0DliensnQ4NapMwVST1ZngoJyFGhz5Y4rbii3AuTjFxxexWhjoIGNk9R302-wJo4erst9uds_WJSJJThJTeNmngjYN1mgpUiAMLEntNgZek"
              />
            </div>
          </div>

          {/* Create Post Card */}
          <div className="bg-[#1f1f27] rounded-xl p-lg border border-white/10 mb-xl shadow-sm">
            <div className="flex gap-md">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  className="w-full h-full object-cover" 
                  alt="user avatar" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl8Tr-b7rkNigRE1UnhaBQhjKDIyNG8jIh7YIxFQcYysPdHSomYxYS80xW1bnFszVacYc5BbOVp6FQCx8jVDMVbGvmvhJyhVrGZlVgVZeJ1gewI6A8Y3BEToZ1qHyFMRVir_zGvICmD0Nu1Z9oOINvWQqadSdAJYPgEhkzbi_xKZi84jqmciul3wWa-8fKwl4fiU-YK5sFQf8kIwB4dImRxBkrqhWEMSwT32mHnzdqqz8O7ulzlhvAvR6hMM9h7wFiiGCl07dX7a8"
                />
              </div>
              <form onSubmit={handleCreatePost} className="flex-grow">
                <textarea 
                  className="w-full bg-transparent border-none focus:ring-0 text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/50 resize-none min-h-[80px] outline-none" 
                  placeholder="What are you building today?" 
                  rows="3"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                />
                <div className="flex justify-between items-center pt-md border-t border-white/5">
                  <div className="flex gap-sm text-primary">
                    <button type="button" className="p-sm hover:bg-primary/10 rounded-full transition-colors cursor-pointer">
                      <span className="material-symbols-outlined">image</span>
                    </button>
                    <button type="button" className="p-sm hover:bg-primary/10 rounded-full transition-colors cursor-pointer">
                      <span className="material-symbols-outlined">code</span>
                    </button>
                    <button type="button" className="p-sm hover:bg-primary/10 rounded-full transition-colors cursor-pointer">
                      <span className="material-symbols-outlined">calendar_today</span>
                    </button>
                  </div>
                  <button 
                    type="submit"
                    className="bg-primary text-on-primary px-xl py-sm rounded-full font-label-md text-label-md font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Post Feed */}
          <div className="space-y-lg">
            {posts.map((post) => (
              <article key={post.id} className="bg-[#1f1f27] rounded-xl p-lg border border-white/10 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex gap-md mb-md">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 cursor-pointer">
                    <img className="w-full h-full object-cover" alt={post.author} src={post.avatar} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-body-md text-body-md font-bold text-on-surface hover:underline cursor-pointer">
                          {post.author}
                        </h3>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {post.handle} • {post.time}
                        </span>
                      </div>
                      <button className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface mb-md whitespace-pre-line">
                  {post.text}
                </p>

                {/* Optional code snippet */}
                {post.code && (
                  <div className="bg-[#0d0d15] rounded-lg overflow-hidden mb-md border border-white/10">
                    <div className="flex justify-between items-center px-md py-sm bg-white/5">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{post.code.filename}</span>
                      <span className="material-symbols-outlined text-sm text-on-surface-variant cursor-pointer hover:text-on-surface">content_copy</span>
                    </div>
                    <pre className="p-md font-label-sm text-label-sm text-[#c0c1ff] overflow-x-auto custom-scrollbar">
                      <code>{post.code.content}</code>
                    </pre>
                  </div>
                )}

                {/* Optional image attachment */}
                {post.image && (
                  <div className="rounded-xl overflow-hidden mb-md border border-white/10 relative group cursor-pointer">
                    <img className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105" alt="Post preview" src={post.image} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <h4 className="font-headline-md text-headline-md text-white">Nebula Dash v0.1.0</h4>
                          <p className="font-body-sm text-body-sm text-white/70">github.com/marcus-t/nebula</p>
                        </div>
                        <button className="bg-white/10 backdrop-blur-md border border-white/20 p-sm rounded-full text-white cursor-pointer">
                          <span className="material-symbols-outlined">open_in_new</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interaction Bar */}
                <div className="flex justify-between items-center pt-md border-t border-white/5 text-on-surface-variant">
                  <div className="flex gap-lg">
                    <button className="flex items-center gap-xs hover:text-primary transition-colors group cursor-pointer">
                      <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">favorite</span>
                      <span className="font-label-sm text-label-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-xs hover:text-primary transition-colors group cursor-pointer">
                      <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">chat_bubble</span>
                      <span className="font-label-sm text-label-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-xs hover:text-primary transition-colors group cursor-pointer">
                      <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">share</span>
                    </button>
                  </div>
                  <button className="hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden xl:block w-80 h-screen sticky top-0 p-lg overflow-y-auto z-40 border-l border-white/10 bg-[#0f172a]">
        {/* Trending Tech */}
        <section className="mb-xxl">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-lg">Trending Tech</h2>
          <div className="flex flex-wrap gap-sm">
            <span className="bg-primary/10 text-primary border border-primary/20 px-md py-xs rounded-full font-label-sm text-label-sm hover:bg-primary/20 cursor-pointer transition-colors">#rustlang</span>
            <span className="bg-primary/10 text-primary border border-primary/20 px-md py-xs rounded-full font-label-sm text-label-sm hover:bg-primary/20 cursor-pointer transition-colors">#web3</span>
            <span className="bg-primary/10 text-primary border border-primary/20 px-md py-xs rounded-full font-label-sm text-label-sm hover:bg-primary/20 cursor-pointer transition-colors">#nextjs</span>
            <span className="bg-primary/10 text-primary border border-primary/20 px-md py-xs rounded-full font-label-sm text-label-sm hover:bg-primary/20 cursor-pointer transition-colors">#serverless</span>
            <span className="bg-primary/10 text-primary border border-primary/20 px-md py-xs rounded-full font-label-sm text-label-sm hover:bg-primary/20 cursor-pointer transition-colors">#wasm</span>
            <span className="bg-primary/10 text-primary border border-primary/20 px-md py-xs rounded-full font-label-sm text-label-sm hover:bg-primary/20 cursor-pointer transition-colors">#typescript</span>
          </div>
        </section>

        {/* Suggested Developers */}
        <section className="mb-xxl">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">Who to Follow</h2>
            <button className="text-primary text-label-sm font-label-sm hover:underline cursor-pointer">Show more</button>
          </div>
          <div className="space-y-md">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover" alt="Devon Webb" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx0fwapccQIMUyEXTzjFNb5huPqk_EryuGlvfU1sMpviOyEKqLaZ3zmfUBue5-IRUDnF6kVYeVYMU_Ppmr8gG6XpFg_3fh94Eb_6_5DoSivukexLCaZWEc2aE95U7xIUUBINfHf7xahb9MAIOLCET-cYqmtecpd_SAUFEGij-v-Qmk7ucft_QOZUdVTq6afR0R0wAK5ZoleU9IbFVnUGSHSA_c6djgsftF2FDDsGBf7YMAiolV7-nNnP1egNHRNmItYHtqpnnCTZ8" />
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="font-label-md text-label-md font-bold text-on-surface truncate">Devon Webb</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant truncate">@dwebb_core</div>
              </div>
              <button className="bg-on-surface text-surface px-md py-xs rounded-full font-label-sm text-label-sm font-bold hover:opacity-80 transition-opacity cursor-pointer">
                Follow
              </button>
            </div>
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover" alt="Jamie Park" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoTLqFWwoBXvcTvDc035igytJe_gj41BxhyW421kW4NpOoGaPN1dOUA7frxirkQeyJfUlU8nDSiMDBf2XC1SvRG5Va667HVSZKkHB8wqyDImHegGTMy3pbTbFjsTfVe9MSICUCC9GVaL-4oHsOADOhdIcnuNomVrfza_1MnEgMapTw3Qv44FAaobQFYKHTfskoKoAVF1u1oY5W61hBzc_uAkU9qwEthcnpT3uQi21Urt59QQjx83mMjYKvbPYfDLED-H5ec7q1QWE" />
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="font-label-md text-label-md font-bold text-on-surface truncate">Jamie Park</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant truncate">@jamie_scripts</div>
              </div>
              <button className="bg-on-surface text-surface px-md py-xs rounded-full font-label-sm text-label-sm font-bold hover:opacity-80 transition-opacity cursor-pointer">
                Follow
              </button>
            </div>
          </div>
        </section>

        {/* Latest Projects */}
        <section>
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">Top Projects</h2>
          </div>
          <div className="space-y-md">
            <div className="bg-[#1f1f27] p-md rounded-xl border border-white/10 hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-sm">
                <h3 className="font-label-md text-label-md font-bold text-primary group-hover:underline">PrismORM</h3>
                <div className="flex items-center gap-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-sm text-label-sm">4.2k</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">A high-performance ORM for Rust with auto-generated migrations.</p>
            </div>
            <div className="bg-[#1f1f27] p-md rounded-xl border border-white/10 hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-sm">
                <h3 className="font-label-md text-label-md font-bold text-primary group-hover:underline">FluxUI</h3>
                <div className="flex items-center gap-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-sm text-label-sm">1.8k</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">A library of motion-driven UI components for React and Tailwind.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-xxl py-lg border-t border-white/10 opacity-50">
          <div className="flex flex-wrap gap-md mb-md">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface" href="#">Privacy</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface" href="#">Terms</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface" href="#">API</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface" href="#">GitHub</a>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            © 2024 DevHub Inc. Built for developers by developers.
          </p>
        </footer>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 flex justify-around items-center py-sm z-50">
        <a className="flex flex-col items-center gap-xs text-primary" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-[10px] font-bold">Home</span>
        </a>
        <a className="flex flex-col items-center gap-xs text-on-surface-variant" href="#" onClick={(e) => { e.preventDefault(); navigate("/stack"); }}>
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px]">Explore</span>
        </a>
        <a className="flex flex-col items-center gap-xs text-on-surface-variant relative" href="#">
          <span className="material-symbols-outlined">notifications</span>
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></div>
          <span className="text-[10px]">Alerts</span>
        </a>
        <a className="flex flex-col items-center gap-xs text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">mail</span>
          <span className="text-[10px]">Chat</span>
        </a>
      </nav>
    </div>
  );
}
