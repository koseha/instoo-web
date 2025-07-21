import React, { useCallback, useState } from "react";
import {
  Dialog,
  Portal,
  Box,
  Text,
  Button,
  HStack,
  VStack,
  CloseButton,
  Spinner,
  Icon,
  Badge,
  Grid,
  Field,
  Separator,
  AvatarRoot,
  AvatarImage,
} from "@chakra-ui/react";
import { ScheduleResponse, ScheduleService } from "@/services/schedule.service";
import { MdVerified } from "react-icons/md";
import { FaCalendarDay } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import {
  formatDateToKoreanDate,
  formatUTCToKoreanDateTime,
} from "@/utils/time.utils";
import { motion, useAnimationControls } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuthStore } from "@/stores/auth.store";
import { useNotification } from "@/hooks/useNotifications";
import { useLikeStore } from "@/stores/schedule-like.store";
import { FaRegEdit } from "react-icons/fa";

const MotionBox = motion(Box);

interface ScheduleDetailDialogProps {
  scheduleUuid: string;
  children: React.ReactNode;
}

const ScheduleDetailDialog: React.FC<ScheduleDetailDialogProps> = ({
  scheduleUuid,
  children,
}) => {
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { showWarning } = useNotification();
  const controls = useAnimationControls();

  const { setLike } = useLikeStore();

  const [liked, setLiked] = useState(false);
  const [initialLiked, setInitialLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showFloatHearts, setShowFloatHearts] = useState(false);

  const fetchScheduleDetail = async (
    uuid: string,
  ): Promise<ScheduleResponse> => {
    return await ScheduleService.getStreamerScheduleDetail(uuid);
  };

  const handleLikeToggle = useCallback(() => {
    if (!isAuthenticated) {
      showWarning({ title: "로그인이 필요합니다" });
      return;
    }

    controls.start({
      scale: [1, 1.5, 1],
      transition: { duration: 0.3 },
    });

    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      setShowFloatHearts(true);
      setTimeout(() => setShowFloatHearts(false), 600);
    }
  }, [liked, isAuthenticated, controls, showWarning]);

  // 모달 닫힐 때 서버 반영 및 전역 상태 업데이트
  const handleClose = async () => {
    if (!schedule) return;

    try {
      if (liked !== initialLiked) {
        if (liked) {
          await ScheduleService.addLike(scheduleUuid);
        } else {
          await ScheduleService.removeLike(scheduleUuid);
        }
        setLike(scheduleUuid, liked, likeCount); // 전역 상태 업데이트
      }
    } catch (err) {
      console.error("좋아요 반영 실패", err);
    } finally {
      setSchedule(null);
      setLiked(false);
      setInitialLiked(false);
    }
  };

  const floatHearts = [0, 1, 2].map((i) => {
    const offsetX = [-10, 0, 10][i];
    const delay = i * 0.05;

    return (
      <MotionBox
        key={i}
        position="absolute"
        top="0"
        left="0"
        color="red.400"
        zIndex={0}
        initial={{ y: 0, opacity: 0, scale: 0.6, x: offsetX }}
        animate={{
          y: -40,
          opacity: [0.6, 0],
          scale: [0.6, 1],
          transition: {
            duration: 0.6,
            delay,
            ease: "easeOut",
          },
        }}
        pointerEvents="none"
      >
        <FaHeart />
      </MotionBox>
    );
  });

  return (
    <Dialog.Root
      // size={{ base: "full", md: "lg" }}
      size="sm"
      placement="center"
      motionPreset="slide-in-bottom"
      onOpenChange={(details) => {
        if (details.open && scheduleUuid) {
          setLoading(true);
          fetchScheduleDetail(scheduleUuid)
            .then((data) => {
              setSchedule(data);
              setLikeCount(data.likeCount);
              setLiked(data.isLiked);
              setInitialLiked(data.isLiked);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
        } else if (!details.open) {
          handleClose();
        }
      }}
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content overflow="hidden">
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>

            {loading ? (
              <Box p={8} textAlign="center">
                <Spinner size="lg" color="gray.600" />
                <Text mt={4} color="gray.600">
                  로딩 중...
                </Text>
              </Box>
            ) : schedule ? (
              <>
                {/* 다이얼로그 헤더 */}
                <Dialog.Header p={8} pb={6}>
                  <VStack align="flex-start" gap={6}>
                    {/* 방송인 정보 */}
                    <HStack gap={4}>
                      <AvatarRoot size="lg">
                        <AvatarImage src="https://bit.ly/naruto-sage" />
                      </AvatarRoot>
                      <Box>
                        <HStack gap={2}>
                          <Dialog.Title
                            fontSize="lg"
                            fontWeight="600"
                            color="black"
                          >
                            {schedule.streamer.name}
                          </Dialog.Title>
                          <Icon size="sm" color="blue.600">
                            <MdVerified />
                          </Icon>
                        </HStack>
                      </Box>
                    </HStack>

                    {/* 스케줄 제목 */}
                    <Text fontSize="2xl" fontWeight="700" color="black">
                      {schedule.title}
                    </Text>

                    {/* 메타 정보 */}
                    <HStack gap={6} wrap="wrap">
                      <HStack gap={2} color="gray.600" fontSize="sm">
                        <FaCalendarDay />
                        <Text>
                          {formatDateToKoreanDate(schedule.scheduleDate)}
                        </Text>
                      </HStack>

                      {schedule.startTime && (
                        <HStack gap={2} color="gray.600" fontSize="sm">
                          <FaRegClock />
                          <Text>{schedule.startTime}</Text>
                        </HStack>
                      )}

                      <Badge>뱃지</Badge>
                    </HStack>
                  </VStack>
                </Dialog.Header>

                <Separator />

                {/* 다이얼로그 본문 */}
                <Dialog.Body px={8} py={4} overflow="auto">
                  <VStack align="flex-start" gap={10}>
                    {/* 설명 */}
                    <Field.Root>
                      <Field.Label color="gray.800">상세 일정</Field.Label>
                      {schedule.description ? (
                        <Text fontSize="sm" color="gray.500" lineHeight="1.7">
                          {schedule.description}
                        </Text>
                      ) : (
                        <Text fontSize="sm" color="gray.500">
                          입력된 상세 일정이 없습니다
                        </Text>
                      )}
                    </Field.Root>

                    {/* 액션 버튼들 */}
                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={4}
                      w="full"
                    >
                      <Box position="relative">
                        {showFloatHearts && floatHearts}

                        <Button
                          onClick={handleLikeToggle}
                          size="md"
                          bg={liked ? "red.500" : "black"}
                          color="white"
                          transition="all 0.2s"
                          display="flex"
                          gap={2}
                          w="full"
                        >
                          <MotionBox
                            animate={controls}
                            display="flex"
                            alignItems="center"
                            as="span"
                          >
                            {isAuthenticated && liked ? (
                              <FaHeart />
                            ) : (
                              <FaRegHeart />
                            )}
                          </MotionBox>
                          좋아요 {likeCount}
                        </Button>
                      </Box>
                      <Button
                        variant="outline"
                        size="md"
                        borderColor="gray.300"
                        color="gray.700"
                      >
                        <FaRegEdit /> 수정하기
                      </Button>
                    </Grid>
                  </VStack>
                </Dialog.Body>

                {/* 다이얼로그 푸터 */}
                <Dialog.Footer
                  p={6}
                  bg="gray.50"
                  borderTop="1px solid"
                  borderColor="gray.100"
                >
                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={4}
                    w="full"
                  >
                    <Box fontSize="xs" color="gray.500">
                      <HStack gap={2} mb={1}>
                        <Text>작성자:</Text>
                        <Text fontWeight="600">
                          {schedule.createdBy?.nickname}
                        </Text>
                      </HStack>
                      <Text>
                        {formatUTCToKoreanDateTime(schedule.createdAt)} 작성
                      </Text>
                    </Box>

                    <Box fontSize="xs" color="gray.500">
                      <HStack gap={2} mb={1}>
                        <Text>최근 수정:</Text>
                        <Text fontWeight="600">
                          {schedule.updatedBy?.nickname}
                        </Text>
                      </HStack>
                      <Text>
                        {formatUTCToKoreanDateTime(schedule.updatedAt)} 수정 (v
                        {schedule.version})
                      </Text>
                    </Box>
                  </Grid>
                </Dialog.Footer>
              </>
            ) : (
              <Box p={8} textAlign="center">
                <Text color="gray.600">데이터를 불러올 수 없습니다.</Text>
              </Box>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ScheduleDetailDialog;
