// components/layouts/Footer
import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      as="footer"
      h={{ base: "200px" }}
      borderTop="1px solid"
      borderColor="neutral.200"
      bg="neutral.900"
      mx="auto"
      py={5}
    >
      <VStack gap={0}>
        <Text
          fontFamily="heading"
          fontWeight={600}
          fontSize="xl"
          color="neutral.300"
        >
          인스투
        </Text>
        <Text
          fontFamily="body"
          fontWeight={300}
          fontSize="sm"
          color="neutral.300"
        >
          인방 스케줄러 투게더
        </Text>
        <Text
          fontFamily="body"
          fontWeight={300}
          fontSize="sm"
          color="neutral.300"
        >
          © 2025 인스투. All rights reserved.
        </Text>
      </VStack>
    </Box>
  );
}
