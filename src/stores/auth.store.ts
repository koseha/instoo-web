import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  uuid: string;
  nickname: string;
  profileImageUrl: string;
  role: string;
  isActive: string;
  createdAt: Date;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("refreshToken");
      },

      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: "instoo-auth",
    },
  ),
);
