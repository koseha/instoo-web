// stores/my-streamers.store.ts
import { StreamerService } from "@/services/streamer.service";
import { StreamerSimpleResponse } from "@/types/interfaces/streamer.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MyStreamersState {
  streamers: StreamerSimpleResponse[];

  // Sidebar - 간편 검색에서 사용
  add: (streamer: StreamerSimpleResponse) => boolean;
  // MyStreamers 목록에서 제거
  remove: (uuid: string) => boolean;
  // 일정 목록 조회 대상 찾기
  getScheduleFetchUuids: () => string[];
  // 전체 uuid
  getUuidsToDisplay: () => string[];
  // MyStreamers Card 상태 on/off 토글
  toggleIsActive: (uuid: string) => boolean;
  // MyStreamers 초기화
  syncOnLogin: (streamers: StreamerSimpleResponse[]) => void;
  // 데이터 업데이트
  updateStreamers: (streamers: StreamerSimpleResponse[]) => void;
}

// 변경된 스트리머 상태를 추적하는 Map
const pendingUpdates = new Map<string, boolean>();
let debounceTimer: NodeJS.Timeout | null = null;

// 서버에 배치로 isActive 상태 저장하는 함수
const saveBatchActiveState = async () => {
  if (pendingUpdates.size === 0) return;

  const updates = Array.from(pendingUpdates.entries()).map(
    ([uuid, isActive]) => ({
      streamerUuid: uuid,
      isActive,
    }),
  );

  try {
    await StreamerService.saveBatchActiveFollowing({ updates });

    // 성공 시 대기 중인 업데이트 클리어
    pendingUpdates.clear();
  } catch (error) {
    console.error("Failed to save batch active states:", error);
    // 실패 시에도 클리어 (무한 재시도 방지)
    pendingUpdates.clear();
  }
};

export const useMyStreamersStore = create<MyStreamersState>()(
  persist(
    (set, get) => ({
      streamers: [],

      add: (streamer) => {
        const { streamers } = get();

        if (streamers.some((s) => s.uuid === streamer.uuid)) return false;

        set({
          streamers: [{ ...streamer, isActive: true }, ...streamers],
        });

        return true;
      },

      remove: (uuid) => {
        const { streamers } = get();

        const streamerExists = streamers.some((s) => s.uuid === uuid);
        if (!streamerExists) return false;

        set({
          streamers: streamers.filter((s) => s.uuid !== uuid),
        });

        return true;
      },

      getScheduleFetchUuids: () => {
        const { streamers } = get();

        return streamers.filter((s) => s.isActive).map((s) => s.uuid);
      },

      getUuidsToDisplay: () => {
        return get().streamers.map((s) => s.uuid);
      },

      toggleIsActive: (uuid) => {
        const { streamers } = get();

        const streamer = streamers.find((s) => s.uuid === uuid);
        if (!streamer) return false;

        const newIsActive = !streamer.isActive;

        const updatedStreamers = streamers.map((s) =>
          s.uuid === uuid ? { ...s, isActive: newIsActive } : s,
        );

        set({ streamers: updatedStreamers });

        // isFollowed가 true인 경우에만 배치 업데이트에 추가
        if (streamer.isFollowed) {
          pendingUpdates.set(uuid, newIsActive);

          // 기존 타이머가 있으면 취소
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          // 새로운 타이머 설정 (2초 후 배치 실행)
          debounceTimer = setTimeout(() => {
            saveBatchActiveState();
            debounceTimer = null;
          }, 2000);
        }

        return true;
      },

      syncOnLogin: (streamers) => {
        const { streamers: currentStreamers } = get();

        // 1. streamers 기준으로 merge (중복된 uuid만 업데이트)
        const merged = streamers.map((newStreamer) => {
          const existing = currentStreamers.find(
            (s) => s.uuid === newStreamer.uuid,
          );
          return existing
            ? { ...newStreamer, isActive: existing.isActive } // 상태 유지
            : { ...newStreamer }; // 새로 들어온 것
        });

        // 2. currentStreamers 중에서 streamers에 없는 것만 추가
        const onlyInCurrent = currentStreamers.filter(
          (s) => !streamers.find((ns) => ns.uuid === s.uuid),
        );

        const mergedStreamers = [...merged, ...onlyInCurrent];

        set({ streamers: mergedStreamers });
      },

      updateStreamers: (newStreamers) => {
        const { streamers: currentStreamers } = get();

        // 빈 배열이면 조기 반환
        if (newStreamers.length === 0) return;

        // 새로운 스트리머 데이터를 Map으로 변환 (O(1) 조회)
        const newStreamersMap = new Map(
          newStreamers.map((streamer) => [streamer.uuid, streamer]),
        );

        // 기존 스트리머들을 순회하며 업데이트 (O(n))
        const updatedStreamers = currentStreamers.map((currentStreamer) => {
          const newData = newStreamersMap.get(currentStreamer.uuid);

          // 새로운 데이터가 없으면 기존 데이터 유지
          if (!newData) return currentStreamer;

          // 새로운 데이터가 있으면 isActive만 보존하고 나머지 업데이트
          return {
            ...newData,
            isActive: currentStreamer.isActive,
          };
        });

        // isActive: true가 위로, false가 아래로 정렬
        const sortedStreamers = updatedStreamers.sort((a, b) => {
          if (a.isActive === b.isActive) return 0;
          return a.isActive ? -1 : 1;
        });

        set({ streamers: sortedStreamers });
      },
    }),
    {
      name: "instoo-my_streamers",
    },
  ),
);
