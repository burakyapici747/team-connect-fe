import { AuthResponse } from "@/types/authentication";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.3.50:8080/v1/api";

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new APIError(response.status, await response.text());
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) =>
    fetchAPI<{ data: T }>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, data?: any) =>
    fetchAPI<{ data: T }>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: any) =>
    fetchAPI<{ data: T }>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data: any) =>
    fetchAPI<{ data: T }>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    fetchAPI<{ data: T }>(endpoint, { method: "DELETE" }),
};

export const authAPI = {
  login: async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (!response.ok) {
      throw new APIError(response.status, await response.text());
    }
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    return fetchAPI("/auth/logout", {
      method: "POST",
    });
  },

  me: async (): Promise<{ data: AuthResponse }> => {
    return api.get<AuthResponse>("/users/me");
  },
};
