// app/page.tsx
"use client";

import { Box, IconButton, Text } from "@chakra-ui/react";
import { FaRedo } from "react-icons/fa";

export default function UserActivity() {
  return (
    <Box>
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
          내 활동 한눈에 보기
          <IconButton
            size="xs"
            variant="ghost"
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
          팔로우한 스트리머, 스트리머/일정 등록 등 나의 활동 내역을 확인할 수
          있어요.
        </Text>
      </Box>
    </Box>
  );
}
