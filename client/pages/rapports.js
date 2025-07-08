"use client"

import { useState, useEffect } from "react"
import axios from "axios"

export default function Rapports() {
  const [rapport, setRapport] = useState("")
  const [touched, setTouched] = useState(false)
  const [pointages, setPointages] = useState([])
  const [selectedPointage, setSelectedPointage] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [nomEmploye, setNomEmploye] = useState("")
  const [projet, setProjet] = useState("")
  const [typeTache, setTypeTache] = useState("")
  const [dateRapport, setDateRapport] = useState(() => new Date().toISOString().slice(0, 10))
  const [typePointage, setTypePointage] = useState("")

  const minLength = 10
  const maxLength = 1000
  const isValid = rapport.length >= minLength && rapport.length <= maxLength && nomEmploye.trim().length > 0
  const showError = touched && !isValid

  useEffect(() => {
    axios
      .get("http://localhost:4000/pointages", { withCredentials: true })
      .then((res) => setPointages(res.data))
      .catch(() => setPointages([]))
  }, [])

  const handleChange = (e) => {
    setRapport(e.target.value)
  }

  const handleBlur = () => {
    setTouched(true)
  }

  const handleSelect = (e) => {
    setSelectedPointage(e.target.value)
  }

  const handleNomChange = (e) => {
    setNomEmploye(e.target.value)
  }

  const handleProjetChange = (e) => {
    setProjet(e.target.value)
  }

  const handleTypeTacheChange = (e) => {
    setTypeTache(e.target.value)
  }

  const handleDateRapportChange = (e) => {
    setDateRapport(e.target.value)
  }

  const handleTypePointageChange = (e) => {
    setTypePointage(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    setMessage("")

    if (!isValid) return

    setLoading(true)

    try {
      if (selectedPointage) {
        await axios.put(`http://localhost:4000/pointages/${selectedPointage}`, { rapport }, { withCredentials: true })
        setMessage("Rapport lié au pointage avec succès !")
      } else {
        await axios.post(
          "http://localhost:4000/rapports",
          {
            nom_employe: nomEmploye,
            contenu: rapport,
            projet,
            type_tache: typeTache,
            date_rapport: dateRapport,
            type_pointage: typePointage,
          },
          { withCredentials: true },
        )
        setMessage("Rapport libre soumis avec succès !")
      }

      setRapport("")
      setTouched(false)
      setSelectedPointage("")
      setProjet("")
      setTypeTache("")
      setDateRapport(new Date().toISOString().slice(0, 10))
      setTypePointage("")
    } catch (err) {
      setMessage("Erreur lors de l'envoi du rapport")
    }

    setLoading(false)
  }

  // Filtrer les pointages de présence ou automatiques pour la liaison
  const filteredPointages = Array.isArray(pointages)
    ? pointages.filter(p =>
        (p.typePointage?.toUpperCase() !== 'AUTOMATIQUE') &&
        (p.taskType?.toUpperCase() !== 'PRESENCE')
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Rapport de travail</h1>
          <p className="text-slate-600">Créez un nouveau rapport ou liez-le à un pointage existant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Employee Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Informations employé
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nomEmploye" className="block text-sm font-medium text-slate-700 mb-2">
                  Nom de l'employé <span className="text-red-500">*</span>
                </label>
                <input
                  id="nomEmploye"
                  name="nomEmploye"
                  type="text"
                  value={nomEmploye}
                  onChange={handleNomChange}
                  className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                  placeholder="Entrez le nom de l'employé"
                  required
                />
              </div>
              <div>
                <label htmlFor="dateRapport" className="block text-sm font-medium text-slate-700 mb-2">
                  Date du rapport
                </label>
                <input
                  id="dateRapport"
                  name="dateRapport"
                  type="date"
                  value={dateRapport}
                  onChange={handleDateRapportChange}
                  className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Project Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Détails du projet
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="projet" className="block text-sm font-medium text-slate-700 mb-2">
                  Projet
                </label>
                <input
                  id="projet"
                  name="projet"
                  type="text"
                  value={projet}
                  onChange={handleProjetChange}
                  className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                  placeholder="Nom du projet"
                />
              </div>
              <div>
                <label htmlFor="typeTache" className="block text-sm font-medium text-slate-700 mb-2">
                  Type de tâche
                </label>
                <input
                  id="typeTache"
                  name="typeTache"
                  type="text"
                  value={typeTache}
                  onChange={handleTypeTacheChange}
                  className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                  placeholder="Type de tâche"
                />
              </div>
              <div>
                <label htmlFor="typePointage" className="block text-sm font-medium text-slate-700 mb-2">
                  Type de pointage
                </label>
                <input
                  id="typePointage"
                  name="typePointage"
                  type="text"
                  value={typePointage}
                  onChange={handleTypePointageChange}
                  className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                  placeholder="Type de pointage"
                />
              </div>
            </div>
          </div>

          {/* Pointage Link Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              Liaison avec pointage
            </h2>
            <div>
              <label htmlFor="pointage" className="block text-sm font-medium text-slate-700 mb-2">
                Lier à un pointage existant (optionnel)
              </label>
              <select
                id="pointage"
                name="pointage"
                value={selectedPointage}
                onChange={handleSelect}
                className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
              >
                <option value="">-- Aucun, rapport libre --</option>
                {filteredPointages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.date} - {p.typePointage} - {p.rapport?.slice(0, 20) || "Pas de rapport"}
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-500 mt-2">
                Sélectionnez un pointage existant pour y associer ce rapport, ou laissez vide pour créer un rapport
                libre.
              </p>
            </div>
          </div>

          {/* Report Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              Contenu du rapport
            </h2>
            <div>
              <label htmlFor="rapport" className="block text-sm font-medium text-slate-700 mb-2">
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
                placeholder="Décrivez en détail ce que vous avez fait : tâches réalisées, documents modifiés, outils ou logiciels utilisés, problèmes rencontrés, solutions apportées..."
                className={
                  `w-full px-4 py-3 border-2 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200 resize-none min-h-[150px] text-slate-800 ` +
                  (showError ? 'border-red-500 focus:ring-red-500' : 'border-blue-400')
                }
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-slate-500">Soyez précis et détaillé dans votre description</p>
                <span
                  className={`text-sm font-medium ${
                    rapport.length > maxLength || (touched && rapport.length < minLength)
                      ? "text-red-500"
                      : rapport.length > maxLength * 0.8
                        ? "text-orange-500"
                        : "text-slate-400"
                  }`}
                >
                  {rapport.length}/{maxLength}
                </span>
              </div>
              {showError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">
                    Le rapport doit contenir entre {minLength} et {maxLength} caractères et le nom de l'employé doit
                    être renseigné.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`p-4 rounded-lg border ${
                message.includes("succès")
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <p className="font-medium">{message}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isValid || loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700 min-w-[200px]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Envoi en cours...
                </div>
              ) : (
                "Soumettre le rapport"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
