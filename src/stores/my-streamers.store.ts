// stores/my-streamers.store.ts - 수정된 버전
import { StreamerSimpleResponse } from "@/types/interfaces/streamer.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MyStreamersState {
  // followCount가 없는 기본 정보만 저장
  streamers: StreamerSimpleResponse[];
  // streamers: StreamerBasicInfo[];
  // fetchTargetUuids: string[];
  scheduleFetchUuids: string[]; // 일정 조회용 uuids

  add: (streamer: StreamerSimpleResponse) => boolean;
  remove: (uuid: string) => boolean;

  addFetchTarget: (uuid: string) => boolean;
  removeFetchTarget: (uuid: string) => boolean;

  // 유틸리티 메서드
  isSubscribed: (uuid: string) => boolean;
  getBasicInfo: (uuid: string) => StreamerSimpleResponse | undefined;

  getUuidsToDisplay: () => string[];
  updateStreamers: (streamers: StreamerSimpleResponse[]) => void;
}

export const useMyStreamersStore = create<MyStreamersState>()(
  persist(
    (set, get) => ({
      streamers: [],
      scheduleFetchUuids: [],

      add: (streamer) => {
        const state = get();
        const alreadyExists = state.streamers.some(
          (s) => s.uuid === streamer.uuid,
        );

        if (alreadyExists) {
          return false;
        }

        // followCount를 포함한 전체 정보 저장
        const streamerInfo: StreamerSimpleResponse = {
          uuid: streamer.uuid,
          name: streamer.name,
          profileImageUrl: streamer.profileImageUrl,
          platforms: streamer.platforms,
          followCount: streamer.followCount,
          isFollowed: streamer.isFollowed,
        };

        set({
          streamers: [streamerInfo, ...state.streamers],
          scheduleFetchUuids: [streamer.uuid, ...state.scheduleFetchUuids],
        });

        return true;
      },

      remove: (uuid: string) => {
        const state = get();
        const streamerExists = state.streamers.some((s) => s.uuid === uuid);

        if (!streamerExists) {
          return false;
        }

        set({
          streamers: state.streamers.filter((s) => s.uuid !== uuid),
          scheduleFetchUuids: state.scheduleFetchUuids.filter(
            (id) => id !== uuid,
          ),
        });

        return true;
      },

      addFetchTarget: (uuid) => {
        const state = get();

        // 이미 scheduleFetchUuids에 포함되어 있으면 false 반환
        if (state.scheduleFetchUuids.includes(uuid)) return false;

        // 해당 streamer가 streamers에 있는지 확인
        const targetStreamer = state.streamers.find((s) => s.uuid === uuid);
        if (!targetStreamer) return false;

        // scheduleFetchUuids에 uuid 추가 (맨 앞에)
        const newScheduleFetchUuids = [uuid, ...state.scheduleFetchUuids];

        // streamers에서 해당 streamer를 제거한 후 맨 앞에 추가
        const otherStreamers = state.streamers.filter((s) => s.uuid !== uuid);
        const newStreamers = [targetStreamer, ...otherStreamers];

        set({
          scheduleFetchUuids: newScheduleFetchUuids,
          streamers: newStreamers,
        });

        return true;
      },

      removeFetchTarget: (uuid) => {
        const state = get();

        // scheduleFetchUuids에 포함되어 있지 않으면 false 반환
        if (!state.scheduleFetchUuids.includes(uuid)) return false;

        // scheduleFetchUuids에서 해당 uuid 제거
        const newScheduleFetchUuids = state.scheduleFetchUuids.filter(
          (id) => id !== uuid,
        );

        // 해당 streamer 찾기
        const targetStreamer = state.streamers.find((s) => s.uuid === uuid);
        if (!targetStreamer) {
          // streamer가 없으면 scheduleFetchUuids만 업데이트
          set({ scheduleFetchUuids: newScheduleFetchUuids });
          return true;
        }

        // scheduleFetchUuids에 포함된 streamers와 포함되지 않은 streamers 분리
        const fetchTargetStreamers = state.streamers.filter(
          (s) => s.uuid !== uuid && newScheduleFetchUuids.includes(s.uuid),
        );
        const nonFetchTargetStreamers = state.streamers.filter(
          (s) => s.uuid !== uuid && !newScheduleFetchUuids.includes(s.uuid),
        );

        // 새로운 순서: fetchTarget streamers + 제거된 streamer + nonFetchTarget streamers
        const newStreamers = [
          ...fetchTargetStreamers,
          targetStreamer,
          ...nonFetchTargetStreamers,
        ];

        set({
          scheduleFetchUuids: newScheduleFetchUuids,
          streamers: newStreamers,
        });

        return true;
      },

      isSubscribed: (uuid) => {
        const state = get();
        return state.streamers.some((s) => s.uuid === uuid);
      },

      getBasicInfo: (uuid) => {
        const state = get();
        return state.streamers.find((s) => s.uuid === uuid);
      },

      getUuidsToDisplay: () => {
        const state = get();
        return state.streamers.map((s) => s.uuid);
      },

      // 여러 스트리머 정보를 한번에 갱신
      updateStreamers: (newStreamers) => {
        const state = get();

        // 기존 스트리머들을 Map으로 변환하여 빠른 조회
        const existingStreamersMap = new Map(
          state.streamers.map((s) => [s.uuid, s]),
        );

        // 새로운 정보로 갱신된 스트리머 배열 생성
        const updatedStreamers = newStreamers
          .filter((newStreamer) => existingStreamersMap.has(newStreamer.uuid))
          .map(
            (newStreamer) =>
              ({
                uuid: newStreamer.uuid,
                name: newStreamer.name,
                profileImageUrl: newStreamer.profileImageUrl,
                platforms: newStreamer.platforms,
                followCount: newStreamer.followCount,
                isFollowed: newStreamer.isFollowed,
              }) as StreamerSimpleResponse,
          );

        // 기존 순서를 유지하면서 정보만 갱신
        const finalStreamers = state.streamers.map((existing) => {
          const updated = updatedStreamers.find(
            (u) => u.uuid === existing.uuid,
          );
          return updated || existing;
        });

        set({ streamers: finalStreamers });
      },
    }),
    {
      name: "instoo-my_streamers",
    },
  ),
);
