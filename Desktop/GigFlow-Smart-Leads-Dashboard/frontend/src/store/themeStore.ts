import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (value: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const next = !get().isDark;
        document.documentElement.classList.toggle('dark', next);
        set({ isDark: next });
      },
      setDark: (value) => {
        document.documentElement.classList.toggle('dark', value);
        set({ isDark: value });
      },
    }),
    { name: 'gigflow-theme' }
  )
);

export const initTheme = (): void => {
  const isDark = useThemeStore.getState().isDark;
  document.documentElement.classList.toggle('dark', isDark);
};
