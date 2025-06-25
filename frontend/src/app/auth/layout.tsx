"use client";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  if (user && user.role == "ClIENT") {
    router.replace("/");
  } else if (user && user.role == "PRO") {
    router.replace("/dahboard");
  }
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col bg-white lg:max-w-2xl xl:max-w-5xl">
        {children}
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <main className="flex flex-col items-center justify-center px-6 py-20 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Services as it suits you.
          </h1>

          <p className="text-lg text-gray-600 mb-12 max-w-2xl">
            Une marketplace de service faite avec et pour les utilisateurs.
          </p>

          <div className="flex items-center gap-6 mb-20">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
              6 mois offerts
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Play className="w-4 h-4" />
              Watch video
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
