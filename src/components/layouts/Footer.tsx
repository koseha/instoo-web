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
        인스투: 인방 스케줄러 투게더
      </Text>
      <Text
        fontFamily="body"
        fontWeight={300}
        fontSize="sm"
        color="neutral.600"
      >
        스트리머의 방송 일정을 팬과 유저가 협업하여 관리하는 위키 기반 스케줄
        공유 플랫폼
      </Text>
      <Text
        fontFamily="body"
        fontWeight={300}
        fontSize="sm"
        color="neutral.600"
      >
        문의: koseha.instoo@gmail.com
      </Text>
    </VStack>
  );
}
