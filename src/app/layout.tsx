import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers as ReduxProvider } from "@/app/redux/Provider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthInitializer from "./components/auth/AuthInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrintNest",
  description: "Custom Printing Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthInitializer />
          <Navbar />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
