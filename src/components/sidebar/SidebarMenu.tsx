"use client";

import { Button, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { AiOutlineHome } from "react-icons/ai";
import { GoPeople } from "react-icons/go";
import { MdAlarmAdd } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import { FaRegListAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

const SidebarMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      icon: AiOutlineHome,
      label: "홈",
      path: "/",
      modal: false,
    },
    {
      icon: GoPeople,
      label: "방송인",
      path: "/streamers",
      modal: false,
    },
    {
      icon: FaRegListAlt,
      label: "내 활동",
      path: "/activity",
      modal: false,
    },
    {
      icon: MdAlarmAdd,
      label: "일정 등록",
      path: "/schedule/create",
      modal: true,
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <Text
        fontSize="sm"
        color="neutral.500"
        fontFamily="heading"
        paddingBottom={2}
      >
        Menu
      </Text>
      <VStack align="stretch" gap="4px">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);

          return (
            <Button
              key={item.path}
              variant="ghost"
              w="full"
              fontWeight="500"
              fontSize="md"
              size="lg"
              color={active ? "primary.black" : "neutral.700"}
              bg={active ? "neutral.100" : "transparent"}
              _hover={{
                color: "primary.black",
                bg: "neutral.100",
              }}
              fontFamily="body"
              justifyContent="space-between"
              px={3}
              onClick={() => handleNavigation(item.path)}
            >
              <Flex justifyContent="flex-start" alignItems="center" gap={3}>
                <Icon size="md">
                  <IconComponent />
                </Icon>
                {item.label}
              </Flex>
              {item.modal && (
                <Icon as={FaRegEdit} boxSize={3} color="gray.500" />
              )}
            </Button>
          );
        })}
      </VStack>
    </>
  );
};

export default SidebarMenu;
