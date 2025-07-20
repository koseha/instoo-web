import { PLATFORM_ICON_MAP } from "@/constants/platform";
import { StreamerSimpleResponse } from "@/services/streamer.service";
import { useMyStreamersStore } from "@/stores/my-streamers.store";
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
  SwitchLabel,
  SwitchRoot,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface MyStreamersCardProps {
  streamer: StreamerSimpleResponse;
}

const MyStreamersCard: React.FC<MyStreamersCardProps> = ({ streamer }) => {
  const { fetchTargetUuids, addFetchTarget, removeFetchTarget } =
    useMyStreamersStore();
  const [checked, setChecked] = useState(false);

  // 상태 동기화
  useEffect(() => {
    setChecked(fetchTargetUuids.includes(streamer.uuid));
  }, [fetchTargetUuids, streamer.uuid]);

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

        <Stack gap={0} flex={1}>
          <Text fontSize="sm" color="neutral.600" fontFamily="body">
            {streamer.name}
          </Text>
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

      <SwitchRoot
        size="xs"
        alignSelf="flex-end"
        onClick={handleSwitchClick}
        checked={checked}
        onCheckedChange={(e) => handleCheckedChange(e.checked)}
      >
        <SwitchHiddenInput />
        <SwitchControl />
        <SwitchLabel />
      </SwitchRoot>
    </HStack>
  );
};

export default MyStreamersCard;
