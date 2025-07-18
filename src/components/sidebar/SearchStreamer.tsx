"use client";

import {
  Portal,
  Spinner,
  Text,
  HStack,
  Combobox,
  AvatarImage,
  ComboboxRoot,
  ComboboxControl,
  ComboboxInput,
  ComboboxIndicatorGroup,
  ComboboxClearTrigger,
  ComboboxPositioner,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
  useListCollection,
  useFilter,
  AvatarRoot,
  InputGroup,
} from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";
import { useRef, useState } from "react";
import {
  StreamerService,
  StreamerSimpleResponse,
} from "@/services/streamer.service";
import { useMyStreamersStore } from "@/stores/my-streamers.store";
import { useNotification } from "@/hooks/useNotifications";

export default function SearchStreamer() {
  const [items, setItems] = useState<StreamerSimpleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { contains } = useFilter({ sensitivity: "base" });
  const { add } = useMyStreamersStore();
  const { showSuccess, showError } = useNotification();

  const { collection, filter, set } = useListCollection<StreamerSimpleResponse>(
    {
      initialItems: [],
      itemToString: (item) => item.name,
      itemToValue: (item) => item.uuid,
      filter: contains,
    },
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
    const query = details.inputValue.trim();
    filter(details.inputValue);

    if (query.length < 2) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await StreamerService.searchSimpleStreamerByName(query);
        setItems(data);
        if (data) set(data);
      } catch (err) {
        console.error("검색 에러:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 300); // ✅ 300ms 디바운스
  };

  return (
    <ComboboxRoot
      collection={collection}
      onInputValueChange={handleInputChange}
      onSelect={(item) => {
        if (!item) return;
        const selected = items.find((i) => i.uuid === item.itemValue);
        if (selected) {
          const success = add(selected);
          if (success) {
            showSuccess({ title: `${selected.name}을(를) 추가하였습니다!` });
          } else {
            showError({
              title: `${selected.name}은(는) 이미 추가되어 있습니다`,
            });
          }
        }
      }}
    >
      <ComboboxControl>
        <InputGroup startElement={<IoSearchOutline />}>
          <ComboboxInput placeholder="추가할 방송인을 검색하세요" />
        </InputGroup>
        <ComboboxIndicatorGroup>
          <ComboboxClearTrigger _hover={{ cursor: "pointer" }} />
        </ComboboxIndicatorGroup>
      </ComboboxControl>

      <Portal>
        <ComboboxPositioner>
          <ComboboxContent>
            {loading ? (
              <HStack justify="center" p={4}>
                <Spinner size="sm" />
                <Text fontSize="sm">검색 중...</Text>
              </HStack>
            ) : items?.length > 0 ? (
              items.map((item) => (
                <ComboboxItem key={item.uuid} item={item}>
                  <HStack>
                    <AvatarRoot>
                      <AvatarImage src="/default-image.png" />
                    </AvatarRoot>
                    <Text>{item.name}</Text>
                  </HStack>
                </ComboboxItem>
              ))
            ) : (
              <ComboboxEmpty>검색 결과 없음(2자 이상)</ComboboxEmpty>
            )}
          </ComboboxContent>
        </ComboboxPositioner>
      </Portal>
    </ComboboxRoot>
  );
}
