import React, { useState } from "react";

const mockData = [
  {
    date: "02/06/2025 00:00:00",
    entries: [
      { time: "09:35:17", door: "Porte d'entrée escalier Lac2" },
      { time: "11:25:41", door: "Porte de sortie principale Lac2" },
      { time: "11:28:03", door: "Porte d'entrée Principale Lac2" },
      { time: "12:22:48", door: "Porte de sortie principale Lac2" },
      { time: "13:23:25", door: "Porte d'entrée Principale Lac2" },
      { time: "15:43:49", door: "Porte de sortie escalier Lac2" },
    ],
  },
];

export default function PointagePresenceModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState("presence");
  const [employe, setEmploye] = useState("Mohamed Zendaoui");
  const [dateDebut, setDateDebut] = useState("2025-06-01");
  const [dateFin, setDateFin] = useState("2025-07-06");
  const [data, setData] = useState(mockData);

  if (!open) return null;

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
              <form className="flex flex-wrap items-end gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="text-sm mb-1 text-gray-800">Employé</label>
                  <input
                    className="border rounded px-2 py-1 min-w-[180px] text-gray-900"
                    value={employe}
                    onChange={e => setEmploye(e.target.value)}
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
                <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Valider</button>
              </form>
              {/* Titre */}
              <div className="text-blue-700 font-semibold text-center mb-2">
                Présence de {employe}
              </div>
              {/* Tableau */}
              <div className="overflow-x-auto rounded border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold border-b text-black">Heure</th>
                      <th className="px-4 py-2 text-left font-semibold border-b text-black">Porte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((day, i) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {activeTab === "pointage" && (
            <div className="text-center text-gray-500 py-8">Section Pointage (contenu à définir)</div>
          )}
        </div>
      </div>
    </div>
  );
} 