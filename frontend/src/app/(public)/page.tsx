import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-semibold text-gray-900">Services</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              Se connecter / S'inscrire
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
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

      {/* Trust Section */}
      <section className="flex flex-col items-center px-6 py-12">
        <p className="text-gray-600 mb-8">Ils nous font confiance.</p>

        <div className="flex items-center justify-center gap-12 max-w-4xl mx-auto opacity-60">
          {/* MATCH Logo */}
          <div className="text-2xl font-bold text-gray-800 tracking-wider">
            MATCH
          </div>

          {/* SYLARION Logo */}
          <div className="text-2xl font-bold text-gray-800 tracking-wider">
            SYLARION
          </div>

          {/* Placeholder logos */}
          <div className="w-16 h-8 bg-gray-300 rounded"></div>
          <div className="w-16 h-8 bg-gray-800 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">LOGO</span>
          </div>
        </div>
      </section>
    </div>
  );
}
