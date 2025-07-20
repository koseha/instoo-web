import { Box, Badge } from "@chakra-ui/react";
import { motion, useAnimationControls } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useCallback, useState } from "react";
import { useAuthStore } from "@/stores/auth.store"; // 인증 상태 확인용
import { ScheduleService } from "@/services/schedule.service";
import { useNotification } from "@/hooks/useNotifications";

const MotionBox = motion(Box);

interface LikeBadgeProps {
  scheduleUuid: string;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
  onLoginRequired?: () => void; // 로그인 필요시 콜백
}

export default function LikeBadge({
  scheduleUuid,
  initialLikeCount = 0,
  initialIsLiked = false,
}: LikeBadgeProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [showFloatHearts, setShowFloatHearts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const controls = useAnimationControls();
  const { showWarning } = useNotification();

  // 인증 상태 확인 (실제 스토어에 맞게 수정 필요)
  const { isAuthenticated } = useAuthStore();

  const handleClick = useCallback(async () => {
    if (isLoading) return;

    // 비회원인 경우
    if (!isAuthenticated) {
      showWarning({ title: "로그인이 필요합니다" });
      return;
    }

    setIsLoading(true);

    try {
      // 애니메이션 시작
      controls.start({
        scale: [1, 1.5, 1],
        transition: { duration: 0.3 },
      });

      if (isLiked) {
        // 좋아요 취소
        await ScheduleService.removeLike(scheduleUuid);
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        // 좋아요 추가
        await ScheduleService.addLike(scheduleUuid);
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);

        // 좋아요 추가시에만 하트 애니메이션
        setShowFloatHearts(true);
        setTimeout(() => setShowFloatHearts(false), 600);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);

      // // 401 에러인 경우 (토큰 만료 등)
      // if (error.response?.status === 401) {
      //   toast({
      //     title: "인증이 만료되었습니다",
      //     description: "다시 로그인해 주세요.",
      //     status: "error",
      //     duration: 3000,
      //     isClosable: true,
      //   });
      //   if (onLoginRequired) {
      //     onLoginRequired();
      //   }
      // } else {
      //   toast({
      //     title: "오류가 발생했습니다",
      //     description: "잠시 후 다시 시도해 주세요.",
      //     status: "error",
      //     duration: 3000,
      //     isClosable: true,
      //   });
      // }
    } finally {
      setIsLoading(false);
    }
  }, [scheduleUuid, isLiked, isLoading, controls, isAuthenticated]);

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
    <Box position="relative" display="inline-block">
      {showFloatHearts && floatHearts}

      <Badge
        colorPalette={isAuthenticated ? "purple" : "gray"}
        fontSize="10px"
        cursor={isLoading ? "not-allowed" : "pointer"}
        display="flex"
        alignItems="center"
        gap="1"
        onClick={handleClick}
        zIndex={1}
        position="relative"
        opacity={isLoading ? 0.6 : 1}
        title={!isAuthenticated ? "로그인이 필요합니다" : undefined}
      >
        <MotionBox
          animate={controls}
          display="flex"
          alignItems="center"
          as="span"
        >
          {/* 비회원은 항상 빈 하트, 회원은 실제 상태 */}
          {isAuthenticated && isLiked ? <FaHeart /> : <FaRegHeart />}
        </MotionBox>
        {likeCount}
      </Badge>
    </Box>
  );
}
