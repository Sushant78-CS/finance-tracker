import api from "./api";
import type { User } from "../types/auth";

export const getProfile = async (): Promise<User> => {
  const response = await api.get<{ user: User }>("/users/profile");

  return response.data.user;
};

export const updateProfile = async (
  username: string,
  email: string,
): Promise<User> => {
  const response = await api.put<{ message: string; user: User }>(
    "/users/profile",
    {
      username,
      email,
    },
  );

  // Keep localStorage synchronized
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data.user;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<string> => {
  const response = await api.put<{ message: string }>(
    "/users/change-password",
    {
      currentPassword,
      newPassword,
    },
  );

  return response.data.message;
};
