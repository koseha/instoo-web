// hooks/useNotification.ts
import { toaster } from "@/components/ui/toaster";

interface NotificationOptions {
  message?: string;
  title: string;
  duration?: number; // 1000 = 1s
  closable?: boolean;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
}

export const useNotification = () => {
  const showSuccess = (options: NotificationOptions) => {
    toaster.create({
      title: options.title || "성공",
      description: options.message,
      type: "success",
      duration: options.duration || 2000,
      closable: options.closable ?? true,
    });
  };

  const showError = (options: NotificationOptions) => {
    toaster.create({
      title: options.title || "오류",
      description: options.message,
      type: "error",
      duration: options.duration || 4000,
      closable: options.closable ?? true,
    });
  };

  const showWarning = (options: NotificationOptions) => {
    toaster.create({
      title: options.title || "경고",
      description: options.message,
      type: "warning",
      duration: options.duration || 3000,
      closable: options.closable ?? true,
    });
  };

  const showInfo = (options: NotificationOptions) => {
    toaster.create({
      title: options.title || "정보",
      description: options.message,
      type: "info",
      duration: options.duration || 2000,
      closable: options.closable ?? true,
    });
  };

  const showLoading = (options: NotificationOptions) => {
    toaster.create({
      title: options.title || "로딩 중",
      description: options.message,
      type: "loading",
      duration: options.duration || 3000,
      closable: options.closable ?? false,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
  };
};
