// app/page.tsx
"use client";

import { Box, Button, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box p={8}>
      <Heading mb={4}>Hello Chakra UI!</Heading>
      <Button colorScheme="teal">Click Me</Button>
    </Box>
  );
}
