"use client";

import { Button, Icon, Text, VStack } from "@chakra-ui/react";
import { AiOutlineHome } from "react-icons/ai";
import { GoPeople } from "react-icons/go";
import { MdAlarmAdd } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";

const SidebarMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      icon: AiOutlineHome,
      label: "홈",
      path: "/",
    },
    {
      icon: GoPeople,
      label: "방송인",
      path: "/streamers",
    },
    {
      icon: MdAlarmAdd,
      label: "일정 등록",
      path: "/schedule/create",
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
              gap={3}
              justifyContent="flex-start"
              px={3}
              onClick={() => handleNavigation(item.path)}
            >
              <Icon>
                <IconComponent />
              </Icon>
              {item.label}
            </Button>
          );
        })}
      </VStack>
    </>
  );
};

export default SidebarMenu;
