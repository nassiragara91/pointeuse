"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import ProtectedRoute from "../components/ProtectedRoute"
import {
  ClockIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import PointagePresenceModal from "../components/PointagePresenceModal"
import { useRouter } from "next/router"
import AdminActionsModal from "../components/AdminActionsModal";

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function HistoriqueZkteco() {
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  useEffect(() => {
    fetch('http://localhost:4000/api/zkteco/my-history', { credentials: 'include' })
      .then(res => res.json())
      .then(setLogs);
  }, []);

  // Filtrer les logs du jour sélectionné
  const filtered = logs.filter(
    log => log.timestamp && log.timestamp.slice(0, 10) === selectedDate
  );

  return (
    <div className="bg-white rounded shadow p-4 mb-8">
      <h2 className="font-bold text-lg mb-2 text-gray-800">Pointage</h2>
      <input
        type="date"
        className="border rounded px-2 py-1 mb-2 w-full text-gray-900"
        value={selectedDate}
        onChange={e => setSelectedDate(e.target.value)}
      />
      <div className="text-blue-700 font-semibold mb-2 text-center">
        Présence du {selectedDate.split('-').reverse().join('/')}
      </div>
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left px-3 py-2 border-b text-gray-700 font-semibold">Porte</th>
            <th className="text-left px-3 py-2 border-b text-gray-700 font-semibold">Heure</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center py-4 text-gray-400">Aucun pointage</td>
            </tr>
          ) : (
            filtered.map((log, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 border-b text-gray-900">
                  {log.type === "IN" ? "Porte d'entrée" : "Porte de sortie"}
                </td>
                <td className="px-3 py-2 border-b text-gray-900">{log.timestamp?.slice(11, 19)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Accueil() {
  const { user } = useAuth()
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Utilisateur")
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Debug user object
  console.log('User object in accueil:', user)

  // Get user name from auth context or fetch it directly
  useEffect(() => {
    if (user?.nom) {
      setUserName(user.nom)
    } else if (user?.id) {
      // Fallback: fetch user data directly
      fetch('/api/auth/check', {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((userData) => {
          console.log('Fetched user data:', userData)
          if (userData.nom) {
            setUserName(userData.nom)
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })
    }
  }, [user])

  const nomUtilisateur = userName

  // Récupère les 5 dernières activités tous types confondus
  useEffect(() => {
    setLoading(true)
    fetch("/api/activites", {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Accueil page received data:', data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setRecent(data)
        } else if (data && Array.isArray(data.activites)) {
          setRecent(data.activites)
        } else {
          console.warn('Activities data is not an array:', data)
          setRecent([])
        }
      })
      .catch((error) => {
        console.error('Error fetching activities:', error)
        setRecent([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Filtrer les pointages de présence
  const filteredRecent = Array.isArray(recent)
    ? recent.filter(a => !(a.type === "Pointage" && a.typeTache && a.typeTache.toUpperCase() === "PRESENCE"))
    : [];

  // Vérifie si un pointage du jour existe
  const today = new Date().toISOString().slice(0, 10)
  const hasTodayPointage = Array.isArray(recent) && recent.some((a) => a.date === today)

  const handleSelect = (type) => {
    setModalOpen(false)
    if (type === "pointage") {
      if (router) router.push("/addPointage")
      else window.location.href = "/addPointage"
    } else if (type === "presence") {
      if (router) router.push("/rapports") // À adapter selon la page de présence
      else window.location.href = "/rapports"
    }
  }

  const quickActions = [
    {
      href: "#",
      icon: ClockIcon,
      title: "Gestion de Pointage",
      description: "Enregistrer vos heures",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      onClick: () => setModalOpen(true),
    },
    {
      href: "/rapports",
      icon: DocumentTextIcon,
      title: "Mes Rapports",
      description: "Consulter l'historique",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      href: "/ged",
      icon: FolderOpenIcon,
      title: "Accès GED",
      description: "Gestion documentaire",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      href: "#",
      icon: CheckCircleIcon,
      title: "Administratifs",
      description: "Gestion administrative",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      onClick: () => setAdminModalOpen(true),
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <main className="w-full px-4 lg:px-0 py-8">
          <div className="flex flex-col lg:flex-row items-start gap-4">
            <div className="w-full lg:w-[320px] xl:w-[350px] 2xl:w-[400px]">
              <HistoriqueZkteco />
            </div>
            <div className="flex-1 ml-0">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Bonjour {nomUtilisateur} 👋
                    </h1>
                    <p className="text-gray-600 mt-1">Voici votre tableau de bord pour gérer vos activités</p>
                  </div>
                </div>
              </div>

              {/* Alert Section */}
              {!hasTodayPointage && (
                <div className="mb-8">
                  <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full -translate-y-16 translate-x-16 opacity-50" />
                    <div className="relative flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-900 mb-1">Pointage manquant</h3>
                        <p className="text-amber-700">Vous n'avez pas encore rempli votre pointage aujourd'hui.</p>
                      </div>
                      <Link
                        href="/addPointage"
                        className="ml-auto bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        Pointer maintenant
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions Grid */}
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions rapides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon
                    if (action.title === "Gestion de Pointage") {
                      return (
                        <button
                          key={index}
                          onClick={action.onClick}
                          className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full text-left"
                        >
                          <div className="p-6">
                            <div
                              className={`w-14 h-14 ${action.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                            >
                              <IconComponent className={`h-7 w-7 ${action.iconColor}`} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                              {action.description}
                            </p>
                          </div>
                          <div
                            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${action.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                          />
                        </button>
                      )
                    }
                    return (
                      <Link
                        key={index}
                        href={action.href}
                        onClick={action.onClick}
                        className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="p-6">
                          <div
                            className={`w-14 h-14 ${action.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent className={`h-7 w-7 ${action.iconColor}`} />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                            {action.description}
                          </p>
                        </div>
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${action.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                        />
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Recent Activities Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Activités récentes</h2>
                      <p className="text-sm text-gray-500">Vos dernières actions et pointages</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-600">Chargement des activités...</span>
                      </div>
                    </div>
                  ) : filteredRecent.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircleIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité récente</h3>
                      <p className="text-gray-500 mb-6">Commencez par ajouter votre premier pointage</p>
                      <Link
                        href="/addPointage"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                      >
                        <ClockIcon className="h-5 w-5" />
                        Gestion de Pointage
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Date</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Type</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Projet/Document</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Heures/Version</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Statut</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Type de tâche</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {filteredRecent.map((a, index) => (
                              <tr key={a.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="py-4 px-4">
                                  <span className="text-sm font-medium text-gray-900">{a.date}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      a.type === "Pointage"
                                        ? "bg-blue-100 text-blue-800"
                                        : a.type === "Rapport"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-purple-100 text-purple-800"
                                    }`}
                                  >
                                    {a.type}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-sm text-gray-900">{a.projet || a.document || "-"}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-sm text-gray-600">{a.heures || a.version || "-"}</span>
                                </td>
                                <td className="py-4 px-4">
                                  {a.type === "Pointage" ? (
                                    a.rapport && a.rapport.length > 0 ? (
                                      <div className="flex items-center gap-2">
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        <span className="text-sm text-green-700">Rapport rempli</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <XCircleIcon className="h-5 w-5 text-red-400" />
                                        <span className="text-sm text-red-600">Rapport manquant</span>
                                      </div>
                                    )
                                  ) : a.type === "Rapport" ? (
                                    <span className={`text-sm ${a.rapport ? "text-green-600" : "text-red-600"}`}>
                                      {a.rapport ? "✔ Complété" : "✖ Incomplet"}
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-600">{a.action || "-"}</span>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-sm text-gray-600">{a.typeTache || "-"}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <PointagePresenceModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />
          <AdminActionsModal open={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
        </main>
      </div>
    </ProtectedRoute>
  )
}
