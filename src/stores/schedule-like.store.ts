// stores/scheduleLike.store.ts
import { create } from "zustand";

interface LikeState {
  likedMap: Record<string, boolean>;
  likeCountMap: Record<string, number>;

  setLike: (uuid: string, liked: boolean, count: number) => void;
  resetLike: (uuid: string) => void;
}

export const useLikeStore = create<LikeState>((set) => ({
  likedMap: {},
  likeCountMap: {},

  setLike: (uuid, liked, count) =>
    set((state) => ({
      likedMap: { ...state.likedMap, [uuid]: liked },
      likeCountMap: { ...state.likeCountMap, [uuid]: count },
    })),

  resetLike: (uuid) =>
    set((state) => {
      const { [uuid]: _, ...likedMap } = state.likedMap;
      const { [uuid]: __, ...likeCountMap } = state.likeCountMap;
      return { likedMap, likeCountMap };
    }),
}));
