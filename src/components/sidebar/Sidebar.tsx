"use client";

import { Box } from "@chakra-ui/react";
import SidebarMenu from "./SidebarMenu";
import MyStreamers from "./MyStreamers";
import AddStreamer from "./AddStreamer";

const Sidebar: React.FC = () => {
  return (
    <Box as="aside" minW="250px">
      <Box position="sticky" top="80px">
        <Box py={4} borderBottomWidth="1px">
          <AddStreamer />
        </Box>
        <Box py={4} borderBottomWidth="1px">
          <SidebarMenu />
        </Box>
        <Box py={3}>
          <MyStreamers />
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
