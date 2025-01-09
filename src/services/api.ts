import { AuthResponse } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1/api"

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = "APIError"
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
  })

  if (!response.ok) {
    throw new APIError(response.status, await response.text())
  }

  // Return null for 204 No Content
  if (response.status === 204) {
    return null as T
  }

  return response.json()
}

export const authAPI = {
  login: async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })

    if (!response.ok) {
      throw new APIError(response.status, await response.text())
    }
  },

  register: async (data: {
    username: string
    email: string
    password: string
  }): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  logout: async (): Promise<void> => {
    return fetchAPI("/auth/logout", {
      method: "POST",
    })
  },

  me: async (): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>("/users/me", {
      method: "GET",
    })
  },
}
