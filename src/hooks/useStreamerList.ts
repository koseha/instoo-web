// hooks/useStreamerList.ts
import { useState, useEffect, useCallback } from "react";
import { StreamerData, Streamer } from "@/types/interfaces/streamer.interface";
import { StreamerService } from "@/services/streamer.service";

interface UseStreamerListParams {
  isVerified: boolean;
  platforms: string[];
  searchName: string;
  searchTrigger: number;
}

export const useStreamerList = ({
  isVerified,
  platforms,
  searchName,
  searchTrigger,
}: UseStreamerListParams) => {
  const [data, setData] = useState<StreamerData>({
    data: [],
    totalCount: 0,
    page: 1,
    size: 15,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStreamer, setSelectedStreamer] = useState<Streamer | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const pageSize = 15;

  // API 호출 함수
  const fetchStreamers = useCallback(
    async (page: number = 1, qName: string = "") => {
      setIsLoading(true);
      setError(null);

      try {
        const requestBody = {
          isVerified,
          page,
          size: pageSize,
          ...(platforms.length > 0 && { platforms }),
          ...(qName.trim() && { qName: qName.trim() }),
        };

        const response: StreamerData =
          await StreamerService.getStreamerList(requestBody);
        const content = response || {};

        setData({
          data: content.data || [],
          totalCount: content.totalCount || 0,
          page: content.page || page,
          size: content.size || pageSize,
        });

        setCurrentPage(page);
      } catch (error) {
        console.error("스트리머 목록 조회 실패:", error);
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
        );
        setData({
          data: [],
          totalCount: 0,
          page: 1,
          size: pageSize,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isVerified, platforms, pageSize],
  );

  // 필터 변경 시 첫 페이지로 이동하여 검색
  useEffect(() => {
    fetchStreamers(1, searchName);
  }, [platforms, searchTrigger, fetchStreamers]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    fetchStreamers(page, searchName);
  };

  // 상세 다이얼로그 관리
  const openDetail = (streamer: Streamer) => {
    setSelectedStreamer(streamer);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedStreamer(null), 200);
  };

  return {
    data,
    isLoading,
    error,
    currentPage,
    handlePageChange,
    selectedStreamer,
    isDetailOpen,
    openDetail,
    closeDetail,
  };
};
