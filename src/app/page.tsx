// app/page.tsx
"use client";

import { toaster } from "@/components/ui/toaster";
import { Box, Button, For, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box className="main-content">
      <Heading mb={4}>Hello Chakra UI!</Heading>

      <For each={["success", "error", "warning", "info"]}>
        {(type) => (
          <Button
            size="sm"
            variant="outline"
            key={type}
            onClick={() =>
              toaster.create({
                title: `Toast status is ${type}`,
                type: type,
              })
            }
          >
            {type}
          </Button>
        )}
      </For>
    </Box>
  );
}
