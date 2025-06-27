"use client";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "../../components/common/Sidebar";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="flex">
          <Sidebar />
          <main className="flex-1">{children}</main>
          <Toaster />
        </div>
  );
}
