// hooks/useTour.ts
import { useState, useEffect } from "react";

const TOUR_STEPS_LENGTH = 4;

export const useTour = () => {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false); // ✅ false로 변경

  useEffect(() => {
    const seenTour = localStorage.getItem("hasSeenTour");
    if (!seenTour) {
      setIsRunning(true); // 안 본 경우에만 투어 시작
    }
  }, []);

  const next = () => {
    const nextStep = step + 1;
    if (nextStep >= TOUR_STEPS_LENGTH) {
      // 마지막 단계에 도달하면 투어 종료 및 localStorage 저장
      setIsRunning(false);
      localStorage.setItem("hasSeenTour", "true");
    } else {
      setStep(nextStep);
    }
  };
  const end = () => {
    setIsRunning(false);
    localStorage.setItem("hasSeenTour", "true"); // 여기서 저장
  };

  return { step, isRunning, next, end };
};
