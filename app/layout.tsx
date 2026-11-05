import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://daikifujita.com"),
  title: "Daiki Fujita — Web & Interactive Designer",
  description:
    "Daiki Fujita is a Tokyo-based web and interactive designer. Guided by a shard of memory, exploring the boundary between code, space, and sensory storytelling.",
  keywords: [
    "Daiki Fujita",
    "Interactive Designer",
    "Creative Developer",
    "Tokyo",
    "WebGL",
    "Three.js",
    "Portfolio",
    "FWA of the Day",
  ],
  authors: [{ name: "Daiki Fujita", url: "https://daikifujita.com" }],
  openGraph: {
    title: "Daiki Fujita — Web & Interactive Designer",
    description:
      "A portfolio to be read two ways — awake, guided through the work by a single shard of memory, or asleep, as a 3D dream you play to win the work back.",
    url: "https://daikifujita.com",
    siteName: "Daiki Fujita Portfolio",
    images: [
      {
        url: "/images/1bkjcB7uulAIeieaHzJp5p1WdYU.jpg",
        width: 1200,
        height: 630,
        alt: "Daiki Fujita Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daiki Fujita — Web & Interactive Designer",
    description: "Web & Interactive Designer based in Tokyo.",
    creator: "@da_san333",
    images: ["/images/1bkjcB7uulAIeieaHzJp5p1WdYU.jpg"],
  },
  icons: {
    icon: "/images/eVYj6CNzGc62XpZaIv01nduVWdE.png",
    apple: "/images/roLES6HVvAZ1b2iqx3qK2NkfU.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Instrument+Serif:ital@0;1&family=Inter+Tight:ital,wght@0,300..700;1,300..700&family=Noto+Sans+JP:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#fafafa] text-[#111111]">
        {children}
      </body>
    </html>
  );
}
