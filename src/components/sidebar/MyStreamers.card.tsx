import { PLATFORM_ICON_MAP } from "@/constants/platform";
import { useMyStreamersStore } from "@/stores/my-streamers.store";
import { StreamerSimpleResponse } from "@/types/interfaces/streamer.interface";
import {
  Text,
  HStack,
  AvatarImage,
  AvatarRoot,
  Flex,
  Stack,
  Image,
  SwitchControl,
  SwitchHiddenInput,
  SwitchRoot,
  Box,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GoPeople } from "react-icons/go";
import { Tooltip } from "../ui/tooltip";
import { FaUserCheck } from "react-icons/fa6";

interface MyStreamersCardProps {
  streamer: StreamerSimpleResponse;
}

const MyStreamersCard: React.FC<MyStreamersCardProps> = ({ streamer }) => {
  const { scheduleFetchUuids, addFetchTarget, removeFetchTarget } =
    useMyStreamersStore();
  const [checked, setChecked] = useState(false);

  // 상태 동기화
  useEffect(() => {
    setChecked(scheduleFetchUuids.includes(streamer.uuid));
  }, [scheduleFetchUuids, streamer.uuid]);

  const handlePlatformClick = (platformUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(platformUrl, "_blank", "noopener,noreferrer");
  };

  const handleSwitchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCheckedChange = (value: boolean) => {
    setChecked(value);
    if (value) {
      addFetchTarget(streamer.uuid);
    } else {
      removeFetchTarget(streamer.uuid);
    }
  };

  return (
    <HStack key={streamer.uuid} alignItems="center" w="100%">
      <>
        <AvatarRoot>
          <AvatarImage src={streamer.profileImageUrl || "/default-image.png"} />
        </AvatarRoot>

        <Stack gap={1} flex={1}>
          <HStack gap={1}>
            {/* <Icon boxSize={4}>
              <GoPerson />
            </Icon> */}
            <Text fontSize="sm" color="neutral.600" fontFamily="body">
              {streamer.name}
            </Text>
          </HStack>
          <Flex gap="3px">
            {streamer.platforms.map((platform) => (
              <Box
                as="div"
                key={platform.platformName}
                w={3}
                h={3}
                minW={3}
                minH={3}
                _hover={{
                  transform: "scale(1.1)",
                }}
                transition="all 0.2s ease"
                onClick={(e) => handlePlatformClick(platform.channelUrl, e)}
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
              >
                <Image
                  w={3}
                  h={3}
                  src={PLATFORM_ICON_MAP[platform.platformName]}
                  alt={`${platform.platformName} icon`}
                />
              </Box>
            ))}
          </Flex>
        </Stack>
      </>

      <Stack alignItems="start">
        <HStack gap={1}>
          {streamer.isFollowed && (
            <Tooltip
              key={streamer.uuid + "FaUserCheck"}
              content={"팔로잉"}
              positioning={{ placement: "top" }}
              openDelay={100}
              closeDelay={100}
              contentProps={{ bg: "blue.100", color: "blue.700" }}
            >
              <Badge colorPalette="blue" fontSize="10px">
                <FaUserCheck />
              </Badge>
            </Tooltip>
          )}
          <Tooltip
            key={streamer.uuid + "GoPeople"}
            content={"팔로우 수"}
            positioning={{ placement: "top" }}
            openDelay={100}
            closeDelay={100}
            contentProps={{ bg: "blue.100", color: "blue.700" }}
          >
            <Badge colorPalette="blue" fontSize="10px">
              <GoPeople />
              {streamer.followCount ?? 0}
            </Badge>
          </Tooltip>
        </HStack>
        <HStack justifyContent="flex-end" w="full">
          <SwitchRoot
            size="xs"
            onClick={handleSwitchClick}
            checked={checked}
            onCheckedChange={(e) => handleCheckedChange(e.checked)}
          >
            <SwitchHiddenInput />
            <SwitchControl />
          </SwitchRoot>
        </HStack>
      </Stack>
    </HStack>
  );
};

export default MyStreamersCard;
