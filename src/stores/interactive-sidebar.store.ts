"use client";

import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export const useInteractiveSidebar = create<SidebarState>((set) => ({
  isOpen: true,
  openSidebar: () => set({ isOpen: true }),
  closeSidebar: () => set({ isOpen: false }),
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));
