import { create } from "zustand";

interface AppStore {
    editMode: boolean,
    updateEditMode: (editMode: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
    editMode: false,
    updateEditMode: (editMode) => set({ editMode })
}));