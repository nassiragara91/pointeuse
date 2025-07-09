import React from "react";

export default function DemandeCongeForm({ onCancel }) {
  return (
    <div className="w-full bg-blue-50 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="text-blue-600 hover:text-blue-800 font-semibold text-base px-2 py-1 rounded transition-colors"
        >
          ← Retour
        </button>
        <h2 className="text-2xl font-extrabold text-blue-800 text-center flex-1">Créer demande de congé</h2>
        <span className="w-20" />
      </div>
      <div className="border-b border-blue-200 mb-6" />
      <form className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Nom et prénom */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Nom et prénom</label>
        <input className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" value="Mohamed  Zendaoui" readOnly />
        {/* Allant du */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Allant du <span className="text-red-500 ml-1">*</span></label>
        <div className="col-span-1 flex gap-2 items-center">
          <input type="date" className="border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base flex-1" placeholder="Date de début" />
          <label className="font-bold text-blue-900 flex items-center ml-2">Heure : <span className="text-red-500 ml-1">*</span></label>
          <input type="time" className="border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base w-32" defaultValue="00:00" />
        </div>
        {/* Au */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Au : <span className="text-red-500 ml-1">*</span></label>
        <div className="col-span-1 flex gap-2 items-center">
          <input type="date" className="border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base flex-1" placeholder="Date de fin" />
          <label className="font-bold text-blue-900 flex items-center ml-2">Heure : <span className="text-red-500 ml-1">*</span></label>
          <input type="time" className="border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base w-32" defaultValue="00:00" />
        </div>
        {/* Nombre de jours demandés */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Nombre de jours demandés</label>
        <div className="col-span-1 flex gap-2 items-center">
          <input className="border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base w-24" defaultValue="0,0" placeholder="0,0" />
          <span className="text-gray-600">ouvrables</span>
          <label className="ml-4 font-bold text-blue-900">Droit de congé:</label>
          <input className="border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base w-20" defaultValue="0" placeholder="0" />
        </div>
        {/* Au titre de */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Au titre de <span className="text-red-500 ml-1">*</span></label>
        <select className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" defaultValue="" >
          <option value="" disabled>Choisir...</option>
        </select>
        {/* Description */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Description</label>
        <textarea className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base min-h-20 resize-y" placeholder="Description" />
        {/* Adresse durant l'absence */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Adresse durant l'absence</label>
        <input className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" placeholder="Adresse" />
        {/* N° Téléphone */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">N° Téléphone</label>
        <input className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" placeholder="Téléphone" />
        {/* Intérimaire */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Intérimaire</label>
        <select className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" defaultValue="" >
          <option value="" disabled>Choisir...</option>
        </select>
        {/* Validateur */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Validateur <span className="text-red-500 ml-1">*</span></label>
        <select className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" defaultValue="" >
          <option value="" disabled>Choisir...</option>
        </select>
        {/* Pour infos */}
        <label className="col-span-1 font-bold text-blue-900 flex items-center">Pour infos</label>
        <select className="col-span-1 border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-900 text-base" defaultValue="" >
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
