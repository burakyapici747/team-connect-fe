export interface UIStore {
    theme: "light" | "dark"
    sidebarOpen: boolean
    setTheme: (theme: "light" | "dark") => void
    toggleSidebar: () => void
}