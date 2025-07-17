import { StreamerSimpleResponse } from "@/services/streamer.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MyStreamersState {
  streamers: StreamerSimpleResponse[];

  add: (streamer: StreamerSimpleResponse) => void;
  remove: (uuid: string) => void;
}

export const useMyStreamersStore = create<MyStreamersState>()(
  persist(
    (set) => ({
      streamers: [],

      add: (streamer) =>
        set((state) => {
          const alreadyExists = state.streamers.some(
            (s) => s.uuid === streamer.uuid,
          );
          if (alreadyExists) return state; // 변경 없이 현재 상태 반환

          return {
            streamers: [streamer, ...state.streamers],
          };
        }),

      remove: (uuid: string) =>
        set((state) => ({
          streamers: state.streamers.filter((s) => s.uuid !== uuid),
        })),
    }),
    {
      name: "instoo-my_streamers",
    },
  ),
);
