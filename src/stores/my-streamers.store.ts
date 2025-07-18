import { StreamerSimpleResponse } from "@/services/streamer.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MyStreamersState {
  streamers: StreamerSimpleResponse[];

  add: (streamer: StreamerSimpleResponse) => boolean;
  remove: (uuid: string) => boolean;
}

export const useMyStreamersStore = create<MyStreamersState>()(
  persist(
    (set, get) => ({
      streamers: [],

      add: (streamer) => {
        const state = get();
        const alreadyExists = state.streamers.some(
          (s) => s.uuid === streamer.uuid,
        );

        if (alreadyExists) {
          return false; // 이미 존재하는 경우 false 반환
        }

        set({
          streamers: [streamer, ...state.streamers],
        });

        return true; // 성공적으로 추가된 경우 true 반환
      },

      remove: (uuid: string) => {
        const state = get();
        const streamerExists = state.streamers.some((s) => s.uuid === uuid);

        if (!streamerExists) {
          return false; // 존재하지 않는 경우 false 반환
        }

        set({
          streamers: state.streamers.filter((s) => s.uuid !== uuid),
        });

        return true; // 성공적으로 제거된 경우 true 반환
      },
    }),
    {
      name: "instoo-my_streamers",
    },
  ),
);
