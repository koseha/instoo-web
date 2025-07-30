// app/page.tsx
"use client";

import { Box, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaRedo } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/schedules");
  }, [router]);

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
          스트리머 일정 모아보기
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
          팬들이 함께 관리하는 스트리머 일정 정보
        </Text>
      </Box>
    </Box>
  );
}
