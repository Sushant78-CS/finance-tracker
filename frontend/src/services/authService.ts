import api from "./api";
import type { AuthResponse, User } from "../types/auth";

export const signup = async (
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signup", {
    username,
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);

  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);

  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem("token"));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
};
