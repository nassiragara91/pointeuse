import React from "react";

export default function DemandeAutorisationForm({ onCancel }) {
  return (
    <div className="w-full bg-blue-50 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="text-blue-600 hover:text-blue-800 font-semibold text-base px-2 py-1 rounded transition-colors"
        >
          ← Retour
        </button>
        <h2 className="text-2xl font-extrabold text-blue-800 text-center flex-1">Créer autorisation</h2>
        <span className="w-20" />
      </div>
      <div className="border-b border-blue-200 mb-6" />
      <form className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Nom et prénom */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Nom et prénom</label>
        <input className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" value="Mohamed Zendaoui" readOnly />
        {/* Date de sortie */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Date de sortie :</label>
        <input type="date" className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" />
        {/* Heure de sortie */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Heure de sortie :</label>
        <input type="time" className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base w-32" />
        {/* Heure de retour */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Heure de retour :</label>
        <input type="time" className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base w-32" />
        {/* Au titre de */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Au titre de</label>
        <select className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" defaultValue="">
          <option value="" disabled>Choisir...</option>
        </select>
        {/* Destination */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Destination:</label>
        <input className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" placeholder="Destination" />
        {/* Motif */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Motif :</label>
        <textarea className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base min-h-20 resize-y" placeholder="Motif" />
        {/* Validateur */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Validateur :</label>
        <select className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" defaultValue="">
          <option value="" disabled>Choisir...</option>
        </select>
      </form>
      <div className="flex justify-end gap-4 mt-10">
        <button className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-bold text-lg shadow transition-all">Confirmer</button>
        <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-400 text-gray-700 px-8 py-3 rounded-lg font-bold text-lg shadow transition-all">Annuler</button>
      </div>
    </div>
  );
} 