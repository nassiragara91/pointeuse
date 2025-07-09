import React from "react";

export default function DemandeAccesForm({ onCancel }) {
  return (
    <div className="w-full bg-blue-50 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="text-blue-600 hover:text-blue-800 font-semibold text-base px-2 py-1 rounded transition-colors"
        >
          ← Retour
        </button>
        <h2 className="text-2xl font-extrabold text-blue-800 text-center flex-1">Accès</h2>
        <span className="w-20" />
      </div>
      <div className="border-b border-blue-200 mb-6" />
      {/* Partie haute organisée en grille simple */}
      <form className="grid grid-cols-3 gap-x-6 gap-y-6 mb-8">
        {/* Ligne 1 */}
        <div>
          <label className="block font-bold text-blue-900 mb-1">Matricule</label>
          <input className="w-full border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" value="11034" readOnly />
        </div>
        <div>
          <label className="block font-bold text-blue-900 mb-1">Demandeur</label>
          <input className="w-full border rounded-lg px-3 py-2 shadow-sm bg-white text-blue-700 text-base font-bold" value="ZENDAOUI Mohamed" readOnly />
        </div>
        <div>
          <label className="block font-bold text-blue-900 mb-1">Fonction</label>
          <input className="w-full border rounded-lg px-3 py-2 shadow-sm bg-white text-blue-700 text-base font-bold" value="Technicien Network & Maintenance" readOnly />
        </div>
        {/* Ligne 2 */}
        <div>
          <label className="block font-bold text-blue-900 mb-1">Type d'accès <span className="text-red-500">*</span></label>
          <select className="w-full border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base">
            <option>Choisir...</option>
          </select>
        </div>
        <div>
          <label className="block font-bold text-blue-900 mb-1">Société <span className="text-red-500">*</span></label>
          <input className="w-full border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" placeholder="Société" />
        </div>
        <div>
          <label className="block font-bold text-blue-900 mb-1">Liste des Projets <span className="text-red-500">*</span></label>
          <select className="w-full border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base">
            <option>Choisir...</option>
          </select>
        </div>
        {/* Ligne 3 */}
        <div>
          <label className="block font-bold text-blue-900 mb-1">Droit d'accès <span className="text-red-500">*</span></label>
          <input className="w-full border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" placeholder="Droit d'accès" />
        </div>
        <div>
          <label className="block font-bold text-blue-900 mb-1">Date <span className="text-red-500">*</span></label>
          <input type="date" className="w-full border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" />
        </div>
        <div />
      </form>
      {/* Suite du formulaire (description, pièces jointes, supérieur hiérarchique) inchangée */}
      <form className="grid grid-cols-3 gap-x-6 gap-y-4">
        {/* Description */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Description</label>
        <textarea className="col-span-2 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base min-h-32 resize-y" placeholder="Description" />
        {/* Pièces jointes */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Pièces Jointes</label>
        <div className="col-span-2 flex items-center gap-2">
          <input type="file" className="border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" />
          <span className="text-gray-600">Fichiers téléchargés</span>
        </div>
        {/* Supérieur hiérarchique */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Supérieur hiérarchique <span className="text-red-500 ml-1">*</span></label>
        <select className="col-span-2 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base">
          <option>Choisir...</option>
        </select>
      </form>
      <div className="flex justify-end gap-4 mt-10">
        <button className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-bold text-lg shadow transition-all">Confirmer</button>
        <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-400 text-gray-700 px-8 py-3 rounded-lg font-bold text-lg shadow transition-all">Fermer</button>
      </div>
    </div>
  );
} 