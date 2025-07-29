// components/layouts/Footer
import React from "react";
import { Text, VStack } from "@chakra-ui/react";

export default function Footer() {
  return (
    <VStack
      as="footer"
      gap={0}
      w="full"
      pt={5}
      py={15}
      borderTopWidth={1}
      mt={10}
    >
      <Text
        fontFamily="heading"
        fontWeight={600}
        fontSize="xl"
        color="neutral.600"
      >
        인스투
      </Text>
      <Text
        fontFamily="body"
        fontWeight={300}
        fontSize="sm"
        color="neutral.600"
      >
        인방 스케줄러 투게더
      </Text>
      <Text
        fontFamily="body"
        fontWeight={300}
        fontSize="sm"
        color="neutral.600"
      >
        © 2025 인스투. All rights reserved.
      </Text>
    </VStack>
  );
}
