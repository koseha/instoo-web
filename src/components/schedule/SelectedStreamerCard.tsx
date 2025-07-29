// src/components/schedule/SelectedStreamerCard.tsx
"use client";

import {
  Box,
  HStack,
  Text,
  Button,
  AvatarRoot,
  AvatarImage,
  Image,
} from "@chakra-ui/react";
import { PLATFORM_ICON_MAP } from "@/constants/platform";
import { StreamerSimpleResponse } from "@/types/interfaces/streamer.interface";

interface SelectedStreamerCardProps {
  streamer: StreamerSimpleResponse;
  onChangeStreamer?: () => void;
}

const SelectedStreamerCard = ({
  streamer,
  onChangeStreamer,
}: SelectedStreamerCardProps) => {
  return (
    <Box
      bg="neutral.100"
      border="2px solid"
      borderColor="neutral.200"
      borderRadius="lg"
      w="full"
      p={3}
      h={16}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <HStack gap={3}>
        <AvatarRoot size="lg">
          <AvatarImage src="https://bit.ly/naruto-sage" />
        </AvatarRoot>
        <HStack gap={2}>
          <Text fontSize="sm" fontWeight="500" color="primary.black">
            {streamer.name}
          </Text>
          <HStack gap={1}>
            {streamer.platforms.map((p) => (
              <Image
                key={p.channelUrl}
                w={4}
                h={4}
                src={PLATFORM_ICON_MAP[p.platformName]}
                alt={`${p.platformName} icon`}
              />
            ))}
          </HStack>
        </HStack>
      </HStack>
      {onChangeStreamer && (
        <Button
          size="xs"
          variant="surface"
          onClick={onChangeStreamer}
          colorPalette="gray"
        >
          바꾸기
        </Button>
      )}
    </Box>
  );
};

export default SelectedStreamerCard;
