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

  // Set today's date
  const setToday = () => {
    setDate(new Date().toISOString().slice(0, 10));
  };

  // Validate time input
  const validateTime = (newTime, isTimeOut = false) => {
    if (!timeIn || !newTime) return true;
    if (isTimeOut && newTime <= timeIn) {
      alert('L\'heure de sortie doit être postérieure à l\'heure d\'entrée');
      return false;
    }
    return true;
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations générales */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🔹</span> Informations générales
              </h3>
              <div className="space-y-4">
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
                  <label htmlFor="date" className="block text-sm font-medium text-gray-900">
                    📅 Date
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1 block flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={setToday}
                      className="mt-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Aujourd'hui
                    </button>
                  </div>
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
              </div>
            </div>

            {/* Projet/Document */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🔸</span> Projet/Document
              </h3>
              <div className="space-y-4">
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
              </div>
            </div>

            {/* Temps */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🕒</span> Temps
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="timeIn" className="block text-sm font-medium text-gray-900">
                      🕒 Heure d'entrée
                    </label>
                    <input
                      type="time"
                      id="timeIn"
                      value={timeIn}
                      onChange={(e) => {
                        const newTime = e.target.value;
                        if (validateTime(newTime)) {
                          setTimeIn(newTime);
                        }
                      }}
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
                      onChange={(e) => {
                        const newTime = e.target.value;
                        if (validateTime(newTime, true)) {
                          setTimeOut(newTime);
                        }
                      }}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                      required
                    />
                  </div>
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
            </div>

            {/* Rapport */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>📝</span> Rapport
              </h3>
              <div>
                <label htmlFor="rapport" className="block text-sm font-medium text-gray-900 flex items-center gap-1">
                  <span role="img" aria-label="rapport">📝</span> Rapport
                </label>
                <textarea
                  id="rapport"
                  value={rapport}
                  onChange={(e) => setRapport(e.target.value)}
                  rows="3"
                  maxLength="300"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                  placeholder="Décrivez le travail effectué..."
                  required
                ></textarea>
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {rapport.length}/300 caractères
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="w-full max-w-md bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-lg font-medium transition-colors"
              >
                Enregistrer le Pointage
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Pointages Récents</h2>
          <ul className="space-y-6">
            {pointages.map((pointage) => (
              <li key={pointage.id} className="bg-gray-50 shadow rounded-lg p-4">
                <p className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  👤 {pointage.Employe?.nom || pointage.nom}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {/* Badge type de pointage */}
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold
                    ${pointage.typePointage === 'affaire' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                  >
                    {pointage.typePointage === 'affaire' ? 'Affaire' : 'Document'}
                  </span>
                  {/* Badge type de tâche */}
                  {pointage.taskType && (
                    <span className="inline-block px-2 py-0.5 rounded bg-violet-100 text-violet-800 text-xs font-semibold">
                      {pointage.taskType}
                    </span>
                  )}
                  {/* Badge projet/document */}
                  {pointage.typePointage === 'affaire' && pointage.project && (
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-200 text-blue-900 text-xs font-semibold">
                      📂 {pointage.project}
                    </span>
                  )}
                  {pointage.typePointage === 'document' && pointage.documentCode && (
                    <span className="inline-block px-2 py-0.5 rounded bg-green-200 text-green-900 text-xs font-semibold">
                      📄 {pointage.documentCode}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm mt-2 text-gray-700">
                  <span>📅 {pointage.date ? new Date(pointage.date).toLocaleDateString() : ''}</span>
                  <span>🕒 {pointage.timeIn || '-'}</span>
                  <span>🕔 {pointage.timeOut || '-'}</span>
                  <span>⏱️ {pointage.totalHours || '-'}</span>
                </div>
                <p className="text-gray-700 mt-2 text-sm">
                  📝 {pointage.rapport}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}