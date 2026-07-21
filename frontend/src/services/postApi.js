import { getAuthSession } from "./authApi";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api/v1").replace(/\/$/, "");

const parseResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data;
};

// export const getPosts = async () => {
//   const response = await fetch(`${API_BASE}/posts`);
//   return parseResponse(response);
// };

// Pagination
export const getPosts = async (page = 1, limit = 5) => {
  const response = await fetch(
    `${API_BASE}/posts?page=${page}&limit=${limit}`
  );

  return parseResponse(response);
};



export const createPost = async (payload) => {
  const session = getAuthSession();
  const token = session?.accessToken;
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/posts/create`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};

export const likePost = async (payload) => {
  const session = getAuthSession();
  const token = session?.accessToken;
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/likes`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};

export const unlikePost = async (payload) => {
  const session = getAuthSession();
  const token = session?.accessToken;
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/likes/unlike`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};

export const createComment = async (payload) => {
  const session = getAuthSession();
  const token = session?.accessToken;
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/comments/create`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};
