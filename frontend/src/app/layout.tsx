"use client";
import queryClient from "@/config/queryClient";
import type React from "react";
import { useEffect } from "react";

import { Toaster } from "@/components/ui/sonner";
import { setNavigate } from "@/utils/navigation";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    setNavigate((route: string) => router.push(route));
  }, [router]);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
          <ReactQueryDevtools position="bottom" initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
