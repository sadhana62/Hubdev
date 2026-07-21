import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useRef } from "react";
import { getAuthSession, clearAuthSession } from "../services/authApi";
import { getPosts, createPost, likePost, unlikePost, createComment } from "../services/postApi";
import { useRef, useCallback } from "react";


const normalizeComments = (comments = []) =>
  Array.isArray(comments)
    ? comments.map((comment) => ({
        id: comment._id || comment.id || `${comment.user}-${comment.body}`,
        user: comment.user || "developer",
        body: comment.body || "",
      }))
    : [];

export default function FeedPage() {
  const navigate = useNavigate();
  const authSession = getAuthSession();
  const username = authSession?.user?.username || "developer";
  const userBio = authSession?.user?.bio || "Building tools and sharing ideas";
  const displayName = authSession?.user?.fullName || username.charAt(0).toUpperCase() + username.slice(1);

  // Initial pre-populated posts matching the Stitch design
  const [posts, setPosts] = useState([]);

  const [newPostText, setNewPostText] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const observer = useRef(null);

// pagination
  const [page, setPage] = useState(1);
// const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);
// const [page, setPage] = useState(1);

useEffect(() => {

   const loadPosts = async () => {

      if (loading || !hasMore) return;

      setLoading(true);

      try {

         const response = await getPosts(page,5);

         if(response.posts.length === 0){
            setHasMore(false);
            return;
         }

         const backendPosts = response.posts.map((p)=>{

            const normalizedComments = normalizeComments(p.comments);

            return{
                id:p._id,
                author:p.title,
                handle:"@dev_member",
                time:"Just now",
                avatar:"YOUR_AVATAR_URL",
                text:p.body,
                likes:p.likes?.length || 0,
                comments:normalizedComments.length,
                commentList:normalizedComments,
                isLiked:p.likes?.some(l=>l.user===username) || false
            }

         })

        if(page === 1){
    setPosts(backendPosts);
}
else{
    setPosts(prev => [...prev, ...backendPosts]);
}

      }
      catch(err){
          console.log(err);
      }
      finally{
         setLoading(false);
      }

   }

   loadPosts();



},[page]);

const lastPostRef = useCallback((node) => {

    if (loading) return;

    if (observer.current) {
        observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {

        if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
        }

    });

    if (node) {
        observer.current.observe(node);
    }

}, [loading, hasMore]);

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
          commentList: [],
          isLiked: false,
        };

        setPosts((current) => [newPostBackend, ...current]);
        setNewPostText("");
      }
    } catch (err) {
      console.error("Failed to create post on backend:", err);
    }
  };

  const handleLikePost = async (postId) => {
    const activeSession = getAuthSession();
    const user = activeSession?.user?.username;

    if (!user || typeof postId !== "string") {
      return;
    }

    const targetPost = posts.find((post) => post.id === postId);
    const isLiked = targetPost?.isLiked === true;

    try {
      const response = isLiked
        ? await unlikePost({ post: postId, user })
        : await likePost({ post: postId, user });

      if (response?.post) {
        setPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: response.post.likes?.length ?? post.likes,
                  isLiked: response.liked ?? !isLiked,
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleCommentPost = async (postId) => {
    setActiveCommentPostId((current) => (current === postId ? null : postId));
  };

  const handleCommentDraftChange = (postId, value) => {
    setCommentDrafts((current) => ({
      ...current,
      [postId]: value,
    }));
  };

  const handleSubmitComment = async (postId) => {
    const activeSession = getAuthSession();
    const user = activeSession?.user?.username;
    const commentText = commentDrafts[postId]?.trim();

    if (!user || typeof postId !== "string" || !commentText) {
      return;
    }

    try {
      const response = await createComment({
        post: postId,
        user,
        body: commentText,
      });

      if (response?.post) {
        const updatedComments = normalizeComments(response.post.comments);
        setPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: updatedComments.length,
                  commentList: updatedComments,
                }
              : post
          )
        );
      }

      setCommentDrafts((current) => ({
        ...current,
        [postId]: "",
      }));
      setActiveCommentPostId(null);
    } catch (err) {
      console.error("Failed to create comment:", err);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <div className="mx-auto flex h-screen max-w-max-width overflow-hidden bg-[#0f172a] text-on-surface">
      {/* LEFT SIDEBAR */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-surface-container-lowest px-4 py-md lg:flex">
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
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 py-3 font-label-md text-label-md font-bold text-on-surface transition-colors hover:bg-white/10"
          >
            View Profile
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
                {displayName}
              </div>
              <div className="font-label-sm text-label-sm text-on-surface-variant truncate">@{username}</div>
              <div className="mt-1 font-label-sm text-label-sm text-on-surface-variant truncate">{userBio}</div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">more_horiz</span>
          </div>

          {showProfileMenu && (
            <div className="absolute bottom-16 left-0 right-0 bg-[#1E293B] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
              <button
                onClick={() => navigate("/profile")}
                className="w-full px-4 py-3 text-left font-label-md text-label-md text-on-surface hover:bg-white/5 transition-colors flex items-center gap-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">person</span>
                View Profile
              </button>
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
      <main className="min-w-0 flex-1 overflow-y-auto border-r border-white/5">
        <div className="mx-auto w-full max-w-2xl px-4 py-xl md:px-lg">
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
            {posts.map((post,index) => (
              <article key={post.id} ref={index === posts.length - 1 ? lastPostRef : null} className="bg-[#1f1f27] rounded-xl p-lg border border-white/10 shadow-sm hover:shadow-lg transition-all duration-300">
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
                    <button
                      type="button"
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-xs hover:text-primary transition-colors group cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                        {post.isLiked ? "favorite" : "favorite_border"}
                      </span>
                      <span className="font-label-sm text-label-sm">{post.likes}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCommentPost(post.id)}
                      className="flex items-center gap-xs hover:text-primary transition-colors group cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">chat_bubble</span>
                      <span className="font-label-sm text-label-sm">{post.comments}</span>
                    </button>
                    <button type="button" className="flex items-center gap-xs hover:text-primary transition-colors group cursor-pointer">
                      <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">share</span>
                    </button>
                  </div>
                  <button type="button" className="hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                  </button>
                </div>

                {activeCommentPostId === post.id ? (
                  <div className="mt-md border-t border-white/5 pt-md">
                    {post.commentList?.length ? (
                      <div className="mb-md space-y-sm">
                        {post.commentList.map((comment) => (
                          <div key={comment.id} className="rounded-lg border border-white/10 bg-white/5 px-md py-sm">
                            <p className="font-label-sm text-label-sm text-primary">@{comment.user}</p>
                            <p className="mt-xs text-body-sm text-on-surface">{comment.body}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mb-md text-body-sm text-on-surface-variant">No comments yet. Start the conversation.</p>
                    )}
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-sm" htmlFor={`comment-${post.id}`}>
                      Add a comment
                    </label>
                    <textarea
                      id={`comment-${post.id}`}
                      className="w-full min-h-[84px] rounded-lg bg-[#0d0d15] border border-white/10 px-md py-sm text-body-sm text-on-surface outline-none focus:border-primary resize-none"
                      placeholder="Share a reply..."
                      value={commentDrafts[post.id] || ""}
                      onChange={(e) => handleCommentDraftChange(post.id, e.target.value)}
                    />
                    <div className="mt-sm flex justify-end gap-sm">
                      <button
                        type="button"
                        onClick={() => setActiveCommentPostId(null)}
                        className="px-md py-sm rounded-full border border-white/10 text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitComment(post.id)}
                        className="px-md py-sm rounded-full bg-primary text-on-primary text-label-sm font-label-sm font-bold hover:opacity-90 transition-opacity"
                      >
                        Post comment
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden h-screen w-80 shrink-0 overflow-hidden border-l border-white/10 bg-[#0f172a] p-lg xl:block">
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
