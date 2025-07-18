import { useState } from "react";
import { useMyStreamersStore } from "@/stores/my-streamers.store";
import {
  Text,
  Flex,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
  Button,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import MyStreamersCard from "./MyStreamers.card";
import { StreamerSimpleResponse } from "@/services/streamer.service";

const MyStreamers = () => {
  const { streamers, remove } = useMyStreamersStore();
  const [selectedStreamer, setSelectedStreamer] =
    useState<StreamerSimpleResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRemoveClick = (streamer: StreamerSimpleResponse) => {
    setSelectedStreamer(streamer);
    setIsDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    if (selectedStreamer) {
      remove(selectedStreamer.uuid);
      setIsDialogOpen(false);
      setSelectedStreamer(null);
    }
  };

  const handleCancelRemove = () => {
    setIsDialogOpen(false);
    setSelectedStreamer(null);
  };

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={1}>
        <Text fontSize="sm" color="neutral.500" fontFamily="heading">
          My Streamers
        </Text>
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
                  onClick={() => handleRemoveClick(streamer)}
                >
                  <LuTrash2 /> 제거하기
                </Button>
              </Flex>
            </AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>

      {/* 제거 확인 다이얼로그 */}
      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={(details) => setIsDialogOpen(details.open)}
        size="sm"
        modal={false}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>스트리머 제거 확인</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>
                  <strong>{selectedStreamer?.name}</strong>을(를) 목록에서
                  제거하시겠습니까?
                </p>
                <p className="meta" style={{ marginTop: "8px" }}>
                  이 작업은 되돌릴 수 없습니다.
                </p>
                <p className="meta" style={{ marginTop: "4px" }}>
                  팔로우한 스트리머의 경우 팔로우가 취소됩니다.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={handleCancelRemove}>
                  취소
                </Button>
                <Button colorPalette="red" onClick={handleConfirmRemove}>
                  제거
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default MyStreamers;
