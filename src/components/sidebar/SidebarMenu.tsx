"use client";

import { Button, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { AiOutlineHome } from "react-icons/ai";
import { GoPeople } from "react-icons/go";
import { MdAlarmAdd } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import { FaRegListAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { useScheduleDialogStore } from "@/stores/schedule-editor.store";
import { LuCalendarDays } from "react-icons/lu";
import { useAuthStore } from "@/stores/auth.store";

const SidebarMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { openScheduleCreate } = useScheduleDialogStore();
  const { isAuthenticated } = useAuthStore();

  const menuItems = [
    {
      icon: LuCalendarDays,
      label: "스트리머 일정",
      path: "/schedules",
      modal: false,
      disabled: false,
      action: () => router.push("/schedules"),
    },
    {
      icon: AiOutlineHome,
      label: "이벤트 일정",
      path: "/events",
      modal: false,
      disabled: true,
      tooltipMessage: "이후 도입될 예정입니다",
      action: () => router.push("/events"),
    },
    {
      icon: GoPeople,
      label: "방송인",
      path: "/streamers",
      modal: false,
      disabled: false,
      action: () => router.push("/streamers"),
    },
    {
      icon: FaRegListAlt,
      label: "내 활동",
      path: "/activity",
      modal: false,
      disabled: true,
      tooltipMessage: "이후 도입될 예정입니다",
      action: () => router.push("/activity"),
    },
    {
      icon: MdAlarmAdd,
      label: "일정 등록",
      path: "/schedule/create",
      modal: true,
      disabled: false,
      action: openScheduleCreate,
      needAuth: true,
      tooltipMessage: "로그인 후 이용할 수 있어요",
    },
  ];

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
          if (item.disabled) return;
          const IconComponent = item.icon;
          const active = isActive(item.path);

          return (
            <Tooltip
              key={item.path}
              disabled={!(item.disabled || (item.needAuth && !isAuthenticated))}
              content={item.tooltipMessage}
              positioning={{ placement: "right" }}
            >
              <Button
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
                onClick={item.action}
                disabled={item.disabled || (item.needAuth && !isAuthenticated)}
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
            </Tooltip>
          );
        })}
      </VStack>
    </>
  );
};

export default SidebarMenu;
