"use client";

import React, { useCallback, useState, useEffect } from "react";
import {
  CheckboxCard,
  CheckboxGroup,
  Flex,
  Image,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";
import { PLATFORM_ICON_MAP } from "@/constants/platform";

type Platform = "chzzk" | "soop" | "youtube";

interface StreamerFiltersProps {
  searchName: string;
  selectedPlatforms: Platform[];
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onPlatformChange: (platform: Platform) => void;
  activeTab: "verified" | "loading";
}

const StreamerFilters: React.FC<StreamerFiltersProps> = React.memo(
  ({
    searchName,
    selectedPlatforms,
    onSearchChange,
    onSearchSubmit,
    onPlatformChange,
    activeTab,
  }) => {
    // 로컬 상태로 입력값 관리 (핵심 개선 사항)
    const [localSearchName, setLocalSearchName] = useState(searchName);

    const colorPalette = activeTab === "verified" ? "blue" : "orange";

    // 디바운스로 부모 상태 업데이트 (300ms 지연)
    useEffect(() => {
      const timer = setTimeout(() => {
        if (localSearchName !== searchName) {
          onSearchChange(localSearchName);
        }
      }, 300);

      return () => clearTimeout(timer);
    }, [localSearchName, onSearchChange, searchName]);

    // 외부에서 searchName이 변경되면 로컬 상태도 동기화
    useEffect(() => {
      setLocalSearchName(searchName);
    }, [searchName]);

    const handleSearchKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          onSearchSubmit();
        }
      },
      [onSearchSubmit],
    );

    const handlePlatformToggle = useCallback(
      (platform: Platform) => {
        onPlatformChange(platform);
      },
      [onPlatformChange],
    );

    // 로컬 상태 변경 핸들러
    const handleLocalSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchName(e.target.value);
      },
      [],
    );

    return (
      <Flex justify="space-between" alignItems="end" mt={2}>
        {/* 플랫폼 필터 */}
        <CheckboxGroup>
          <Flex gap={2}>
            {(["chzzk", "soop", "youtube"] as Platform[]).map((platform) => (
              <CheckboxCard.Root
                key={platform}
                w="100px"
                size="sm"
                alignItems="center"
                variant="surface"
                cursor="pointer"
                colorPalette={colorPalette}
                checked={selectedPlatforms.includes(platform)}
                onCheckedChange={() => handlePlatformToggle(platform)}
              >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control px={2} py={1}>
                  <CheckboxCard.Label fontFamily="body" fontSize="xs">
                    <Image
                      w={3}
                      h={3}
                      src={PLATFORM_ICON_MAP[platform]}
                      alt={`${platform} icon`}
                    />
                    {platform === "chzzk" && "치지직"}
                    {platform === "soop" && "숲"}
                    {platform === "youtube" && "Youtube"}
                  </CheckboxCard.Label>
                </CheckboxCard.Control>
              </CheckboxCard.Root>
            ))}
          </Flex>
        </CheckboxGroup>

        {/* 검색 입력 - 로컬 상태 사용 */}
        <InputGroup startElement={<IoSearchOutline />} w={300}>
          <Input
            placeholder="스트리머 이름으로 검색 (Enter로 검색)"
            size="xs"
            value={localSearchName} // 로컬 상태 사용
            onChange={handleLocalSearchChange} // 로컬 핸들러 사용
            onKeyDown={handleSearchKeyDown}
          />
        </InputGroup>
      </Flex>
    );
  },
);

StreamerFilters.displayName = "StreamerFilters";

export default StreamerFilters;
