import apiClient from "@/lib/axios-api";
import { useMyStreamersStore } from "@/stores/my-streamers.store";
import { API_ENDPOINTS } from "@/types/enums/api-endpoints.enum";
import { StreamerSimpleResponse } from "@/types/interfaces/streamer.interface";
import { useQuery } from "@tanstack/react-query";

export const useMyStreamers = () => {
  const { getUuidsToDisplay, streamers: basicStreamers } =
    useMyStreamersStore();
  const uuids = getUuidsToDisplay();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["my-streamers-batch", uuids],
    queryFn: async (): Promise<StreamerSimpleResponse[]> => {
      if (uuids.length === 0) return [];

      const response = await apiClient.post(
        API_ENDPOINTS.STREAMERS.BATCH_SIMPLE,
        { uuids: uuids },
      );

      return response.data.content;
    },
    enabled: uuids.length > 0,
    staleTime: 2 * 60 * 1000, // 2분
    // refetchInterval: 30 * 1000, // 30초마다 갱신
    // refetchIntervalInBackground: false,
  });

  // 서버에서 데이터를 못 가져온 경우, 로컬의 기본 정보라도 보여주기
  const fallbackStreamers: StreamerSimpleResponse[] = basicStreamers.map(
    (basic) => ({
      ...basic,
      followCount: 0, // 기본값
    }),
  );

  return {
    streamers: data || fallbackStreamers,
    isLoading,
    error,
    refetch,
  };
};
