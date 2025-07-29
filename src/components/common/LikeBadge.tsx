import { Box, Badge } from "@chakra-ui/react";
import { motion, useAnimationControls } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useCallback, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { ScheduleService } from "@/services/schedule.service";
import { useNotification } from "@/hooks/useNotifications";
import { useLikeStore } from "@/stores/schedule-like.store";

const MotionBox = motion(Box);

interface LikeBadgeProps {
  scheduleUuid: string;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
}

export default function LikeBadge({
  scheduleUuid,
  initialLikeCount = 0,
  initialIsLiked = false,
}: LikeBadgeProps) {
  const [showFloatHearts, setShowFloatHearts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const controls = useAnimationControls();
  const { showWarning } = useNotification();
  const { isAuthenticated } = useAuthStore();

  const { likedMap, likeCountMap, setLike } = useLikeStore();

  // 전역 상태가 있으면 그것 사용, 없으면 props 초기값 사용
  const isLiked = likedMap[scheduleUuid] ?? initialIsLiked;
  const likeCount = likeCountMap[scheduleUuid] ?? initialLikeCount;

  const handleClick = useCallback(async () => {
    if (isLoading) return;
    if (!isAuthenticated) {
      showWarning({ title: "로그인이 필요합니다" });
      return;
    }

    setIsLoading(true);

    try {
      controls.start({
        scale: [1, 1.5, 1],
        transition: { duration: 0.3 },
      });

      if (isLiked) {
        await ScheduleService.removeLike(scheduleUuid);
        setLike(scheduleUuid, false, likeCount - 1);
      } else {
        await ScheduleService.addLike(scheduleUuid);
        setLike(scheduleUuid, true, likeCount + 1);

        setShowFloatHearts(true);
        setTimeout(() => setShowFloatHearts(false), 600);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    isLiked,
    isLoading,
    scheduleUuid,
    isAuthenticated,
    likeCount,
    setLike,
    controls,
    showWarning,
  ]);

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
        // zIndex={0}
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
        variant="surface"
        colorPalette={isAuthenticated ? "purple" : "gray"}
        fontSize="10px"
        cursor={isLoading ? "not-allowed" : "pointer"}
        display="flex"
        alignItems="center"
        gap="1"
        onClick={handleClick}
        // zIndex={1}
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
          {isAuthenticated && isLiked ? <FaHeart /> : <FaRegHeart />}
        </MotionBox>
        {likeCount}
      </Badge>
    </Box>
  );
}
