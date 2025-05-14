import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DBA - ClassCraft 🌍",
  description: "Development by GP: 11",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${cinzel.variable} antialiased`}
        /* className={`${geistSans.variable} ${geistMono.variable} antialiased`} */
      >
        {children}
      </body>
    </html>
  );
}
