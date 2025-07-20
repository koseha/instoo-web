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
  HStack,
} from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import { BiDetail } from "react-icons/bi";
import MyStreamersCard from "./MyStreamers.card";
import StreamerDetailDialog from "../streamer/StreamerDetailDialog";
import {
  StreamerService,
  StreamerSimpleResponse,
} from "@/services/streamer.service";
import { Streamer } from "@/types/interfaces/streamer.interface";
import { InfoTip } from "../ui/toggle-tip";

const MyStreamers = () => {
  const { streamers, remove } = useMyStreamersStore();

  // 제거 다이얼로그 관련 상태
  const [selectedStreamerForRemove, setSelectedStreamerForRemove] =
    useState<StreamerSimpleResponse | null>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  // 상세보기 다이얼로그 관련 상태
  const [selectedStreamerForDetail, setSelectedStreamerForDetail] =
    useState<Streamer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // API에서 스트리머 상세 정보를 가져오는 함수
  const fetchStreamerDetail = async (
    uuid: string,
  ): Promise<Streamer | null> => {
    try {
      const data = StreamerService.getStreamerDetail(uuid);

      return data;
    } catch (error) {
      console.error("Error fetching streamer detail:", error);
      return null;
    }
  };

  // 상세보기 버튼 클릭 핸들러
  const handleDetailClick = async (streamer: StreamerSimpleResponse) => {
    setIsLoadingDetail(true);
    const detailData = await fetchStreamerDetail(streamer.uuid);
    setIsLoadingDetail(false);

    if (detailData) {
      setSelectedStreamerForDetail(detailData);
      setIsDetailDialogOpen(true);
    }
  };

  // 제거 버튼 클릭 핸들러
  const handleRemoveClick = (streamer: StreamerSimpleResponse) => {
    setSelectedStreamerForRemove(streamer);
    setIsRemoveDialogOpen(true);
  };

  // 제거 확인 핸들러
  const handleConfirmRemove = () => {
    if (selectedStreamerForRemove) {
      remove(selectedStreamerForRemove.uuid);
      setIsRemoveDialogOpen(false);
      setSelectedStreamerForRemove(null);
    }
  };

  // 제거 취소 핸들러
  const handleCancelRemove = () => {
    setIsRemoveDialogOpen(false);
    setSelectedStreamerForRemove(null);
  };

  // 상세보기 다이얼로그 닫기 핸들러
  const handleDetailDialogClose = () => {
    setIsDetailDialogOpen(false);
    setSelectedStreamerForDetail(null);
  };

  return (
    <>
      <HStack justify="start">
        <Text fontSize="sm" color="neutral.500" fontFamily="heading">
          My Streamers
        </Text>
        <InfoTip
          content={
            <>
              스트리머 일정을 확인할 수 있어요.
              <br />
              팔로우는 별도의 페이지에서 관리돼요.
              <br />
              일반 회원은 자신의 팔로우 목록도 함께 보여집니다.
            </>
          }
          positioning={{ placement: "right" }}
          size="xs"
        />
      </HStack>

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
              <Flex py={1} bg="neutral.50" borderRadius="md" justify="flex-end">
                <Button
                  size="2xs"
                  variant="ghost"
                  colorPalette="blue"
                  onClick={() => handleDetailClick(streamer)}
                  loading={isLoadingDetail}
                >
                  <BiDetail />
                  상세보기
                </Button>
                <Button
                  size="2xs"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => handleRemoveClick(streamer)}
                >
                  <LuTrash2 />
                  제거하기
                </Button>
              </Flex>
            </AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>

      {/* 스트리머 상세보기 다이얼로그 */}
      <StreamerDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={handleDetailDialogClose}
        streamer={selectedStreamerForDetail}
      />

      {/* 제거 확인 다이얼로그 */}
      <Dialog.Root
        open={isRemoveDialogOpen}
        onOpenChange={(details) => setIsRemoveDialogOpen(details.open)}
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
                  <strong>{selectedStreamerForRemove?.name}</strong>을(를)
                  목록에서 제거하시겠습니까?
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
