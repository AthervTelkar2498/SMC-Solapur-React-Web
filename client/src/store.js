import { create } from 'zustand';

export const useStore = create((set) => ({
  lang: 'en',
  token: null,
  setLang: (lang) => set({ lang }),
  setToken: (token) => set({ token }),
}));
