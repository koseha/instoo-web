"use client";

import { Box } from "@chakra-ui/react";
import SidebarMenu from "./SidebarMenu";
import MyStreamers from "./MyStreamers";
import AddStreamer from "./AddStreamer";

const Sidebar: React.FC = () => {
  return (
    <Box
      as="aside"
      px={3}
      w="250px"
      borderXWidth="1px"
      borderColor="neutral.200"
    >
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
  );
};

export default Sidebar;
