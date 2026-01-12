import Header from "../components/Header";

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-32 px-6 flex flex-col items-center">
      <Header />
      <h1 className="text-4xl font-bold mb-4">Pricing</h1>
      <p className="text-gray-400">Flexible plans for teams of all sizes.</p>
    </main>
  );
}
