import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../i18n";
import { createRandomUuid, detectBrowserLanguage } from "../utils/utils";

interface AppStore {
  clientId: string;
  editMode: boolean;
  lang: string | null;
  updateEditMode: (editMode: boolean) => void;
  updateLang: (lang: string) => void;
  initializeLang: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      clientId: createRandomUuid(),
      editMode: false,
      lang: null,
      updateEditMode: (editMode) => set({ editMode }),
      updateLang: (lang) => {
        i18n.changeLanguage(lang);
        set({ lang });
      },
      initializeLang: () => {
        const currentLang = get().lang;
        if (currentLang === null) {
          const detected = detectBrowserLanguage();
          i18n.changeLanguage(detected);
          set({ lang: detected });
        } else {
          i18n.changeLanguage(currentLang);
        }
      }
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        editMode: state.editMode,
        lang: state.lang
      })
    }
  )
);