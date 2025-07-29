"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useMyStreamersStore } from "@/stores/my-streamers.store";
import { StreamerService } from "@/services/streamer.service";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const { syncOnLogin } = useMyStreamersStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Zustand 하이드레이션 대기
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (isAuthenticated) {
        try {
          const streamers = await StreamerService.getMyStreamerByFollowing();
          if (streamers?.length > 0) {
            syncOnLogin(streamers);
          }
        } catch (error) {
          console.error("Failed to load streamers:", error);
        }
      }

      setIsReady(true);
    };

    init();
  }, [isAuthenticated, syncOnLogin]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};
