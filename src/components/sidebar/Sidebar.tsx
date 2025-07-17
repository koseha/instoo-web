"use client";

import { Box } from "@chakra-ui/react";
import SidebarMenu from "./SidebarMenu";
import SearchStreamer from "./SearchStreamer";
import MyStreamers from "./MyStreamers";

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
        <SearchStreamer />
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
