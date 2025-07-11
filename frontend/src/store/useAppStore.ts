import { create } from "zustand";
import { createRandomUuid } from "../utils/utils";

interface AppStore {
    clientId: string,
    editMode: boolean,
    updateEditMode: (editMode: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
    clientId: createRandomUuid(),
    editMode: false,
    updateEditMode: (editMode) => set({ editMode })
}));