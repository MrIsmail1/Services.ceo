export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Plateforme de Services IA</h1>
        {children}
      </main>
    </div>
  );
} 