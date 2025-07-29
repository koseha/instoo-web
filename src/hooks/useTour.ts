// hooks/useTour.ts
import { useState } from "react";

export const useTour = () => {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const next = () => setStep((s) => s + 1);
  const end = () => setIsRunning(false);

  return { step, isRunning, next, end };
};
