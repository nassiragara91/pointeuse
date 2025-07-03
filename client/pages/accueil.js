import React, { useEffect, useState } from 'react';
import {
  ClockIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import axios from 'axios';

export default function Accueil() {
  const [nomUtilisateur, setNomUtilisateur] = useState('Utilisateur');
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupère le nom de l'utilisateur connecté
  useEffect(() => {
    axios.get('http://localhost:4000/me', { withCredentials: true })
      .then(res => setNomUtilisateur(res.data.nom))
      .catch(() => setNomUtilisateur('Utilisateur'));
  }, []);

  // Récupère les 5 dernières activités tous types confondus
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:4000/activites', { withCredentials: true })
      .then(res => setRecent(res.data))
      .catch(() => setRecent([]))
      .finally(() => setLoading(false));
  }, []);

  // Vérifie si un pointage du jour existe
  const today = new Date().toISOString().slice(0, 10);
  const hasTodayPointage = recent.some((a) => a.date === today);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <main className="max-w-5xl mx-auto">
        {/* Message de bienvenue */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
          Bienvenue {nomUtilisateur} 👋 Voici votre tableau de bord pour suivre vos pointages, rapports et documents.
        </h1>

        {/* Alerte pointage manquant */}
        {!hasTodayPointage && (
          <div className="flex items-center bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded mb-6 shadow">
            <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
            <span>🔔 Vous n'avez pas encore rempli votre pointage aujourd'hui.</span>
          </div>
        )}

        {/* Grille de raccourcis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Link href="/addPointage" className="bg-white rounded-xl shadow hover:shadow-lg p-6 flex flex-col items-center transition group">
            <ClockIcon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition" />
            <span className="mt-2 font-semibold text-gray-700">Ajouter un Pointage</span>
          </Link>
          <Link href="/rapports" className="bg-white rounded-xl shadow hover:shadow-lg p-6 flex flex-col items-center transition group">
            <DocumentTextIcon className="h-8 w-8 text-green-600 group-hover:scale-110 transition" />
            <span className="mt-2 font-semibold text-gray-700">Consulter mes Rapports</span>
          </Link>
          <Link href="/ged" className="bg-white rounded-xl shadow hover:shadow-lg p-6 flex flex-col items-center transition group">
            <FolderOpenIcon className="h-8 w-8 text-purple-600 group-hover:scale-110 transition" />
            <span className="mt-2 font-semibold text-gray-700">Accéder au GED</span>
          </Link>
          <Link href="#" className="bg-white rounded-xl shadow hover:shadow-lg p-6 flex flex-col items-center transition group">
            <ChartBarIcon className="h-8 w-8 text-pink-600 group-hover:scale-110 transition" />
            <span className="mt-2 font-semibold text-gray-700">Voir mes Statistiques</span>
          </Link>
        </div>

        {/* Activités récentes */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ClockIcon className="h-6 w-6 text-blue-500" />
            Activités récentes
          </h2>
          {loading ? (
            <div className="text-gray-500">Chargement...</div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <XCircleIcon className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 mb-4">Aucune activité récente trouvée.</p>
              <Link href="/addPointage" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                Ajouter / Consulter les Pointages
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">Type</th>
                    <th className="py-2 px-3 text-left">Projet/Document</th>
                    <th className="py-2 px-3 text-left">Heures/Version</th>
                    <th className="py-2 px-3 text-left">Rapport/Action</th>
                    <th className="py-2 px-3 text-left">Type de tâche</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((a) => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2 px-3">{a.date}</td>
                      <td className="py-2 px-3">{a.type}</td>
                      <td className="py-2 px-3">{a.projet || a.document || '-'}</td>
                      <td className="py-2 px-3">{a.heures || a.version || '-'}</td>
                      <td className="py-2 px-3">{a.type === 'Pointage' ? (a.rapport && a.rapport.length > 0 ? (<CheckCircleIcon className='h-5 w-5 text-green-500 inline' title='Rapport rempli' />) : (<XCircleIcon className='h-5 w-5 text-red-400 inline' title='Rapport manquant' />)) : a.type === 'Rapport' ? (a.rapport ? '✔' : '✖') : a.action || '-'}</td>
                      <td className="py-2 px-3">{a.typeTache || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/*
  - Remplace la variable nomUtilisateur par la vraie valeur (depuis le contexte utilisateur ou le backend).
  - Remplace la logique de récupération des activités récentes par un fetch réel.
  - Les icônes sont issues de Heroicons (installé avec @heroicons/react).
  - Design responsive, clair, professionnel.
*/
