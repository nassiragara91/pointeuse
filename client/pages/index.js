import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [pointages, setPointages] = useState([]);
  const [nom, setNom] = useState('');
  const [rapport, setRapport] = useState('');
  const router = useRouter();

  const fetchPointages = async () => {
    try {
      const res = await fetch('http://localhost:4000/pointages', { credentials: 'include' });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPointages(data);
      } else {
        console.error('Failed to fetch pointages');
      }
    } catch (error) {
      // If fetch fails (e.g., backend is down), redirect to login
      router.push('/login');
      console.error('Error fetching pointages:', error);
    }
  };

  useEffect(() => {
    fetchPointages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/pointages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, rapport }),
        credentials: 'include',
      });

      if (res.status === 201) {
        setNom('');
        setRapport('');
        fetchPointages(); // Refresh the list
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        console.error('Failed to create pointage');
      }
    } catch (error) {
      router.push('/login');
      console.error('Error creating pointage:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Feuille de Pointage</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ajouter un Pointage</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom de l'employé
              </label>
              <input
                type="text"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="rapport" className="block text-sm font-medium text-gray-700">
                Rapport
              </label>
              <textarea
                id="rapport"
                value={rapport}
                onChange={(e) => setRapport(e.target.value)}
                rows="3"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enregistrer
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Pointages Récents</h2>
          <ul className="space-y-4">
            {pointages.map((pointage) => (
              <li key={pointage.id} className="border-b border-gray-200 pb-4">
                <p className="text-lg font-semibold">{pointage.Employe.nom}</p>
                <p className="text-gray-600">{pointage.rapport}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(pointage.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
