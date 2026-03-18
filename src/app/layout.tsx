import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ExpenseProvider } from "@/lib/expense-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Splitwise AI",
  description: "AI-powered expense splitting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-gray-100 min-h-screen`}>
        <ExpenseProvider>
          <div className="max-w-[480px] mx-auto bg-white min-h-screen relative">
            {children}
          </div>
        </ExpenseProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              maxWidth: "440px",
            },
          }}
        />
      </body>
    </html>
  );
}
