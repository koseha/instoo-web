"use client";

import {
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
  Image,
} from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";
import { useRef, useState } from "react";
import { StreamerService } from "@/services/streamer.service";
import { PLATFORM_ICON_MAP } from "@/constants/platform";
import { StreamerSimpleResponse } from "@/types/interfaces/streamer.interface";

interface SearchStreamerProps {
  placeholder?: string;
  onSelect?: (streamer: StreamerSimpleResponse) => void;
  onSelectResult?: (
    success: boolean,
    streamer: StreamerSimpleResponse,
    message?: string,
  ) => void;
}

export default function SearchStreamer({
  placeholder = "방송인을 검색하세요",
  onSelect,
  onSelectResult,
}: SearchStreamerProps) {
  const [items, setItems] = useState<StreamerSimpleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { contains } = useFilter({ sensitivity: "base" });

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

    if (query.length < 2) {
      setItems([]);
      return;
    }
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
    }, 300);
  };

  return (
    <ComboboxRoot
      collection={collection}
      onInputValueChange={handleInputChange}
      onSelect={(item) => {
        if (!item) return;
        const selected = items.find((i) => i.uuid === item.itemValue);
        if (selected) {
          // 단순히 선택된 아이템만 전달하는 콜백
          onSelect?.(selected);
          // 선택 결과까지 처리하는 콜백 (기존 로직 유지용)
          onSelectResult?.(true, selected);
        }
      }}
      className="the-second-lesson"
    >
      <ComboboxControl>
        <InputGroup startElement={<IoSearchOutline />}>
          <ComboboxInput maxLength={6} placeholder={placeholder} />
        </InputGroup>
        <ComboboxIndicatorGroup>
          <ComboboxClearTrigger _hover={{ cursor: "pointer" }} />
        </ComboboxIndicatorGroup>
      </ComboboxControl>

      <ComboboxPositioner zIndex={9999}>
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
                  {item.platforms?.map((p) => (
                    <Image
                      key={p.channelUrl}
                      w={4}
                      h={4}
                      src={PLATFORM_ICON_MAP[p.platformName]}
                      alt={`${p.platformName} icon`}
                    />
                  ))}
                </HStack>
              </ComboboxItem>
            ))
          ) : (
            <ComboboxEmpty>검색 결과 없음(2자 이상)</ComboboxEmpty>
          )}
        </ComboboxContent>
      </ComboboxPositioner>
    </ComboboxRoot>
  );
}
