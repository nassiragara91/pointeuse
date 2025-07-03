import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Rapports() {
  const [rapport, setRapport] = useState('');
  const [touched, setTouched] = useState(false);
  const [pointages, setPointages] = useState([]);
  const [selectedPointage, setSelectedPointage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [nomEmploye, setNomEmploye] = useState('');
  const [projet, setProjet] = useState('');
  const [typeTache, setTypeTache] = useState('');
  const [dateRapport, setDateRapport] = useState(() => new Date().toISOString().slice(0, 10));
  const [typePointage, setTypePointage] = useState('');

  const minLength = 10;
  const maxLength = 1000;
  const isValid = rapport.length >= minLength && rapport.length <= maxLength && nomEmploye.trim().length > 0;
  const showError = touched && !isValid;

  useEffect(() => {
    axios.get('http://localhost:4000/pointages', { withCredentials: true })
      .then(res => setPointages(res.data))
      .catch(() => setPointages([]));
  }, []);

  const handleChange = (e) => {
    setRapport(e.target.value);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleSelect = (e) => {
    setSelectedPointage(e.target.value);
  };

  const handleNomChange = (e) => {
    setNomEmploye(e.target.value);
  };

  const handleProjetChange = (e) => {
    setProjet(e.target.value);
  };

  const handleTypeTacheChange = (e) => {
    setTypeTache(e.target.value);
  };

  const handleDateRapportChange = (e) => {
    setDateRapport(e.target.value);
  };

  const handleTypePointageChange = (e) => {
    setTypePointage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setMessage('');
    if (!isValid) return;
    setLoading(true);
    try {
      if (selectedPointage) {
        await axios.put(`http://localhost:4000/pointages/${selectedPointage}`, { rapport }, { withCredentials: true });
        setMessage('Rapport lié au pointage avec succès !');
      } else {
        await axios.post('http://localhost:4000/rapports', {
          nom_employe: nomEmploye,
          contenu: rapport,
          projet,
          type_tache: typeTache,
          date_rapport: dateRapport,
          type_pointage: typePointage,
        }, { withCredentials: true });
        setMessage('Rapport libre soumis avec succès !');
      }
      setRapport('');
      setTouched(false);
      setSelectedPointage('');
      setProjet('');
      setTypeTache('');
      setDateRapport(new Date().toISOString().slice(0, 10));
      setTypePointage('');
    } catch (err) {
      setMessage("Erreur lors de l'envoi du rapport");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Rapport de travail</h2>
        <label htmlFor="nomEmploye" className="block text-gray-700 font-medium mb-2">
          Nom de l'employé <span className="text-red-500">*</span>
        </label>
        <input
          id="nomEmploye"
          name="nomEmploye"
          type="text"
          value={nomEmploye}
          onChange={handleNomChange}
          className="w-full p-2 border rounded-lg mb-4"
          required
        />
        <label htmlFor="pointage" className="block text-gray-700 font-medium mb-2">
          Lier à un pointage existant (optionnel)
        </label>
        <select
          id="pointage"
          name="pointage"
          value={selectedPointage}
          onChange={handleSelect}
          className="w-full p-2 border rounded-lg mb-4"
        >
          <option value="">-- Aucun, rapport libre --</option>
          {pointages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.date} - {p.typePointage} - {p.rapport?.slice(0, 20) || 'Pas de rapport'}
            </option>
          ))}
        </select>
        <label htmlFor="projet" className="block text-gray-700 font-medium mb-2">
          Projet
        </label>
        <input
          id="projet"
          name="projet"
          type="text"
          value={projet}
          onChange={handleProjetChange}
          className="w-full p-2 border rounded-lg mb-4"
        />
        <label htmlFor="typeTache" className="block text-gray-700 font-medium mb-2">
          Type de tâche
        </label>
        <input
          id="typeTache"
          name="typeTache"
          type="text"
          value={typeTache}
          onChange={handleTypeTacheChange}
          className="w-full p-2 border rounded-lg mb-4"
        />
        <label htmlFor="dateRapport" className="block text-gray-700 font-medium mb-2">
          Date du rapport
        </label>
        <input
          id="dateRapport"
          name="dateRapport"
          type="date"
          value={dateRapport}
          onChange={handleDateRapportChange}
          className="w-full p-2 border rounded-lg mb-4"
        />
        <label htmlFor="typePointage" className="block text-gray-700 font-medium mb-2">
          Type de pointage
        </label>
        <input
          id="typePointage"
          name="typePointage"
          type="text"
          value={typePointage}
          onChange={handleTypePointageChange}
          className="w-full p-2 border rounded-lg mb-4"
        />
        <label htmlFor="rapport" className="block text-gray-700 font-medium mb-2">
          Rapport de travail <span className="text-red-500">*</span>
        </label>
        <textarea
          id="rapport"
          name="rapport"
          required
          minLength={minLength}
          maxLength={maxLength}
          value={rapport}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Décrivez ce que vous avez fait : document modifié, calculs effectués, logiciel utilisé, blocage rencontré..."
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none min-h-[120px] text-gray-800 ${showError ? 'border-red-500' : 'border-gray-300'}`}
        />
        <div className="flex justify-between items-center mt-1">
          {/* <span className="text-xs text-gray-500">
            Décrivez ce que vous avez fait : tâches réalisées, documents modifiés, outils ou logiciels utilisés, problèmes rencontrés...
          </span> */}
          <span className={`text-xs ${rapport.length > maxLength || (touched && rapport.length < minLength) ? 'text-red-500' : 'text-gray-400'}`}>
            {rapport.length}/{maxLength}
          </span>
        </div>
        {showError && (
          <p className="text-red-500 text-xs mt-1">
            Le rapport doit contenir entre {minLength} et {maxLength} caractères et le nom de l'employé doit être renseigné.
          </p>
        )}
        {message && (
          <p className="text-green-600 text-sm mt-2">{message}</p>
        )}
        <button
          type="submit"
          disabled={!isValid || loading}
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Envoi...' : 'Soumettre'}
        </button>
      </form>
    </div>
  );
}
