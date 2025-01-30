import {AuthResponse} from "@/core/types/authentication";
import {APIError, fetchAPI, index} from "@/shared/api/genericAPI";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.3.50:8080/v1/api";

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
        return index.get<AuthResponse>("/users/me");
    },
};