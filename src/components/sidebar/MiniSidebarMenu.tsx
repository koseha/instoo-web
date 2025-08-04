"use client";

import { Button, Icon, Text, VStack } from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";
import { GoPeople } from "react-icons/go";
import { MdAlarmAdd } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { useScheduleDialogStore } from "@/stores/schedule-editor.store";
import { useAuthStore } from "@/stores/auth.store";

const MiniSidebarMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { openScheduleCreate } = useScheduleDialogStore();
  const { isAuthenticated } = useAuthStore();

  const menuItems = [
    {
      icon: FiHome,
      label: "홈",
      path: "/",
      modal: false,
      disabled: false,
      action: () => router.push("/"),
    },
    {
      icon: LuCalendarDays,
      label: "관심 일정",
      path: "/schedules",
      modal: false,
      disabled: false,
      action: () => router.push("/schedules"),
    },
    {
      icon: GoPeople,
      label: "스트리머",
      path: "/streamers",
      modal: false,
      disabled: false,
      action: () => router.push("/streamers"),
      classNames: "the-first-lesson",
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
      classNames: "the-fourth-lesson",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <VStack gap={4} w="full">
      {menuItems.map((item) => {
        const IconComponent = item.icon;
        const active = isActive(item.path);

        return (
          <Button
            key={item.path}
            variant="ghost"
            w="full"
            className={item.classNames}
            fontWeight="500"
            color={active ? "primary.black" : "neutral.700"}
            bg={active ? "neutral.100" : "transparent"}
            onClick={item.action}
            disabled={item.disabled || (item.needAuth && !isAuthenticated)}
            _hover={{
              color: "primary.black",
              bg: "neutral.100",
            }}
          >
            <VStack gap={0}>
              <Icon>
                <IconComponent />
              </Icon>
              <Text fontFamily="body" fontSize="xs">
                {item.label}
              </Text>
            </VStack>
          </Button>
        );
      })}
    </VStack>
  );
};

export default MiniSidebarMenu;
