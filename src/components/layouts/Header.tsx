import React from "react";
import { Box, Flex, Link } from "@chakra-ui/react";
import AuthComponent from "../auth/AuthComponent";

export default function Header() {
  return (
    <Box
      as="header"
      bg="primary.white"
      borderBottom="1px solid"
      borderColor="neutral.200"
      h={{ base: "56px", md: "64px" }}
      position="static"
    >
      <Flex
        as="nav"
        h="full"
        align="center"
        justify="space-between"
        px={4}
        maxW="100%"
      >
        {/* 로고 */}
        <Link
          href="/"
          fontSize="xl"
          fontWeight="600"
          fontFamily="heading"
          color="primary.black"
          textDecoration="none"
          _hover={{ textDecoration: "none", color: "neutral.800" }}
        >
          Instoo
        </Link>

        {/* 로그인/로그아웃 */}
        <AuthComponent />
      </Flex>
    </Box>
  );
}
