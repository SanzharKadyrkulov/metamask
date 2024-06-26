import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Container } from "@mui/material";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MetaMask Wallet | Test Task",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <Container maxWidth="md">{children}</Container>
        </main>
      </body>
    </html>
  );
}
