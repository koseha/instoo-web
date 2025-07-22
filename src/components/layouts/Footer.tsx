// components/layouts/Footer
import React from "react";
import { Box } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      as="footer"
      h={{ base: "200px" }}
      borderTop="1px solid"
      borderColor="neutral.200"
      bg="neutral.900"
    >
      푸터
    </Box>
  );
}
