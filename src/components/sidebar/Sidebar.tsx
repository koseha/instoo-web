"use client";

import { Box } from "@chakra-ui/react";
import SidebarMenu from "./SidebarMenu";
import MyStreamers from "./MyStreamers";
import AddStreamer from "./AddStreamer";

const Sidebar: React.FC = () => {
  return (
    <Box
      as="aside"
      minW="250px"
      px={3}
      borderXWidth="1px"
      borderColor="neutral.200"
    >
      <Box
        position="sticky"
        top="80px"
        // height="100vh"
        // overflowY="auto"
        // css={{
        //   // 사용자 정의 스크롤바 스타일
        //   "&::-webkit-scrollbar": {
        //     width: "6px",
        //   },
        //   "&::-webkit-scrollbar-track": {
        //     background: "transparent",
        //   },
        //   "&::-webkit-scrollbar-thumb": {
        //     background: "#D4D4D4",
        //     borderRadius: "3px",
        //   },
        //   "&::-webkit-scrollbar-thumb:hover": {
        //     background: "#A3A3A3",
        //   },
        // }}
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
    </Box>
  );
};

export default Sidebar;
