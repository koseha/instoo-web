// components/Tour.tsx
"use client";

import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useTour } from "@/hooks/useTour";

const tourSteps = [
  {
    selector: ".the-first-lesson",
    title: "간단히 안내해드릴게요 (1/4)",
    content: '"스트리머 목록"에서 스트리머 현황을 알 수 있어요!',
  },
  {
    selector: ".the-second-lesson",
    title: "간단히 안내해드릴게요 (2/4)",
    content: "인증된 스트리머를 검색한 후 관심 스트리머에 추가해보세요!",
  },
  {
    selector: ".the-third-lesson",
    title: "간단히 안내해드릴게요 (3/4)",
    content:
      '관심 스트리머에 추가된 스트리머는 "스트리머 일정"에서 일정을 조회할 수 있습니다!!',
  },
  {
    selector: ".the-fourth-lesson",
    title: "간단히 안내해드릴게요 (4/4)",
    content: "인증된 스트리머의 대략적인 일정을 등록해주세요!",
  },
];

export default function Tour() {
  const { step, isRunning, next, end } = useTour();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const previousTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 이전 요소에서 하이라이트 제거
    if (previousTargetRef.current) {
      previousTargetRef.current.classList.remove("tour-highlight");
    }

    if (!isRunning || step >= tourSteps.length) return;

    const { selector } = tourSteps[step];
    const target = document.querySelector(selector) as HTMLElement;

    if (target) {
      const rect = target.getBoundingClientRect();
      tooltipRef.current!.style.top = `${window.scrollY + rect.bottom + 12}px`;
      tooltipRef.current!.style.left = `${window.scrollX + rect.left}px`;

      // 하이라이트 적용
      target.classList.add("tour-highlight");
      previousTargetRef.current = target;
    }
  }, [step, isRunning]);

  // 컴포넌트 unmount 시 cleanup
  useEffect(() => {
    return () => {
      if (previousTargetRef.current) {
        previousTargetRef.current.classList.remove("tour-highlight");
      }
    };
  }, []);

  if (!isRunning || step >= tourSteps.length) return null;

  const { title, content } = tourSteps[step];

  return (
    <Box ref={tooltipRef} position="absolute" zIndex="popover">
      {/* Arrow */}
      <Box
        position="absolute"
        top="-8px"
        left="16px"
        width={0}
        height={0}
        borderLeft="8px solid transparent"
        borderRight="8px solid transparent"
        borderBottom="8px solid"
        borderBottomColor="blue.100"
      />
      <Box
        position="absolute"
        top="-7px"
        left="16px"
        width={0}
        height={0}
        borderLeft="8px solid transparent"
        borderRight="8px solid transparent"
        borderBottom="8px solid blue.100"
      />

      {/* Tooltip Content */}
      <Box
        bg="blue.100"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="lg"
        borderRadius="md"
        p={4}
        minW="240px"
      >
        <VStack align="start" gap={3}>
          <Text fontSize="sm" color="neutral.500">
            {title}
          </Text>
          <Text fontSize="sm" color="neutral.800">
            {content}
          </Text>
          <Box w="full" display="flex" justifyContent="flex-end" gap="2">
            <Button size="xs" variant="ghost" onClick={end}>
              건너뛰기
            </Button>
            <Button size="xs" colorScheme="blue" onClick={next}>
              {step === tourSteps.length - 1 ? "끝내기" : "다음"}
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
