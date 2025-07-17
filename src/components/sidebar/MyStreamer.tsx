import { useMyStreamersStore } from "@/stores/my-streamers.store";
import { PLATFORM_ICON_MAP } from "@/constants/platform";
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
  CloseButton,
  IconButton,
} from "@chakra-ui/react";
import { FaRedo } from "react-icons/fa";

const MyStreamers = () => {
  const { streamers, remove } = useMyStreamersStore();

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={1}>
        <Text fontSize="sm" color="neutral.500" fontFamily="heading">
          My Streamers
        </Text>
        <IconButton
          size="xs"
          variant="ghost"
          _hover={{
            bg: "neutral.100",
            transform: "rotate(180deg)",
            color: "neutral.600",
          }}
          transition="all 0.3s ease"
          borderRadius="full"
        >
          <FaRedo />
        </IconButton>
      </Flex>

      {streamers.map((streamer) => (
        <HStack
          key={streamer.uuid}
          p={2}
          mb={1}
          alignItems="center"
          gap={2}
          position="relative"
          _hover={{
            bg: "neutral.100",
            "& .close-button": {
              opacity: 1,
              visibility: "visible",
            },
          }}
        >
          <AvatarRoot>
            <AvatarImage
              src={streamer.profileImageUrl || "/default-image.png"}
            />
          </AvatarRoot>

          <Stack gap={0} flex={1}>
            <Text fontSize="sm" color="neutral.600" fontFamily="body">
              {streamer.name}
            </Text>
            <Flex gap="3px">
              {streamer.platforms.map((platform) => (
                <Image
                  key={platform.platformName}
                  w={3}
                  h={3}
                  src={PLATFORM_ICON_MAP[platform.platformName]}
                  alt={`${platform.platformName} icon`}
                />
              ))}
            </Flex>
          </Stack>

          <SwitchRoot size="xs" alignSelf="flex-end">
            <SwitchHiddenInput />
            <SwitchControl />
            <SwitchLabel />
          </SwitchRoot>

          <CloseButton
            size="2xs"
            className="close-button"
            opacity={0}
            visibility="hidden"
            transition="opacity 0.2s, visibility 0.2s"
            position="absolute"
            top={1}
            right={1}
            _hover={{ bg: "neutral.300" }}
            onClick={() => remove(streamer.uuid)}
          />
        </HStack>
      ))}
    </>
  );
};

export default MyStreamers;
