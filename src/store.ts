import { create } from 'zustand';

type View = 'atlas' | 'qingqiu';
export type AtlasMode = 'map' | 'routes' | 'bestiary' | 'waterways' | 'resources' | 'graph' | 'mythology';
export type ResourceView = 'resources' | 'rituals';
interface AppState {
  view: View;
  infoOpen: boolean;
  atlasMode: AtlasMode;
  resourceView: ResourceView;
  selectedChapterId: string;
  selectedPlaceId: string | null;
  graphTargetId: string;
  routeId: string;
  routeNodeId: string;
  bestiaryQuery: string;
  bestiaryKind: string;
  bestiaryId: string;
  waterQuery: string;
  waterChapter: string;
  waterId: string;
  resourceQuery: string;
  resourceCategory: string;
  resourceId: string;
  ritualChapter: string;
  ritualId: string;
  graphQuery: string;
  graphKind: string;
  graphSelectedId: string;
  mythologyMode: 'events' | 'lineage';
  mythologyQuery: string;
  mythologyChapter: string;
  enterQingqiu: () => void;
  returnToAtlas: () => void;
  toggleInfo: () => void;
  setAtlasMode: (mode: AtlasMode) => void;
  setResourceView: (view: ResourceView) => void;
  setSelectedChapterId: (id: string) => void;
  setSelectedPlaceId: (id: string | null) => void;
  setGraphTargetId: (id: string) => void;
  setRouteId: (id: string) => void;
  setRouteNodeId: (id: string) => void;
  setBestiaryQuery: (value: string) => void;
  setBestiaryKind: (value: string) => void;
  setBestiaryId: (id: string) => void;
  setWaterQuery: (value: string) => void;
  setWaterChapter: (value: string) => void;
  setWaterId: (id: string) => void;
  setResourceQuery: (value: string) => void;
  setResourceCategory: (value: string) => void;
  setResourceId: (id: string) => void;
  setRitualChapter: (value: string) => void;
  setRitualId: (id: string) => void;
  setGraphQuery: (value: string) => void;
  setGraphKind: (value: string) => void;
  setGraphSelectedId: (id: string) => void;
  setMythologyMode: (mode: 'events' | 'lineage') => void;
  setMythologyQuery: (value: string) => void;
  setMythologyChapter: (value: string) => void;
}
export const useAppStore = create<AppState>((set) => ({
  view: 'atlas',
  infoOpen: false,
  atlasMode: 'map',
  resourceView: 'resources',
  selectedChapterId: 'nanshan-jing',
  selectedPlaceId: null,
  graphTargetId: 'south-qingqiu',
  routeId: 'south-que',
  routeNodeId: 'south-qingqiu',
  bestiaryQuery: '',
  bestiaryKind: '全部',
  bestiaryId: 'jiuweihu',
  waterQuery: '',
  waterChapter: '全部',
  waterId: 'jiang-shui',
  resourceQuery: '',
  resourceCategory: '全部',
  resourceId: 'kunlun-shatang',
  ritualChapter: '全部',
  ritualId: 'ritual-south-1',
  graphQuery: '',
  graphKind: '全部',
  graphSelectedId: 'south-qingqiu',
  mythologyMode: 'events',
  mythologyQuery: '',
  mythologyChapter: '',
  enterQingqiu: () => set({ view: 'qingqiu', infoOpen: false }),
  returnToAtlas: () => set({ view: 'atlas', infoOpen: false }),
  toggleInfo: () => set((s) => ({ infoOpen: !s.infoOpen })),
  setAtlasMode: (atlasMode) => set({ atlasMode }),
  setResourceView: (resourceView) => set({ resourceView }),
  setSelectedChapterId: (selectedChapterId) => set({ selectedChapterId }),
  setSelectedPlaceId: (selectedPlaceId) => set({ selectedPlaceId }),
  setGraphTargetId: (graphTargetId) => set({ graphTargetId }),
  setRouteId: (routeId) => set({ routeId }),
  setRouteNodeId: (routeNodeId) => set({ routeNodeId }),
  setBestiaryQuery: (bestiaryQuery) => set({ bestiaryQuery }),
  setBestiaryKind: (bestiaryKind) => set({ bestiaryKind }),
  setBestiaryId: (bestiaryId) => set({ bestiaryId }),
  setWaterQuery: (waterQuery) => set({ waterQuery }),
  setWaterChapter: (waterChapter) => set({ waterChapter }),
  setWaterId: (waterId) => set({ waterId }),
  setResourceQuery: (resourceQuery) => set({ resourceQuery }),
  setResourceCategory: (resourceCategory) => set({ resourceCategory }),
  setResourceId: (resourceId) => set({ resourceId }),
  setRitualChapter: (ritualChapter) => set({ ritualChapter }),
  setRitualId: (ritualId) => set({ ritualId }),
  setGraphQuery: (graphQuery) => set({ graphQuery }),
  setGraphKind: (graphKind) => set({ graphKind }),
  setGraphSelectedId: (graphSelectedId) => set({ graphSelectedId }),
  setMythologyMode: (mythologyMode) => set({ mythologyMode }),
  setMythologyQuery: (mythologyQuery) => set({ mythologyQuery }),
  setMythologyChapter: (mythologyChapter) => set({ mythologyChapter })
}));
