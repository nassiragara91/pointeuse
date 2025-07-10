import { useState } from "react";

export default function PointageForm({ initialNom = "", onSuccess }) {
  const [nom, setNom] = useState(initialNom);
  const [rapport, setRapport] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [typePointage, setTypePointage] = useState("affaire");
  const [project, setProject] = useState("");
  const [documentCode, setDocumentCode] = useState("");
  const [taskType, setTaskType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total hours worked
  const getTotalHours = () => {
    if (!timeIn || !timeOut) return "";
    const [inH, inM] = timeIn.split(":").map(Number);
    const [outH, outM] = timeOut.split(":").map(Number);
    const start = new Date(date + "T" + timeIn);
    const end = new Date(date + "T" + timeOut);
    if (end < start) end.setDate(end.getDate() + 1); // handle overnight
    const diffMs = end - start;
    const hours = Math.floor(diffMs / 1000 / 60 / 60);
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    return `${hours}h ${minutes}m`;
  };

  const setToday = () => {
    setDate(new Date().toISOString().slice(0, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
      };
      const res = await fetch("http://localhost:4000/pointages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (res.status === 201) {
        setNom(initialNom);
        setRapport("");
        setDate(new Date().toISOString().slice(0, 10));
        setTimeIn("");
        setTimeOut("");
        setProject("");
        setDocumentCode("");
        setTypePointage("affaire");
        if (onSuccess) onSuccess();
      } else {
        // handle error
      }
    } catch (error) {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold text-gray-900">Informations générales</span>
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
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="typePointage" className="block text-sm font-medium text-gray-700 mb-2">
              Type de pointage
            </label>
            <select
              id="typePointage"
              value={typePointage}
              onChange={e => setTypePointage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
            >
              <option value="affaire">Pointage sur Affaire</option>
              <option value="document">Pointage sur Document</option>
            </select>
          </div>
          <div>
            <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 mb-2">
              Type de tâche
            </label>
            <input
              type="text"
              id="taskType"
              value={taskType}
              onChange={e => setTaskType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
              placeholder="Type de tâche..."
              required
            />
          </div>
        </div>
        {typePointage === "affaire" && (
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
              Nom du projet
            </label>
            <input
              type="text"
              id="project"
              value={project}
              onChange={e => setProject(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
              placeholder="Nom du projet"
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
              onChange={e => setDocumentCode(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
              placeholder="Code du document"
            />
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="timeIn" className="block text-sm font-medium text-gray-700 mb-2">
              Heure d'entrée
            </label>
            <input
              type="time"
              id="timeIn"
              value={timeIn}
              onChange={(e) => setTimeIn(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
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
              onChange={(e) => setTimeOut(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
              required
            />
          </div>
        </div>
        {/* Champ Rapport déplacé en dernier */}
        <div>
          <label htmlFor="rapport" className="block text-sm font-medium text-gray-700 mb-2">
            Rapport
          </label>
          <textarea
            id="rapport"
            value={rapport}
            onChange={(e) => setRapport(e.target.value)}
            className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow transition-all duration-200"
            placeholder="Décrivez votre activité..."
            rows={3}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enregistrement..." : "Enregistrer le pointage"}
      </button>
    </form>
  );
} 