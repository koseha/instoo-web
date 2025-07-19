// components/streamer/StreamerFilters.tsx
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

const StreamerFilters: React.FC<StreamerFiltersProps> = ({
  searchName,
  selectedPlatforms,
  onSearchChange,
  onSearchSubmit,
  onPlatformChange,
  activeTab,
}) => {
  const colorPalette = activeTab === "verified" ? "blue" : "orange";

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchSubmit();
    }
  };

  const handlePlatformToggle = (platform: Platform) => {
    onPlatformChange(platform);
  };

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

      {/* 검색 입력 */}
      <InputGroup startElement={<IoSearchOutline />} w={300}>
        <Input
          placeholder="스트리머 이름으로 검색 (Enter로 검색)"
          size="xs"
          value={searchName}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </InputGroup>
    </Flex>
  );
};

export default StreamerFilters;
