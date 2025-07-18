// app/streamers/page.tsx
"use client";

import {
  Box,
  CheckboxCard,
  CheckboxGroup,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";
import { MdOutlineHourglassBottom } from "react-icons/md";
import { FaRedo } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import StreamerList from "@/components/streamer/StreamerList";
import { PLATFORM_ICON_MAP } from "@/constants/platform";
import { useState } from "react";

type Platform = "chzzk" | "soop" | "youtube";

export default function Streamers() {
  const [activeTab, setActiveTab] = useState<"verified" | "loading">(
    "verified",
  );
  const [qName, setQName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [searchTrigger, setSearchTrigger] = useState(0); // 검색 트리거용

  // 검색 입력 핸들러 (Enter 키로 검색)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTrigger((prev) => prev + 1); // 트리거 증가로 검색 실행
    }
  };

  // 플랫폼 체크박스 변경 핸들러 (즉시 검색)
  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatforms((prev) => {
      const newPlatforms = prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform];
      return newPlatforms;
    });
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    setQName("");
    setSelectedPlatforms([]);
    setSearchTrigger((prev) => prev + 1);
  };

  return (
    <>
      <Box mb={4}>
        <Text
          color="neutral.900"
          fontFamily="heading"
          fontSize="xl"
          fontWeight={700}
          mb={1}
          display="flex"
          alignItems="center"
          gap={2}
        >
          스트리머 목록 보기
          <IconButton
            size="xs"
            variant="ghost"
            onClick={handleRefresh}
            _hover={{
              bg: "neutral.100",
              transform: "rotate(180deg)",
              color: "neutral.700",
            }}
            transition="all 0.3s ease"
            borderRadius="full"
            color="neutral.400"
          >
            <FaRedo />
          </IconButton>
        </Text>
        <Text color="neutral.500" fontFamily="body" fontSize="md">
          팬들이 함께 관리하는 방송인 정보
        </Text>
      </Box>

      <Tabs.Root
        defaultValue="verified"
        variant="plain"
        onValueChange={(details) =>
          setActiveTab(details.value as "verified" | "loading")
        }
      >
        <Tabs.List bg="bg.muted" rounded="l3" p="1">
          <Tabs.Trigger
            value="verified"
            _selected={{
              "& .selected_streamer-verified": {
                color: "blue.500",
                transform: "scale(1.1)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            <Box
              as={MdVerified}
              className="selected_streamer-verified"
              transition="all 0.2s ease-in-out"
              _hover={{ transform: "scale(1.05)" }}
            />
            인증됨
          </Tabs.Trigger>
          <Tabs.Trigger
            value="loading"
            _selected={{
              "& .selected_streamer-loading": {
                color: "orange.500",
                transform: "rotate(180deg)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <Box
              as={MdOutlineHourglassBottom}
              className="selected_streamer-loading"
              transform="rotate(0deg)"
              transition="transform 0.5s ease"
            />
            요청 중
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>

        <Flex justify="space-between" alignItems="end" mt={2}>
          <CheckboxGroup>
            <Flex gap={2}>
              <CheckboxCard.Root
                w="100px"
                size="sm"
                alignItems="center"
                variant="surface"
                cursor="pointer"
                colorPalette={activeTab === "verified" ? "blue" : "orange"}
                checked={selectedPlatforms.includes("chzzk")}
                onCheckedChange={() => handlePlatformChange("chzzk")}
              >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control px={2} py={1}>
                  <CheckboxCard.Label fontFamily="body" fontSize="xs">
                    <Image
                      w={3}
                      h={3}
                      src={PLATFORM_ICON_MAP["chzzk"]}
                      alt={`chzzk icon`}
                    />
                    치지직
                  </CheckboxCard.Label>
                </CheckboxCard.Control>
              </CheckboxCard.Root>

              <CheckboxCard.Root
                w="100px"
                size="sm"
                alignItems="center"
                variant="surface"
                cursor="pointer"
                colorPalette={activeTab === "verified" ? "blue" : "orange"}
                checked={selectedPlatforms.includes("soop")}
                onCheckedChange={() => handlePlatformChange("soop")}
              >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control px={2} py={1}>
                  <CheckboxCard.Label fontFamily="body" fontSize="xs">
                    <Image
                      w={3}
                      h={3}
                      src={PLATFORM_ICON_MAP["soop"]}
                      alt={`soop icon`}
                    />
                    숲
                  </CheckboxCard.Label>
                </CheckboxCard.Control>
              </CheckboxCard.Root>

              <CheckboxCard.Root
                w="100px"
                size="sm"
                alignItems="center"
                variant="surface"
                cursor="pointer"
                colorPalette={activeTab === "verified" ? "blue" : "orange"}
                checked={selectedPlatforms.includes("youtube")}
                onCheckedChange={() => handlePlatformChange("youtube")}
              >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control px={2} py={1}>
                  <CheckboxCard.Label fontFamily="body" fontSize="xs">
                    <Image
                      w={3}
                      h={3}
                      src={PLATFORM_ICON_MAP["youtube"]}
                      alt={`youtube icon`}
                    />
                    Youtube
                  </CheckboxCard.Label>
                </CheckboxCard.Control>
              </CheckboxCard.Root>
            </Flex>
          </CheckboxGroup>

          <InputGroup startElement={<IoSearchOutline />} w={300}>
            <Input
              placeholder="스트리머 이름으로 검색 (Enter로 검색)"
              size="xs"
              value={qName}
              onChange={(e) => setQName(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </InputGroup>
        </Flex>

        <Tabs.Content value="verified">
          <StreamerList
            isVerified={true}
            platforms={selectedPlatforms}
            searchName={qName}
            searchTrigger={searchTrigger}
            description="인증된 스트리머의 방송 일정을 자유롭게 등록하고 수정할 수 있어요"
          />
        </Tabs.Content>
        <Tabs.Content value="loading">
          <StreamerList
            isVerified={false}
            platforms={selectedPlatforms}
            searchName={qName}
            searchTrigger={searchTrigger}
            description="관리자 검토 중인 스트리머들입니다. 곧 인증될 예정이에요"
          />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
