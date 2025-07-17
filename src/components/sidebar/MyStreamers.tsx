import { useMyStreamersStore } from "@/stores/my-streamers.store";
import {
  Text,
  Flex,
  IconButton,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
  Button,
} from "@chakra-ui/react";
import { FaRedo } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import MyStreamersCard from "./MyStreamers.card";

const MyStreamers = () => {
  const { streamers, remove } = useMyStreamersStore();

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={1}>
        <Text fontSize="sm" color="neutral.500" fontFamily="heading">
          My Streamers
        </Text>
        <IconButton
          size="xs"
          variant="ghost"
          _hover={{
            bg: "neutral.100",
            transform: "rotate(180deg)",
            color: "neutral.700",
          }}
          transition="all 0.3s ease"
          borderRadius="full"
          color="neutral.400"
        >
          <FaRedo />
        </IconButton>
      </Flex>

      <AccordionRoot variant="subtle" collapsible>
        {streamers.map((streamer) => (
          <AccordionItem
            key={streamer.uuid}
            value={streamer.uuid}
            _hover={{
              bg: "neutral.100",
            }}
          >
            <AccordionItemTrigger p={2}>
              <MyStreamersCard key={streamer.uuid} streamer={streamer} />
            </AccordionItemTrigger>
            <AccordionItemContent px={2}>
              <Flex
                gap={2}
                py={1}
                bg="neutral.50"
                borderRadius="md"
                justify="flex-end"
              >
                <Button
                  size="2xs"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => remove(streamer.uuid)}
                >
                  <LuTrash2 /> 제거하기
                </Button>
              </Flex>
            </AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </>
  );
};

export default MyStreamers;
