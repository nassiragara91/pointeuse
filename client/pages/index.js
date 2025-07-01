import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Bienvenue sur la Feuille de Pointage</h1>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <p className="mb-6 text-lg text-center">
            Utilisez le bouton ci-dessous pour ajouter un nouveau pointage ou consulter les pointages récents.
          </p>
          <Link
            href="/addPointage"
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ajouter / Consulter les Pointages
          </Link>
        </div>
      </main>
    </div>
  );
}