// app/layout.tsx

import { Providers } from "./providers";

export const metadata = {
  title: "Instoo",
  description: "Next.js with Chakra UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
