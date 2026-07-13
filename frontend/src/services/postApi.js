const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api/v1").replace(/\/$/, "");

const parseResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data;
};

export const getPosts = async () => {
  const response = await fetch(`${API_BASE}/posts`);
  return parseResponse(response);
};

export const createPost = async (payload) => {
  const response = await fetch(`${API_BASE}/posts/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};
