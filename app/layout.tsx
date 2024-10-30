import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Creatives Admin 2.0",
  description: "Creatives Admin Panel",
  icons: {
    icon: {
      url: "/logo/logo.png",
      type: "image/x-icon",
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
