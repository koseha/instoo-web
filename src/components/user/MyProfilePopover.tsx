import { User } from "@/stores/auth.store";
import {
  Button,
  DataList,
  Flex,
  PopoverArrow,
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
  Portal,
  Separator,
  Text,
  HStack,
} from "@chakra-ui/react";
import { BsPersonCircle } from "react-icons/bs";
import { FiUser, FiShield, FiCalendar } from "react-icons/fi";
import MyProfileModal from "./MyProfileModal";
import { useState } from "react";

interface MyProfilePopoverProps {
  user: User;
}

const MyProfilePopover: React.FC<MyProfilePopoverProps> = ({ user }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const profile = [
    {
      label: "닉네임",
      value: user.nickname,
      icon: <FiUser />,
    },
    {
      label: "사용자 유형",
      value: user.role === "USER" ? "일반유저" : "관리자",
      icon: <FiShield />,
    },
    {
      label: "가입일",
      value: new Date(user.createdAt).toLocaleDateString(),
      icon: <FiCalendar />,
    },
  ];

  const handleEditClick = () => {
    setIsPopoverOpen(false); // 팝오버 닫기
    setIsModalOpen(true); // 모달 열기
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <PopoverRoot
        open={isPopoverOpen}
        onOpenChange={({ open }) => setIsPopoverOpen(open)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            fontWeight="500"
            size="sm"
            color="neutral.600"
            _hover={{ color: "primary.black", bg: "neutral.100" }}
            fontFamily="body"
            gap={2}
          >
            <BsPersonCircle size={16} />
            {user.nickname}
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverPositioner>
            <PopoverContent p={4} w={280}>
              <PopoverArrow />
              <Flex direction="column" gap={4}>
                <Flex justify="flex-end">
                  <Button
                    fontWeight="300"
                    color="neutral.100"
                    fontFamily="body"
                    size="xs"
                    onClick={handleEditClick}
                  >
                    수정하기
                  </Button>
                </Flex>
                <Separator />
                <DataList.Root orientation="horizontal" gap={3}>
                  {profile.map((item) => (
                    <DataList.Item key={item.label}>
                      <DataList.ItemLabel
                        fontWeight="300"
                        fontSize="xs"
                        color={"neutral.500"}
                        minW="80px"
                      >
                        <HStack gap={2} justify="flex-start">
                          {item.icon}
                          <Text>{item.label}</Text>
                        </HStack>
                      </DataList.ItemLabel>
                      <Separator orientation="vertical" height="4" />
                      <DataList.ItemValue
                        fontWeight="300"
                        color="primary.black"
                        justifyContent="flex-end"
                      >
                        {item.value}
                      </DataList.ItemValue>
                    </DataList.Item>
                  ))}
                </DataList.Root>
              </Flex>
            </PopoverContent>
          </PopoverPositioner>
        </Portal>
      </PopoverRoot>
      <MyProfileModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
};

export default MyProfilePopover;
