"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Clock, User, Calendar, FileText, Briefcase, CheckCircle, Plus, Timer } from "lucide-react"

export default function AddPointage() {
  const [pointages, setPointages] = useState([])
  const [nom, setNom] = useState("")
  const [rapport, setRapport] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [timeIn, setTimeIn] = useState("")
  const [timeOut, setTimeOut] = useState("")
  const [typePointage, setTypePointage] = useState("affaire")
  const [project, setProject] = useState("")
  const [documentCode, setDocumentCode] = useState("")
  const [taskType, setTaskType] = useState("Conception")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  // Calculate total hours worked
  const getTotalHours = () => {
    if (!timeIn || !timeOut) return ""
    const [inH, inM] = timeIn.split(":").map(Number)
    const [outH, outM] = timeOut.split(":").map(Number)
    const start = new Date(date + "T" + timeIn)
    const end = new Date(date + "T" + timeOut)
    if (end < start) end.setDate(end.getDate() + 1) // handle overnight
    const diffMs = end - start
    const hours = Math.floor(diffMs / 1000 / 60 / 60)
    const minutes = Math.floor((diffMs / 1000 / 60) % 60)
    return `${hours}h ${minutes}m`
  }

  // Set today's date
  const setToday = () => {
    setDate(new Date().toISOString().slice(0, 10))
  }

  // Validate time input
  const validateTime = (newTime, isTimeOut = false) => {
    if (!timeIn || !newTime) return true
    if (isTimeOut && newTime <= timeIn) {
      alert("L'heure de sortie doit être postérieure à l'heure d'entrée")
      return false
    }
    return true
  }

  const fetchPointages = async () => {
    try {
      const res = await fetch("http://localhost:4000/pointages", { credentials: "include" })
      if (res.status === 401) {
        router.push("/login")
        return
      }
      if (res.ok) {
        const data = await res.json()
        setPointages(data)
      } else {
        console.error("Failed to fetch pointages")
      }
    } catch (error) {
      router.push("/login")
      console.error("Error fetching pointages:", error)
    }
  }

  useEffect(() => {
    fetchPointages()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

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
        ...(typePointage === "affaire" ? { project } : { documentCode }),
      }

      const res = await fetch("http://localhost:4000/pointages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      })

      if (res.status === 201) {
        setNom("")
        setRapport("")
        setDate(new Date().toISOString().slice(0, 10))
        setTimeIn("")
        setTimeOut("")
        setProject("")
        setDocumentCode("")
        setTypePointage("affaire")
        fetchPointages()
      } else if (res.status === 401) {
        router.push("/login")
      } else {
        console.error("Failed to create pointage")
      }
    } catch (error) {
      router.push("/login")
      console.error("Error creating pointage:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const taskTypeColors = {
    Conception: "bg-blue-50 text-blue-700 border-blue-200",
    "Calcul technique": "bg-green-50 text-green-700 border-green-200",
    "Revue documentaire": "bg-purple-50 text-purple-700 border-purple-200",
    "Réunion client": "bg-orange-50 text-orange-700 border-orange-200",
    "Déplacement terrain": "bg-red-50 text-red-700 border-red-200",
    Autre: "bg-gray-50 text-gray-700 border-gray-200",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Feuille de Pointage</h1>
          <p className="text-gray-600">Gérez vos heures de travail efficacement</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nouveau Pointage
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Informations générales */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'employé
                      </label>
                      <input
                        type="text"
                        id="nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                        placeholder="Entrez le nom"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          id="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="flex-1 px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={setToday}
                          className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 whitespace-nowrap"
                        >
                          Aujourd'hui
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="typePointage" className="block text-sm font-medium text-gray-700 mb-2">
                      Type de pointage
                    </label>
                    <select
                      id="typePointage"
                      value={typePointage}
                      onChange={(e) => setTypePointage(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                      required
                    >
                      <option value="affaire">Pointage sur Affaire</option>
                      <option value="document">Pointage sur Document</option>
                    </select>
                  </div>
                </div>

                {/* Projet/Document */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Projet & Tâche</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {typePointage === "affaire" && (
                      <div>
                        <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du projet
                        </label>
                        <input
                          type="text"
                          id="project"
                          value={project}
                          onChange={(e) => setProject(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                          placeholder="Nom du projet"
                          required
                        />
                      </div>
                    )}

                    {typePointage === "document" && (
                      <div>
                        <label htmlFor="documentCode" className="block text-sm font-medium text-gray-700 mb-2">
                          Code du document
                        </label>
                        <input
                          type="text"
                          id="documentCode"
                          value={documentCode}
                          onChange={(e) => setDocumentCode(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                          placeholder="Code du document"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 mb-2">
                        Type de tâche
                      </label>
                      <select
                        id="taskType"
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
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
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Timer className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Horaires</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="timeIn" className="block text-sm font-medium text-gray-700 mb-2">
                        Heure d'entrée
                      </label>
                      <input
                        type="time"
                        id="timeIn"
                        value={timeIn}
                        onChange={(e) => {
                          const newTime = e.target.value
                          if (validateTime(newTime)) {
                            setTimeIn(newTime)
                          }
                        }}
                        className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="timeOut" className="block text-sm font-medium text-gray-700 mb-2">
                        Heure de sortie
                      </label>
                      <input
                        type="time"
                        id="timeOut"
                        value={timeOut}
                        onChange={(e) => {
                          const newTime = e.target.value
                          if (validateTime(newTime, true)) {
                            setTimeOut(newTime)
                          }
                        }}
                        className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total heures</label>
                      <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 font-semibold">
                        {getTotalHours() || "0h 0m"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rapport */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Rapport d'activité</h3>
                  </div>

                  <div>
                    <label htmlFor="rapport" className="block text-sm font-medium text-gray-700 mb-2">
                      Description du travail effectué
                    </label>
                    <textarea
                      id="rapport"
                      value={rapport}
                      onChange={(e) => setRapport(e.target.value)}
                      rows="4"
                      maxLength="300"
                      className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200 resize-none"
                      placeholder="Décrivez le travail effectué..."
                      required
                    />
                    <div className="mt-2 text-sm text-gray-500 text-right">{rapport.length}/300 caractères</div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Enregistrer le Pointage
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Recent Pointages */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Pointages Récents
                </h2>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                {pointages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun pointage récent</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pointages.slice(0, 5).map((pointage) => (
                      <div
                        key={pointage.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {pointage.Employe?.nom || pointage.nom}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${taskTypeColors[pointage.taskType] || taskTypeColors["Autre"]}`}
                          >
                            {pointage.taskType}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {pointage.date ? new Date(pointage.date).toLocaleDateString("fr-FR") : "-"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {pointage.timeIn || "-"} - {pointage.timeOut || "-"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            <span className="font-medium text-blue-600">{pointage.totalHours || "-"}</span>
                          </div>
                        </div>

                        {pointage.rapport && (
                          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{pointage.rapport}</p>
                        )}

                        <div className="mt-2">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              pointage.typePointage === "affaire"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {pointage.typePointage === "affaire" ? pointage.project : pointage.documentCode}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
