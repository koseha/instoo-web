// stores/streamer-follow.store.ts
import { create } from "zustand";

interface FollowState {
  followedMap: Record<string, boolean>;
  followCountMap: Record<string, number>;

  setFollow: (uuid: string, followed: boolean, count: number) => void;
  resetFollow: (uuid: string) => void;
}

export const useFollowStore = create<FollowState>((set) => ({
  followedMap: {},
  followCountMap: {},

  setFollow: (uuid, followed, count) =>
    set((state) => ({
      followedMap: { ...state.followedMap, [uuid]: followed },
      followCountMap: { ...state.followCountMap, [uuid]: count },
    })),

  resetFollow: (uuid) =>
    set((state) => {
      const { [uuid]: _, ...followedMap } = state.followedMap;
      const { [uuid]: __, ...followCountMap } = state.followCountMap;
      return { followedMap, followCountMap };
    }),
}));
