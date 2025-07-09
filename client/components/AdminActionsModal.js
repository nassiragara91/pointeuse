import React, { useState } from "react";
import {
  CalendarDaysIcon,
  KeyIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import DemandeCongeForm from "./DemandeCongeForm";
import DemandeAutorisationForm from "./DemandeAutorisationForm";
import DemandePiecesAdministrativesForm from "./DemandePiecesAdministrativesForm";
import DemandeAcquisitionForm from "./DemandeAcquisitionForm";
import DemandeAccesForm from "./DemandeAccesForm";

const actions = [
  {
    label: "Demande de congé",
    icon: CalendarDaysIcon,
  },
  {
    label: "Demande d’autorisation",
    icon: KeyIcon,
  },
  {
    label: "Demande des Pièces Administratives",
    icon: DocumentTextIcon,
  },
  {
    label: "Demande acquisition",
    icon: ShoppingBagIcon,
  },
  {
    label: "Demande d’accès",
    icon: UserPlusIcon,
  },
];

export default function AdminActionsModal({ open, onClose }) {
  const [selectedAction, setSelectedAction] = useState(null);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white rounded-3xl shadow-2xl border w-full relative animate-fade-in-up p-0 ${selectedAction ? 'max-w-6xl' : 'max-w-2xl'}` }>
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold transition-colors duration-200 focus:outline-none"
          aria-label="Fermer"
        >
          ×
        </button>
        {/* Affichage grille ou formulaire */}
        <div className="pt-8 pb-2 px-8">
          {!selectedAction && (
            <>
              <h2 className="text-2xl font-extrabold text-center text-blue-700 mb-2">Actions Administratives</h2>
              <p className="text-center text-gray-500 mb-4 text-sm">Sélectionnez une action à effectuer</p>
            </>
          )}
        </div>
        <div className="px-6 pb-8">
          {!selectedAction ? (
            <div className="grid grid-cols-2 gap-5">
              {actions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center gap-2 py-6 px-2 cursor-pointer rounded-2xl transition-all duration-200 bg-blue-50 hover:bg-blue-100 hover:shadow-lg hover:-translate-y-0.5 group"
                    onClick={() => {
                      if (action.label === 'Demande de congé') setSelectedAction('conge');
                      else if (action.label === 'Demande d’autorisation') setSelectedAction('autorisation');
                      else if (action.label === 'Demande des Pièces Administratives') setSelectedAction('pieces');
                      else if (action.label === 'Demande acquisition') setSelectedAction('acquisition');
                      else if (action.label === "Demande d’accès") setSelectedAction('acces');
                    }}
                  >
                    <span className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors mb-2">
                      <Icon className="h-7 w-7 text-blue-600" />
                    </span>
                    <span className="text-gray-800 font-semibold text-base text-center group-hover:text-blue-700 transition-colors">
                      {action.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}
          {selectedAction === 'conge' && <DemandeCongeForm onCancel={() => setSelectedAction(null)} />}
          {selectedAction === 'autorisation' && <DemandeAutorisationForm onCancel={() => setSelectedAction(null)} />}
          {selectedAction === 'pieces' && <DemandePiecesAdministrativesForm onCancel={() => setSelectedAction(null)} />}
          {selectedAction === 'acquisition' && <DemandeAcquisitionForm onCancel={() => setSelectedAction(null)} />}
          {selectedAction === 'acces' && <DemandeAccesForm onCancel={() => setSelectedAction(null)} />}
        </div>
      </div>
    </div>
  );
} 