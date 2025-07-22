"use client";

// components/layouts/Header
import React from "react";
import { Box, Flex, Link } from "@chakra-ui/react";
import AuthComponent from "../auth/AuthComponent";
import { useScrolled } from "@/hooks/useScrolled";

export default function Header() {
  const scrolled = useScrolled();

  return (
    <Box
      as="header"
      position="sticky"
      top="0px"
      zIndex="999"
      h={{ base: "64px" }}
      bg={scrolled ? "neutral.150" : "primary.white"}
      borderBottom="1px solid"
      borderColor="neutral.300"
      backdropFilter={scrolled ? "blur(4px)" : "none"}
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

        {/* 로그인/로그아웃 */}
        <AuthComponent />
      </Flex>
    </Box>
  );
}
