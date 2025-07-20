"use client";

import SearchStreamer from "./SearchStreamer";
import { useMyStreamersStore } from "@/stores/my-streamers.store";
import { useNotification } from "@/hooks/useNotifications";
import { StreamerSimpleResponse } from "@/services/streamer.service";

export default function AddStreamer() {
  const { add } = useMyStreamersStore();
  const { showSuccess, showWarning } = useNotification();

  const handleStreamerSelect = (streamer: StreamerSimpleResponse) => {
    const success = add(streamer);
    if (success) {
      showSuccess({ title: `${streamer.name}을(를) 추가하였습니다!` });
    } else {
      showWarning({
        title: `${streamer.name}은(는) 이미 추가되어 있습니다`,
      });
    }
  };

  return (
    <SearchStreamer
      placeholder="추가할 방송인을 검색하세요"
      onSelect={handleStreamerSelect}
    />
  );
}
