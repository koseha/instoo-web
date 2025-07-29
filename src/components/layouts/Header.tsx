"use client";

// components/layouts/Header
import React from "react";
import { Box, Flex, HStack, IconButton, Link } from "@chakra-ui/react";
import AuthComponent from "../auth/AuthComponent";
// import { SlMenu } from "react-icons/sl";

export default function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0px"
      zIndex="999"
      h={{ base: "64px" }}
      bg="primary.white"
      transition="background-color 0.2s ease, backdrop-filter 0.3s ease"
    >
      <Flex
        as="nav"
        h="full"
        align="center"
        justify="space-between"
        className="main-header"
      >
        {/* 로고 */}
        <HStack>
          {/* <IconButton variant="ghost">
            <SlMenu color="black" />
          </IconButton> */}
          <Link
            href="/"
            fontSize="xl"
            fontWeight="600"
            fontFamily="heading"
            color="primary.black"
            textDecoration="none"
            _hover={{ textDecoration: "none", color: "neutral.800" }}
          >
            인스투
          </Link>
        </HStack>

        {/* 로그인/로그아웃 */}
        <AuthComponent />
      </Flex>
    </Box>
  );
}
