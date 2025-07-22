import { StreamerService } from "@/services/streamer.service";
import { useFollowStore } from "@/stores/streamer-follow.store";
import { useCallback } from "react";

export const useStreamerFollow = () => {
  const { followedMap, followCountMap, setFollow, resetFollow } =
    useFollowStore();

  // 원본 상태를 받아서 토글 처리
  const toggleFollow = useCallback(
    (
      streamerUuid: string,
      originalFollowed: boolean,
      originalCount: number,
    ) => {
      // 현재 store 상태 확인
      const currentStoreFollowed = followedMap[streamerUuid];
      const currentStoreCount = followCountMap[streamerUuid];

      // 현재 실제 상태 계산
      const currentFollowed =
        currentStoreFollowed !== undefined
          ? currentStoreFollowed
          : originalFollowed;
      const currentCount =
        currentStoreCount !== undefined ? currentStoreCount : originalCount;

      // 새로운 상태 계산
      const newFollowed = !currentFollowed;
      const newCount = newFollowed
        ? currentCount + 1
        : Math.max(0, currentCount - 1);

      setFollow(streamerUuid, newFollowed, newCount);
    },
    [followedMap, followCountMap, setFollow],
  );

  const getFollowState = useCallback(
    (
      streamerUuid: string,
      originalFollowed: boolean,
      originalCount: number,
    ) => {
      const storeFollowed = followedMap[streamerUuid];
      const storeCount = followCountMap[streamerUuid];

      return {
        isFollowed:
          storeFollowed !== undefined ? storeFollowed : originalFollowed,
        followCount: storeCount !== undefined ? storeCount : originalCount,
        hasChanges: storeFollowed !== undefined || storeCount !== undefined,
      };
    },
    [followedMap, followCountMap],
  );

  const syncToServer = useCallback(
    async (streamerUuid: string, originalFollowed: boolean) => {
      const storeFollowed = followedMap[streamerUuid];

      // 변경사항이 있고, 실제로 원래 상태와 다를 때만 API 호출
      if (storeFollowed !== undefined && storeFollowed !== originalFollowed) {
        try {
          if (storeFollowed) {
            await StreamerService.followStreamer(streamerUuid);
            console.log("팔로우 API 호출 완료");
          } else {
            await StreamerService.unfollowStreamer(streamerUuid);
            console.log("언팔로우 API 호출 완료");
          }

          // API 호출 성공 후 store에서 제거
          resetFollow(streamerUuid);
          return true;
        } catch (error) {
          console.error("팔로우 API 오류:", error);
          // 실패 시 원래 상태로 복원
          resetFollow(streamerUuid);
          return false;
        }
      } else {
        // 변경사항이 없으면 store만 정리
        resetFollow(streamerUuid);
      }

      return true;
    },
    [followedMap, resetFollow],
  );

  return {
    toggleFollow,
    getFollowState,
    syncToServer,
    resetFollow,
  };
};
