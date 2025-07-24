// app/init/InitLocalStorage.tsx
"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

const InitLocalStorage = () => {
  const { isAuthenticated } = useAuthStore();
  useEffect(() => {
    // 세션 플래그가 없다면: 브라우저 최초 접근으로 간주
    const initialized = sessionStorage.getItem("hasInitialized");

    if (!initialized) {
      if (!isAuthenticated) {
        localStorage.removeItem("instoo-my_streamers");
      }

      // 플래그 설정 → 브라우저 세션 내에서는 다시 초기화되지 않음
      sessionStorage.setItem("hasInitialized", "true");
    }
  }, []);

  return null;
};

export default InitLocalStorage;
