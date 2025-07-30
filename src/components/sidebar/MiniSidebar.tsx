import { Box, Separator, VStack } from "@chakra-ui/react";
import MiniSidebarMenu from "./MiniSidebarMenu";
import MiniSidebarMyStreamers from "./MiniSidebarMyStreamers";

const MiniSidebar = () => {
  return (
    <Box pt={10} as="aside" w={12}>
      <VStack gap={4} w="full" position="sticky" top="104px">
        <MiniSidebarMenu />
        <Separator size="sm" w="full" />
        <MiniSidebarMyStreamers />
      </VStack>
    </Box>
  );
};

export default MiniSidebar;
