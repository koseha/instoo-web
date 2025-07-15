"use client";

import {
  Input,
  Box,
  InputGroup,
  Text,
  AvatarRoot,
  AvatarImage,
  HStack,
  Stack,
  Image,
  Flex,
  SwitchRoot,
  SwitchHiddenInput,
  SwitchControl,
  SwitchLabel,
  CloseButton,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import SidebarMenu from "./SidebarMenu";

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
        <InputGroup flex="1" startElement={<LuSearch />}>
          <Input placeholder="방송인 검색..." />
        </InputGroup>
      </Box>
      <Box py={4} borderBottomWidth="1px">
        <SidebarMenu />
      </Box>
      <Box py={4}>
        <Text
          fontSize="sm"
          color="neutral.500"
          fontFamily="heading"
          paddingBottom={2}
        >
          My Streamers
        </Text>
        <HStack
          p={2}
          marginBottom={1}
          alignItems="center"
          gap={2}
          position="relative"
          _hover={{
            "& .close-button": {
              opacity: 1,
              visibility: "visible",
            },
          }}
        >
          <AvatarRoot>
            <AvatarImage src="/default-image.png" />
          </AvatarRoot>
          <Stack gap={0} flex={1}>
            <Text fontSize="sm" color="neutral.500" fontFamily="body">
              한동숙
            </Text>
            <Flex gap="3px">
              <Image w={3} h={3} src="/chzzk_logo.svg" alt="chzzk icon" />
              <Image w={3} h={3} src="/youtube_icon.png" alt="youtube icon" />
              <Image w={3} h={3} src="/soop_logo.svg" alt="soop icon" />
            </Flex>
          </Stack>

          <SwitchRoot size="xs" alignSelf="flex-end">
            <SwitchHiddenInput />
            <SwitchControl />
            <SwitchLabel />
          </SwitchRoot>

          <CloseButton
            size="2xs"
            className="close-button"
            opacity={0}
            visibility="hidden"
            transition="opacity 0.2s, visibility 0.2s"
            position="absolute"
            top={1}
            right={1}
          />
        </HStack>
        <HStack
          p={2}
          marginBottom={1}
          alignItems="center"
          gap={2}
          position="relative"
          _hover={{
            "& .close-button": {
              opacity: 1,
              visibility: "visible",
            },
          }}
        >
          <AvatarRoot>
            <AvatarImage src="/default-image.png" />
          </AvatarRoot>
          <Stack gap={0} flex={1}>
            <Text fontSize="sm" color="neutral.500" fontFamily="body">
              한동숙
            </Text>
            <Flex gap="3px">
              <Image w={3} h={3} src="/chzzk_logo.svg" alt="chzzk icon" />
              <Image w={3} h={3} src="/youtube_icon.png" alt="youtube icon" />
              <Image w={3} h={3} src="/soop_logo.svg" alt="soop icon" />
            </Flex>
          </Stack>

          <SwitchRoot size="xs" alignSelf="flex-end">
            <SwitchHiddenInput />
            <SwitchControl />
            <SwitchLabel />
          </SwitchRoot>

          <CloseButton
            size="2xs"
            className="close-button"
            opacity={0}
            visibility="hidden"
            transition="opacity 0.2s, visibility 0.2s"
            position="absolute"
            top={1}
            right={1}
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default Sidebar;
