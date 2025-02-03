import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Squares from "@/components/Squares";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SmoothOp",
  description: "Simplify and automate your job application process",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Add a fixed background container */}
          <div className="absolute inset-0 z-0">
            <Squares />
          </div>
          
          {/* Main content */}
          <div className="relative z-10">
            <Header />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

