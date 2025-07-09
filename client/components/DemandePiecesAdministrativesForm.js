import React from "react";

export default function DemandePiecesAdministrativesForm({ onCancel }) {
  return (
    <div className="w-full bg-blue-50 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="text-blue-600 hover:text-blue-800 font-semibold text-base px-2 py-1 rounded transition-colors"
        >
          ← Retour
        </button>
        <h2 className="text-2xl font-extrabold text-blue-800 text-center flex-1">Création d'un ticket</h2>
        <span className="w-20" />
      </div>
      <div className="border-b border-blue-200 mb-6" />
      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Support */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Support</label>
        <select className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" defaultValue="Services Administratifs">
          <option>Services Administratifs</option>
        </select>
        {/* Services */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Services</label>
        <select className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base">
          <option>Attestation de travail (Arabe, Français, anglais)</option>
          <option>Attestation de salaire</option>
          <option>Fiche de paie (mois)</option>
        </select>
        {/* Description (simulate rich text editor) */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Description</label>
        <textarea className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base min-h-32 resize-y" placeholder="Description" />
        {/* Priorité */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Priorité</label>
        <select className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base">
          <option>Normale</option>
          <option>Haute</option>
          <option>Basse</option>
        </select>
        {/* Date de création */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Date de création</label>
        <input type="datetime-local" className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" />
        {/* Informer */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Informer</label>
        <select className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base">
          <option>Choisir...</option>
        </select>
        {/* Pièces jointes */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Pièces Jointes</label>
        <input type="file" className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" />
      </form>
      <div className="flex justify-end gap-4 mt-10">
        <button className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-bold text-lg shadow transition-all">Valider</button>
        <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-400 text-gray-700 px-8 py-3 rounded-lg font-bold text-lg shadow transition-all">Annuler</button>
      </div>
    </div>
  );
} 