// app/init/InitLocalStorage.tsx
"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useMyStreamersStore } from "@/stores/my-streamers.store";
import { StreamerService } from "@/services/streamer.service";
import { useEffect, useRef } from "react";

const InitLocalStorage = () => {
  const { isAuthenticated } = useAuthStore();
  const { syncOnLogin } = useMyStreamersStore();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // 중복 실행 방지
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // 세션 플래그가 없다면: 브라우저 최초 접근으로 간주
    const initialized = sessionStorage.getItem("hasInitialized");

    if (!initialized) {
      if (!isAuthenticated) {
        // 로그인하지 않은 상태면 localStorage 제거
        localStorage.removeItem("instoo-my_streamers");
      } else {
        // 로그인된 상태면 서버에서 데이터 가져와서 동기화
        initializeUserData();
      }

      // 플래그 설정 → 브라우저 세션 내에서는 다시 초기화되지 않음
      sessionStorage.setItem("hasInitialized", "true");
    } else {
      // 이미 초기화된 세션이지만 로그인 상태면 데이터 동기화
      if (isAuthenticated) {
        initializeUserData();
      }
    }
  }, [isAuthenticated, syncOnLogin]);

  const initializeUserData = async () => {
    try {
      // 팔로우한 스트리머 목록 가져오기
      const streamers = await StreamerService.getMyStreamerByFollowing();

      // store에 동기화
      if (streamers && streamers.length > 0) {
        syncOnLogin(streamers);
      }
    } catch (error) {
      console.error("Failed to initialize user streamers:", error);
    }
  };

  return null;
};

export default InitLocalStorage;
