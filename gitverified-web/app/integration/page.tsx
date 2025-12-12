import Header from "../components/Header";

export default function IntegrationPage() {
  return (
    <main className="min-h-screen pt-32 px-6 flex flex-col items-center">
      <Header />
      <h1 className="text-4xl font-bold mb-4">Integrations</h1>
      <p className="text-gray-400">Connect GitVerified with your existing ATS and workflows.</p>
    </main>
  );
}
