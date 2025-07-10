import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PointageForm from "./PointageForm";

export default function PointagePresenceModal({ open, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("presence");
  const [dateDebut, setDateDebut] = useState("2025-06-01");
  const [dateFin, setDateFin] = useState("2025-07-06");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // Fonction pour regrouper les logs par jour
  function groupByDate(logs) {
    const map = {};
    logs.forEach(log => {
      const date = log.timestamp.slice(0, 10);
      if (!map[date]) map[date] = [];
      map[date].push(log);
    });
    // Retourne un tableau [{date, entries: [...] }]
    return Object.entries(map).map(([date, entries]) => ({
      date,
      entries: entries.map(log => ({
        time: log.timestamp.slice(11, 19),
        door: log.type === "IN" ? "Porte d'entrée" : "Porte de sortie"
      }))
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  // Handler pour le bouton Valider
  const handleValider = async () => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:4000/api/zkteco/my-history-period?dateDebut=${dateDebut}&dateFin=${dateFin}`,
      { credentials: "include" }
    );
    let logs = [];
    try {
      logs = await res.json();
      if (!Array.isArray(logs)) logs = [];
    } catch (e) {
      logs = [];
    }
    setData(groupByDate(logs));
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded shadow-lg border w-full max-w-2xl relative animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-3">
          <span className="text-xl font-bold text-black">Détails</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold">×</button>
        </div>
        {/* Tabs */}
        <div className="flex border-b px-6 pt-2 bg-white">
          <button
            className={`px-4 py-2 -mb-px border-b-2 font-medium focus:outline-none ${activeTab === "presence" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"}`}
            onClick={() => setActiveTab("presence")}
          >
            Présence
          </button>
          <button
            className={`ml-2 px-4 py-2 -mb-px border-b-2 font-medium focus:outline-none ${activeTab === "pointage" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"}`}
            onClick={() => setActiveTab("pointage")}
          >
            Pointage
          </button>
        </div>
        {/* Content */}
        <div className="px-6 py-4 bg-white">
          {activeTab === "presence" && (
            <>
              {/* Formulaire */}
              <form className="flex flex-wrap items-end gap-4 mb-4" onSubmit={e => { e.preventDefault(); handleValider(); }}>
                <div className="flex flex-col">
                  <label className="text-sm mb-1 text-gray-800">Employé</label>
                  <input
                    className="border rounded px-2 py-1 min-w-[180px] text-gray-900 bg-gray-100"
                    value={user?.nom || ""}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1 text-gray-800">Date Début</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 text-gray-900"
                    value={dateDebut}
                    onChange={e => setDateDebut(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1 text-gray-800">Date Fin</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 text-gray-900"
                    value={dateFin}
                    onChange={e => setDateFin(e.target.value)}
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Valider</button>
              </form>
              {/* Titre */}
              <div className="text-blue-700 font-semibold text-center mb-2">
                Présence de {user?.nom || ""}
              </div>
              {/* Tableau */}
              <div className="overflow-x-auto rounded border" style={{ maxHeight: "350px", overflowY: "auto" }}>
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold border-b text-black">Heure</th>
                      <th className="px-4 py-2 text-left font-semibold border-b text-black">Porte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={2} className="text-center py-4 text-gray-400">Chargement...</td>
                      </tr>
                    ) : data.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center py-4 text-gray-400">Aucun pointage</td>
                      </tr>
                    ) : (
                      data.map((day, i) => (
                        <React.Fragment key={i}>
                          <tr className="bg-gray-100">
                            <td colSpan={2} className="px-4 py-2 font-medium text-gray-700 border-b">
                              Date: {day.date}
                            </td>
                          </tr>
                          {day.entries.map((entry, j) => (
                            <tr key={j}>
                              <td className="px-4 py-2 border-b text-gray-600">{entry.time}</td>
                              <td className="px-4 py-2 border-b text-gray-600">{entry.door}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {activeTab === "pointage" && (
            <div className="py-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
              <PointageForm initialNom={user?.nom || ""} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 