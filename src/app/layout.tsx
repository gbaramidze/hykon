import type { Metadata } from "next";
import { StoreProvider } from "@/context/StoreContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "HYKON.GE — Интернет-магазин премиальной техники и электроники в Грузии",
  description:
    "Официальный онлайн-магазин премиальной техники в Тбилиси и Грузии: Apple MacBook, iPhone, видеокарты RTX, PlayStation 5, OLED телевизоры, аудиотехника Sony и умный дом Dyson. Быстрая доставка и официальная гарантия.",
  keywords: "купить технику в Тбилиси, Apple Грузия, MacBook Pro, iPhone 16 Pro Max, RTX 4090, Sony WH-1000XM5, Hykon ge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="min-h-screen bg-white text-zinc-950 font-sans antialiased flex flex-col">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
