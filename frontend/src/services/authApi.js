const API_BASE = "/api/v1";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

export const registerUser = async (payload) => {
  const response = await fetch(`http://localhost:5000/api/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};

export const loginUser = async (payload) => {
  const response = await fetch(`http://localhost:5000/api/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};

export const saveAuthSession = (authData) => {
  localStorage.setItem("devhub_auth", JSON.stringify(authData));
};
