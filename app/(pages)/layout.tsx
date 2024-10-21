import type { Metadata } from "next";

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

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
