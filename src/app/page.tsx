// app/page.tsx
"use client";

import { toaster } from "@/components/ui/toaster";
import { Box, Button, For, Heading } from "@chakra-ui/react";

export default function Home() {
  const handleClick = (type: string = "success") => {
    console.log("Button clicked!"); // 이게 콘솔에 나타나는지 확인
    toaster.create({
      title: `Toast status is ${type}`,
      type: type,
    });
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Hello Chakra UI!</Heading>
      <Button colorScheme="teal" onClick={() => handleClick()}>
        Click Me
      </Button>
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
