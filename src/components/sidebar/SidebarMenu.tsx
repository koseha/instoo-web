import { Button, Icon, Text } from "@chakra-ui/react";
import { AiOutlineHome } from "react-icons/ai";
import { GoPeople } from "react-icons/go";
import { MdAlarmAdd } from "react-icons/md";

const SidebarMenu = () => {
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
      <Button
        variant="ghost"
        w="full"
        fontWeight="500"
        fontSize="md"
        size="lg"
        color="neutral.700"
        _hover={{ color: "primary.black", bg: "neutral.100" }}
        fontFamily="body"
        gap={3}
        justifyContent="flex-start"
        px={3}
      >
        <Icon>
          <AiOutlineHome />
        </Icon>
        홈
      </Button>
      <Button
        variant="ghost"
        w="full"
        fontWeight="500"
        fontSize="md"
        size="lg"
        color="neutral.700"
        _hover={{ color: "primary.black", bg: "neutral.100" }}
        fontFamily="body"
        gap={3}
        justifyContent="flex-start"
        px={3}
      >
        <Icon>
          <GoPeople />
        </Icon>
        방송인 목록
      </Button>
      <Button
        variant="ghost"
        w="full"
        fontWeight="500"
        fontSize="md"
        size="lg"
        color="neutral.700"
        _hover={{ color: "primary.black", bg: "neutral.100" }}
        fontFamily="body"
        gap={3}
        justifyContent="flex-start"
        px={3}
      >
        <Icon>
          <MdAlarmAdd />
        </Icon>
        일정 등록
      </Button>
    </>
  );
};

export default SidebarMenu;
