import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AddPointage() {
  const [pointages, setPointages] = useState([]);
  const [nom, setNom] = useState('');
  const [rapport, setRapport] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [typePointage, setTypePointage] = useState('affaire');
  const [project, setProject] = useState('');
  const [documentCode, setDocumentCode] = useState('');
  const [taskType, setTaskType] = useState('Conception');
  const router = useRouter();

  // Calculate total hours worked
  const getTotalHours = () => {
    if (!timeIn || !timeOut) return '';
    const [inH, inM] = timeIn.split(':').map(Number);
    const [outH, outM] = timeOut.split(':').map(Number);
    let start = new Date(date + 'T' + timeIn);
    let end = new Date(date + 'T' + timeOut);
    if (end < start) end.setDate(end.getDate() + 1); // handle overnight
    const diffMs = end - start;
    const hours = Math.floor(diffMs / 1000 / 60 / 60);
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    return `${hours}h ${minutes}m`;
  };

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
      const body = {
        nom,
        rapport,
        date,
        timeIn,
        timeOut,
        totalHours: getTotalHours(),
        typePointage,
        taskType,
        ...(typePointage === 'affaire' ? { project } : { documentCode }),
      };
      const res = await fetch('http://localhost:4000/pointages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (res.status === 201) {
        setNom('');
        setRapport('');
        setDate(new Date().toISOString().slice(0, 10));
        setTimeIn('');
        setTimeOut('');
        setProject('');
        setDocumentCode('');
        setTypePointage('affaire');
        fetchPointages();
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
        {/* Title: make it visible */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Feuille de Pointage</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          {/* Subtitle: make it visible */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Ajouter un Pointage</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-900 flex items-center gap-1">
                <span role="img" aria-label="user">👤</span> Nom de l'employé
              </label>
              <input
                type="text"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label htmlFor="rapport" className="block text-sm font-medium text-gray-900 flex items-center gap-1">
                <span role="img" aria-label="rapport">📝</span> Rapport
              </label>
              <textarea
                id="rapport"
                value={rapport}
                onChange={(e) => setRapport(e.target.value)}
                rows="3"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-900">
                  📅 Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  required
                />
              </div>
              <div>
                <label htmlFor="typePointage" className="block text-sm font-medium text-gray-900 flex items-center gap-1">
                  <span role="img" aria-label="choix">✅</span> Sélectionner le type de pointage
                </label>
                <select
                  id="typePointage"
                  value={typePointage}
                  onChange={e => setTypePointage(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  required
                >
                  <option value="affaire">Pointage sur Affaire</option>
                  <option value="document">Pointage sur Document</option>
                </select>
              </div>
              {typePointage === 'affaire' && (
                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-gray-900 flex items-center gap-1">
                    <span role="img" aria-label="projet">📂</span> Nom du projet
                  </label>
                  <input
                    type="text"
                    id="project"
                    value={project}
                    onChange={e => setProject(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                    placeholder="Nom du projet"
                    required
                  />
                </div>
              )}
              {typePointage === 'document' && (
                <div>
                  <label htmlFor="documentCode" className="block text-sm font-medium text-gray-900 flex items-center gap-1">
                    <span role="img" aria-label="document">📄</span> Nom ou code du document
                  </label>
                  <input
                    type="text"
                    id="documentCode"
                    value={documentCode}
                    onChange={e => setDocumentCode(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                    placeholder="Nom ou code du document"
                    required
                  />
                </div>
              )}
              <div>
                <label htmlFor="taskType" className="block text-sm font-medium text-gray-900 flex items-center gap-1">
                  <span role="img" aria-label="tache">📌</span> Type de tâche
                </label>
                <select
                  id="taskType"
                  value={taskType}
                  onChange={e => setTaskType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  required
                >
                  <option value="Conception">Conception</option>
                  <option value="Calcul technique">Calcul technique</option>
                  <option value="Revue documentaire">Revue documentaire</option>
                  <option value="Réunion client">Réunion client</option>
                  <option value="Déplacement terrain">Déplacement terrain</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeIn" className="block text-sm font-medium text-gray-900">
                  🕒 Heure d'entrée
                </label>
                <input
                  type="time"
                  id="timeIn"
                  value={timeIn}
                  onChange={(e) => setTimeIn(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  required
                />
              </div>
              <div>
                <label htmlFor="timeOut" className="block text-sm font-medium text-gray-900">
                  🕔 Heure de sortie
                </label>
                <input
                  type="time"
                  id="timeOut"
                  value={timeOut}
                  onChange={(e) => setTimeOut(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  ⏱️ Total heures travaillées (auto)
                </label>
                <input
                  type="text"
                  value={getTotalHours()}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm text-gray-900"
                  tabIndex={-1}
                />
              </div>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Pointages Récents</h2>
          <ul className="space-y-4">
            {pointages.map((pointage) => (
              <li key={pointage.id} className="border-b border-gray-200 pb-4">
                <p className="text-lg font-semibold text-gray-900">👤 {pointage.Employe?.nom || pointage.nom}</p>
                <p className="text-gray-700">📝 {pointage.rapport}</p>
                <div className="flex flex-wrap gap-4 text-sm mt-2 text-gray-700">
                  <span>📅 {pointage.date ? new Date(pointage.date).toLocaleDateString() : ''}</span>
                  <span>🕒 {pointage.timeIn || '-'}</span>
                  <span>🕔 {pointage.timeOut || '-'}</span>
                  <span>⏱️ {pointage.totalHours || '-'}</span>
                  <span>✅ {pointage.typePointage}</span>
                  <span>📌 {pointage.taskType}</span>
                  {pointage.typePointage === 'affaire' && pointage.project && (
                    <span>📂 {pointage.project}</span>
                  )}
                  {pointage.typePointage === 'document' && pointage.documentCode && (
                    <span>📄 {pointage.documentCode}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}