import { create } from 'zustand';

type View = 'atlas' | 'qingqiu';
interface AppState {
  view: View;
  infoOpen: boolean;
  enterQingqiu: () => void;
  returnToAtlas: () => void;
  toggleInfo: () => void;
}
export const useAppStore = create<AppState>((set) => ({
  view: 'atlas',
  infoOpen: false,
  enterQingqiu: () => set({ view: 'qingqiu', infoOpen: false }),
  returnToAtlas: () => set({ view: 'atlas', infoOpen: false }),
  toggleInfo: () => set((s) => ({ infoOpen: !s.infoOpen }))
}));
