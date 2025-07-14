// theme/index.ts
import { createSystem, defaultConfig } from "@chakra-ui/react";

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: {
          value:
            "'Inter',-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans KR', sans-serif",
        },
        body: {
          value:
            "'Pretendard',-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans KR', sans-serif",
        },
      },

      fontSizes: {
        xs: { value: "0.75rem" }, // 12px
        sm: { value: "0.875rem" }, // 14px
        md: { value: "1rem" }, // 16px
        lg: { value: "1.125rem" }, // 18px
        xl: { value: "1.25rem" }, // 20px
        "2xl": { value: "1.5rem" }, // 24px
        "3xl": { value: "1.875rem" }, // 30px
      },

      colors: {
        primary: {
          black: { value: "#000000" },
          white: { value: "#FFFFFF" },
        },
        neutral: {
          100: { value: "#F5F5F5" },
          200: { value: "#E5E5E5" },
          300: { value: "#D4D4D4" },
          400: { value: "#A3A3A3" },
          500: { value: "#737373" },
          600: { value: "#525252" },
          700: { value: "#404040" },
          800: { value: "#262626" },
          900: { value: "#171717" },
        },
        accent: {
          live: { value: "#000000" },
          break: { value: "#737373" },
          timeTbd: { value: "#A3A3A3" },
          success: { value: "#000000" },
          warning: { value: "#525252" },
        },
      },

      spacing: {
        1: { value: "0.25rem" }, // 4px
        2: { value: "0.5rem" }, // 8px
        3: { value: "0.75rem" }, // 12px
        4: { value: "1rem" }, // 16px
        5: { value: "1.25rem" }, // 20px
        6: { value: "1.5rem" }, // 24px
        8: { value: "2rem" }, // 32px
        10: { value: "2.5rem" }, // 40px
        12: { value: "3rem" }, // 48px
      },

      breakpoints: {
        sm: { value: "640px" },
        md: { value: "768px" },
        lg: { value: "1024px" },
        xl: { value: "1280px" },
      },
    },
  },

  globalCss: {
    "html, body": {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "neutral.700",
      backgroundColor: "primary.white",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans KR', sans-serif",
    },

    a: {
      color: "neutral.700",
      _hover: {
        textDecoration: "underline",
      },
    },

    "*::-webkit-scrollbar": {
      width: "8px",
    },
    "*::-webkit-scrollbar-track": {
      background: "neutral.100",
    },
    "*::-webkit-scrollbar-thumb": {
      background: "neutral.300",
      borderRadius: "4px",
    },

    h1: {
      fontWeight: "600",
      color: "primary.black",
      letterSpacing: "-0.01em",
      fontSize: "3xl",
    },
    h2: {
      fontWeight: "600",
      color: "primary.black",
      letterSpacing: "-0.01em",
      fontSize: "2xl",
    },
    h3: {
      fontWeight: "600",
      color: "primary.black",
      letterSpacing: "-0.01em",
      fontSize: "xl",
    },

    p: {
      fontWeight: "400",
      color: "neutral.700",
    },

    ".meta": {
      fontWeight: "400",
      color: "neutral.500",
      fontSize: "sm",
    },
  },
});

export default system;
