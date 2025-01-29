import { create } from "zustand"
import { UIStore } from "@/core/types/ui"

export const useUIStore = create<UIStore>((set) => ({
  theme: "dark",
  sidebarOpen: true,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
