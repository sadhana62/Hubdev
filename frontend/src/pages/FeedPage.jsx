import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { useRef } from "react";
import { getAuthSession, clearAuthSession } from "../services/authApi";
import { getPosts, createPost, likePost, unlikePost, createComment } from "../services/postApi";
import { useRef, useCallback } from "react";

// for searching and sorting
import { Search } from "lucide-react";


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
  const [searchParams] = useSearchParams();
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

  // for searching and sort
  const search = searchParams.get("search") || "";
  const [sort, setSort] = useState("latest");

  const observer = useRef(null);

  // pagination
  const [page, setPage] = useState(1);
  // const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // const [page, setPage] = useState(1);

  const formatTime = (date) => {
    const now = new Date();
    const created = new Date(date);

    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return "Just now";

    if (diff < 3600)
      return `${Math.floor(diff / 60)} min ago`;

    if (diff < 86400)
      return `${Math.floor(diff / 3600)} hr ago`;

    if (diff < 604800)
      return `${Math.floor(diff / 86400)} day ago`;

    return created.toLocaleDateString();
  };

  useEffect(() => {

    const loadPosts = async () => {

      if (loading || !hasMore) return;

      setLoading(true);

      try {

        //  const response = await getPosts(page,5);
        const response = await getPosts({
          page,
          limit: 5,
          search,
          sort,
        });

        if (response.posts.length === 0) {
          setHasMore(false);
          return;
        }

        const backendPosts = response.posts.map((p) => {

          const normalizedComments = normalizeComments(p.comments);

          return {
            id: p._id,
            author: p.title,
            handle: "@dev_member",
            time: p.createdAt,
            avatar: "YOUR_AVATAR_URL",
            text: p.body,
            likes: p.likes?.length || 0,
            comments: normalizedComments.length,
            commentList: normalizedComments,
            isLiked: p.likes?.some(l => l.user === username) || false
          }

        })

        if (page === 1) {
          setPosts(backendPosts);
        }
        else {
          setPosts(prev => [...prev, ...backendPosts]);
        }

      }
      catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }

    }

    loadPosts();



  }, [page, search, sort]);


  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [search, sort]);

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
    <div className="w-full bg-[#f4f2ee] text-black/90 font-sans pb-16 pt-6">
      {/* MAIN GRID LAYOUT */}
      <div className="max-w-[1128px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR PROFILE CARD */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col gap-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Cover Banner */}
              <div className="h-14 bg-gradient-to-r f to-indigo-500 relative rounded-t-lg"></div>
              
              {/* Avatar overlapping */}
              <div className="flex justify-center -mt-[36px] px-3">
                <div className="w-[72px] h-[72px] rounded-full border-[2px] border-white overflow-hidden bg-white shadow-md">
                  <img
                    className="w-full h-full object-cover"
                    alt={username}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9Cs3FnKmxvQzkJNuY_KMFgDQJIQ6iGRe0rTmqzaCCCxNexZe1OCgxF5kfCqnTpbQD3Om9UO4c8xVu1eB0R2Vb4-tqGzhiKVGopUwu5zlNvnpcwEyYefOhnbj4XCWbzC8umzJMQCtDhVWMjGSOQO70z3eQGWLI63o7LuhkupRBTqjQP6ZAPvL5o0hbUD4qlFxb9-fhANySuXcas2cTldpEC8pwr6TiF1iJYVIUv7Cfv1uRIH55TPX7fSwH7YAetDi1HFjptzqTbCY"
                  />
                </div>
              </div>
              
              {/* Profile Details */}
              <div className="px-3 py-3 border-b border-gray-200 text-center">
                <h2 
                  onClick={() => navigate("/profile")}
                  className="font-semibold text-[16px] text-black/90 hover:underline cursor-pointer"
                >
                  {displayName}
                </h2>
                <p className="text-[12px] text-black/60 font-sans mt-1 line-clamp-2">
                  {userBio}
                </p>
              </div>

              {/* Stats Section */}
              <div className="py-3 text-[12px] text-black/60">
                <div className="hover:bg-gray-100 px-3 py-1.5 flex justify-between items-center cursor-pointer">
                  <span>Profile viewers</span>
                  <span className="font-semibold text-[#0a66c2]">142</span>
                </div>
                <div className="hover:bg-gray-100 px-3 py-1.5 flex justify-between items-center cursor-pointer">
                  <span>Post impressions</span>
                  <span className="font-semibold text-[#0a66c2]">1,024</span>
                </div>
              </div>

              {/* My Items */}
              <div 
                className="hover:bg-gray-100 px-3 py-3 border-t border-gray-200 flex items-center gap-2 text-[12px] font-semibold text-black/60 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <span className="material-symbols-outlined text-[18px]">bookmark</span>
                My items
              </div>
            </div>

            {/* Desktop Quick Shortcuts */}
            <div className="hidden md:flex bg-white rounded-lg border border-gray-200 p-3 flex-col gap-2 shadow-sm text-[12px] text-black/60">
              <p className="font-semibold text-black/90 text-[11px] uppercase tracking-wider">Recent</p>
              <a href="#" className="flex items-center gap-1 hover:bg-gray-100 p-1.5 rounded transition-colors">
                <span className="text-gray-400">#</span> rustlang
              </a>
              <a href="#" className="flex items-center gap-1 hover:bg-gray-100 p-1.5 rounded transition-colors">
                <span className="text-gray-400">#</span> typescript
              </a>
              <a href="#" className="flex items-center gap-1 hover:bg-gray-100 p-1.5 rounded transition-colors">
                <span className="text-gray-400">#</span> nextjs
              </a>
              <hr className="border-gray-200 my-1" />
              <button 
                onClick={() => navigate("/profile")}
                className="text-[#0a66c2] hover:underline font-semibold text-left"
              >
                View Profile Details
              </button>
            </div>
          </aside>

          {/* CENTER FEED */}
          <main className="col-span-12 md:col-span-8 lg:col-span-6 flex flex-col gap-4">
            
            {/* Create Post Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt="user avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl8Tr-b7rkNigRE1UnhaBQhjKDIyNG8jIh7YIxFQcYysPdHSomYxYS80xW1bnFszVacYc5BbOVp6FQCx8jVDMVbGvmvhJyhVrGZlVgVZeJ1gewI6A8Y3BEToZ1qHyFMRVir_zGvICmD0Nu1Z9oOINvWQqadSdAJYPgEhkzbi_xKZi84jqmciul3wWa-8fKwl4fiU-YK5sFQf8kIwB4dImRxBkrqhWEMSwT32mHnzdqqz8O7ulzlhvAvR6hMM9h7wFiiGCl07dX7a8"
                  />
                </div>
                <form onSubmit={handleCreatePost} className="flex-grow">
                  <textarea
                    className="w-full bg-transparent border-0 text-sm text-black/90 placeholder-black/45 resize-none min-h-[60px] outline-none focus:ring-0 focus:outline-none p-1"
                    placeholder="What are you building today?"
                    rows="3"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                  />
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                    {/* Media attachments triggers */}
                    <div className="flex gap-1 text-black/60">
                      <button 
                        type="button" 
                        className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-[#0a66c2] font-semibold text-xs cursor-pointer"
                        title="Photo"
                      >
                        <span className="material-symbols-outlined text-[18px]">image</span>
                        <span className="hidden sm:inline">Photo</span>
                      </button>
                      <button 
                        type="button" 
                        className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-[#5f9b41] font-semibold text-xs cursor-pointer"
                        title="Video"
                      >
                        <span className="material-symbols-outlined text-[18px]">video_library</span>
                        <span className="hidden sm:inline">Video</span>
                      </button>
                      <button 
                        type="button" 
                        className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-[#c37d16] font-semibold text-xs cursor-pointer"
                        title="Event"
                      >
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span className="hidden sm:inline">Event</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!newPostText.trim()}
                      className="bg-[#0a66c2] hover:bg-[#004182] text-white px-5 py-1.5 rounded-full font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sort Toolbar */}
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-black/90">Feed sorting</p>
                  <p className="text-xs text-black/55">Choose how posts are ordered in your feed.</p>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="feed-sort" className="text-xs font-medium text-black/65">
                    Sort by
                  </label>
                  <select
                    id="feed-sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort feed posts"
                    className="min-w-[150px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black/90 font-medium outline-none cursor-pointer focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/15"
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="likes">Most Liked</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Post Feed */}
            <div className="flex flex-col gap-4">
              {posts.map((post, index) => (
                <article 
                  key={post.id} 
                  ref={index === posts.length - 1 ? lastPostRef : null} 
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Post Header */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 cursor-pointer">
                      <img className="w-full h-full object-cover" alt={post.author} src={post.avatar} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-sm text-black/95 hover:text-[#0a66c2] hover:underline cursor-pointer">
                            {post.author}
                          </h3>
                          <p className="text-xs text-black/60 flex items-center gap-1.5">
                            <span>{post.handle}</span>
                            <span>•</span>
                            <span>{formatTime(post.time)}</span>
                            <span>•</span>
                            <span className="material-symbols-outlined text-[14px]">public</span>
                          </p>
                        </div>
                        <button className="text-black/60 hover:text-black/90 rounded-full p-1 hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm text-black/90 mb-3 whitespace-pre-line leading-relaxed">
                    {post.text}
                  </p>

                  {/* Code snippet rendering (Premium Gist-style) */}
                  {post.code && (
                    <div className="bg-[#f8f9fa] rounded-lg overflow-hidden mb-3 border border-gray-200">
                      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs text-black/60">
                        <span className="font-semibold">{post.code.filename}</span>
                        <button 
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(post.code.content);
                          }}
                          className="flex items-center gap-1 text-black/60 hover:text-[#0a66c2] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                          <span>Copy</span>
                        </button>
                      </div>
                      <pre className="p-4 font-mono text-xs text-[#2b2b2b] overflow-x-auto bg-[#fafafa]">
                        <code>{post.code.content}</code>
                      </pre>
                    </div>
                  )}

                  {/* Image attachment rendering */}
                  {post.image && (
                    <div className="rounded-lg overflow-hidden mb-3 border border-gray-200 relative group cursor-pointer">
                      <img className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-102" alt="Post preview" src={post.image} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <h4 className="font-bold text-sm text-white">Nebula Dash v0.1.0</h4>
                            <p className="text-xs text-white/70">github.com/marcus-t/nebula</p>
                          </div>
                          <button className="bg-white/20 backdrop-blur-md border border-white/30 p-1.5 rounded-full text-white cursor-pointer hover:bg-white/30 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Likes/Comments stats count row */}
                  <div className="flex justify-between items-center pb-2 text-[12px] text-black/60 border-b border-gray-100 mb-2">
                    <div className="flex items-center gap-1">
                      {/* LinkedIn overlap reactions */}
                      <span className="inline-flex">
                        <span className="w-4 h-4 bg-[#0a66c2] text-white rounded-full flex items-center justify-center text-[8px] z-10 border border-white">
                          👍
                        </span>
                        {post.likes > 2 && (
                          <span className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] -ml-1.5 border border-white z-0">
                            ❤️
                          </span>
                        )}
                      </span>
                      <span className="ml-1 hover:text-[#0a66c2] hover:underline cursor-pointer">
                        {post.likes} reactions
                      </span>
                    </div>
                    <button 
                      onClick={() => handleCommentPost(post.id)}
                      className="hover:text-[#0a66c2] hover:underline cursor-pointer"
                    >
                      {post.comments} comments
                    </button>
                  </div>

                  {/* Interaction Buttons Bar */}
                  <div className="flex justify-between items-center text-black/60 font-semibold text-sm">
                    <button
                      type="button"
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center justify-center gap-2 hover:bg-gray-100 py-2 rounded flex-1 cursor-pointer transition-colors ${post.isLiked ? "text-[#0a66c2]" : ""}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {post.isLiked ? "thumb_up" : "thumb_up"}
                      </span>
                      <span>Like</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCommentPost(post.id)}
                      className="flex items-center justify-center gap-2 hover:bg-gray-100 py-2 rounded flex-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">comment</span>
                      <span>Comment</span>
                    </button>
                    <button 
                      type="button" 
                      className="flex items-center justify-center gap-2 hover:bg-gray-100 py-2 rounded flex-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">share</span>
                      <span>Repost</span>
                    </button>
                    <button 
                      type="button" 
                      className="flex items-center justify-center gap-2 hover:bg-gray-100 py-2 rounded flex-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      <span>Send</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {activeCommentPostId === post.id ? (
                    <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col gap-3">
                      {/* Comment Input */}
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            alt="avatar"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl8Tr-b7rkNigRE1UnhaBQhjKDIyNG8jIh7YIxFQcYysPdHSomYxYS80xW1bnFszVacYc5BbOVp6FQCx8jVDMVbGvmvhJyhVrGZlVgVZeJ1gewI6A8Y3BEToZ1qHyFMRVir_zGvICmD0Nu1Z9oOINvWQqadSdAJYPgEhkzbi_xKZi84jqmciul3wWa-8fKwl4fiU-YK5sFQf8kIwB4dImRxBkrqhWEMSwT32mHnzdqqz8O7ulzlhvAvR6hMM9h7wFiiGCl07dX7a8"
                          />
                        </div>
                        <div className="flex-grow flex flex-col gap-2">
                          <textarea
                            className="w-full min-h-[50px] rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 text-xs text-black outline-none focus:border-[#0a66c2] focus:bg-white resize-none"
                            placeholder="Add a comment..."
                            value={commentDrafts[post.id] || ""}
                            onChange={(e) => handleCommentDraftChange(post.id, e.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveCommentPostId(null)}
                              className="px-3 py-1 text-xs font-semibold text-black/60 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSubmitComment(post.id)}
                              className="px-3 py-1 bg-[#0a66c2] text-white text-xs font-bold rounded-full hover:bg-[#004182] transition-colors"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Comments List */}
                      {post.commentList?.length ? (
                        <div className="space-y-3 mt-1">
                          {post.commentList.map((comment) => (
                            <div key={comment.id} className="flex gap-2 items-start">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <span className="material-symbols-outlined text-[32px] text-gray-400">account_circle</span>
                              </div>
                              <div className="bg-gray-100 rounded-lg p-3 text-xs flex-grow shadow-sm">
                                <p className="font-semibold text-black/90 mb-1">@{comment.user}</p>
                                <p className="text-black/80">{comment.body}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-black/60 italic text-center py-2">No comments yet. Be the first to comment.</p>
                      )}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            
            {/* News Widget */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                <h2 className="font-bold text-sm text-black/90">DevHub News</h2>
                <span className="material-symbols-outlined text-gray-500 text-sm">info</span>
              </div>
              <ul className="flex flex-col gap-3 text-xs">
                <li className="hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors">
                  <h4 className="font-semibold text-black/90 flex items-start gap-1">
                    <span className="text-blue-500 font-bold text-sm leading-none">•</span>
                    Rust 2026 Roadmap Released
                  </h4>
                  <p className="text-black/45 pl-3">2d ago • 14,043 readers</p>
                </li>
                <li className="hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors">
                  <h4 className="font-semibold text-black/90 flex items-start gap-1">
                    <span className="text-blue-500 font-bold text-sm leading-none">•</span>
                    Vite vs Turbopack in DevHub
                  </h4>
                  <p className="text-black/45 pl-3">3d ago • 8,432 readers</p>
                </li>
                <li className="hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors">
                  <h4 className="font-semibold text-black/90 flex items-start gap-1">
                    <span className="text-blue-500 font-bold text-sm leading-none">•</span>
                    Wasm-based Microfrontends
                  </h4>
                  <p className="text-black/45 pl-3">5d ago • 4,128 readers</p>
                </li>
              </ul>
            </div>

            {/* Who to Follow Widget */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h2 className="font-bold text-sm text-black/90 mb-3">Add to your feed</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img className="w-full h-full object-cover" alt="Devon Webb" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx0fwapccQIMUyEXTzjFNb5huPqk_EryuGlvfU1sMpviOyEKqLaZ3zmfUBue5-IRUDnF6kVYeVYMU_Ppmr8gG6XpFg_3fh94Eb_6_5DoSivukexLCaZWEc2aE95U7xIUUBINfHf7xahb9MAIOLCET-cYqmtecpd_SAUFEGij-v-Qmk7ucft_QOZUdVTq6afR0R0wAK5ZoleU9IbFVnUGSHSA_c6djgsftF2FDDsGBf7YMAiolV7-nNnP1egNHRNmItYHtqpnnCTZ8" />
                  </div>
                  <div className="flex-grow overflow-hidden text-xs">
                    <p className="font-bold text-black/90 truncate">Devon Webb</p>
                    <p className="text-black/45 truncate">@dwebb_core</p>
                    <button className="mt-1 border border-black/60 hover:bg-black/5 hover:border-black text-black/75 px-3 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-xs">add</span> Follow
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img className="w-full h-full object-cover" alt="Jamie Park" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoTLqFWwoBXvcTvDc035igytJe_gj41BxhyW421kW4NpOoGaPN1dOUA7frxirkQeyJfUlU8nDSiMDBf2XC1SvRG5Va667HVSZKkHB8wqyDImHegGTMy3pbTbFjsTfVe9MSICUCC9GVaL-4oHsOADOhdIcnuNomVrfza_1MnEgMapTw3Qv44FAaobQFYKHTfskoKoAVF1u1oY5W61hBzc_uAkU9qwEthcnpT3uQi21Urt59QQjx83mMjYKvbPYfDLED-H5ec7q1QWE" />
                  </div>
                  <div className="flex-grow overflow-hidden text-xs">
                    <p className="font-bold text-black/90 truncate">Jamie Park</p>
                    <p className="text-black/45 truncate">@jamie_scripts</p>
                    <button className="mt-1 border border-black/60 hover:bg-black/5 hover:border-black text-black/75 px-3 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-xs">add</span> Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Projects Widget */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm text-xs">
              <h2 className="font-bold text-sm text-black/90 mb-3">Top Projects</h2>
              <div className="flex flex-col gap-3">
                <div className="hover:bg-gray-50 p-2 rounded border border-gray-100 cursor-pointer transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-[#0a66c2] hover:underline">PrismORM</h3>
                    <span className="flex items-center text-gray-500 font-sans text-[10px]">
                      ⭐ 4.2k
                    </span>
                  </div>
                  <p className="text-black/60 line-clamp-2">High-performance Rust ORM with migrations.</p>
                </div>
                
                <div className="hover:bg-gray-50 p-2 rounded border border-gray-100 cursor-pointer transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-[#0a66c2] hover:underline">FluxUI</h3>
                    <span className="flex items-center text-gray-500 font-sans text-[10px]">
                      ⭐ 1.8k
                    </span>
                  </div>
                  <p className="text-black/60 line-clamp-2">Motion-driven Tailwind components.</p>
                </div>
              </div>
            </div>

            {/* LinkedIn-style Footer */}
            <footer className="text-center text-[11px] text-black/45 mt-2 flex flex-col gap-2">
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 px-2">
                <a className="hover:text-[#0a66c2] hover:underline" href="#">About</a>
                <a className="hover:text-[#0a66c2] hover:underline" href="#">Accessibility</a>
                <a className="hover:text-[#0a66c2] hover:underline" href="#">Help Center</a>
                <a className="hover:text-[#0a66c2] hover:underline" href="#">Privacy &amp; Terms</a>
                <a className="hover:text-[#0a66c2] hover:underline" href="#">API</a>
                <a className="hover:text-[#0a66c2] hover:underline" href="#">GitHub</a>
              </div>
              <p className="mt-1 font-semibold flex items-center justify-center gap-1">
                <span className="text-[#0a66c2] font-bold text-xs">DevHub</span> Corporation © 2026
              </p>
            </footer>
          </aside>

        </div>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50 shadow-lg">
        <a className="flex flex-col items-center gap-0.5 text-[#0a66c2]" href="#">
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[10px] font-semibold">Home</span>
        </a>
        <a className="flex flex-col items-center gap-0.5 text-black/60" href="#" onClick={(e) => { e.preventDefault(); navigate("/stack"); }}>
          <span className="material-symbols-outlined text-[22px]">explore</span>
          <span className="text-[10px]">Explore</span>
        </a>
        <a className="flex flex-col items-center gap-0.5 text-black/60 relative" href="#">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <div className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
          <span className="text-[10px]">Alerts</span>
        </a>
        <a className="flex flex-col items-center gap-0.5 text-black/60" href="#" onClick={(e) => { e.preventDefault(); navigate("/profile"); }}>
          <span className="material-symbols-outlined text-[22px]">account_circle</span>
          <span className="text-[10px]">Me</span>
        </a>
      </nav>
    </div>
  );
}
