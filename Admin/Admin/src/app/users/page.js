'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";

const ROLES = [
  'admin',
  'hr_manager',
  'qhse',
  'engineering_manager',
  'responsable_procedes',
  'leader_genie_civil',
  'leader_mec_pp',
  'admin_3d_dpv',
  'leader_eia',
  'ingenieur_procedes',
  'projeteur_genie_civil',
  'projeteur_mec_pp',
  'ingenieur_mecanique',
  'informatique',
];

const initialForm = {
  matricule: '',
  nom: '',
  prenom: '',
  email: '',
  role: ROLES[0],
  manager_id: '',
  departement: '',
  password: '',
};

const Users = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editId, setEditId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/users/getall");
      const filtered = response.data.filter((u) => u && typeof u === "object" && u.username);
      setData(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  const currentUsers = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setNewRole(user.role);
  };
  const handleCancel = () => {
    setEditId(null);
    setNewRole("");
  };
  const handleSave = async (user) => {
    try {
      await axios.patch(`http://localhost:4000/api/users/${user.id}/role`, { role: newRole });
      setEditId(null);
      setNewRole("");
      fetchData();
    } catch (error) {
      alert("Erreur lors de la modification du rôle");
    }
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      await axios.post('http://localhost:4000/api/users', form);
      setFormSuccess("Employé ajouté avec succès");
      setForm(initialForm);
      setShowForm(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto p-4 pt-2">
      <h1 className="mb-4 text-2xl font-bold">User List</h1>
      <button onClick={() => setShowForm(true)} className="mb-4 px-4 py-2 bg-green-600 text-white rounded">Ajouter un employé</button>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px] relative">
            <button onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-500">✕</button>
            <h2 className="text-xl font-bold mb-4">Nouvel Employé</h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
              <input name="matricule" value={form.matricule} onChange={handleFormChange} placeholder="Matricule" required className="border rounded px-2 py-1" />
              <input name="nom" value={form.nom} onChange={handleFormChange} placeholder="Nom" required className="border rounded px-2 py-1" />
              <input name="prenom" value={form.prenom} onChange={handleFormChange} placeholder="Prénom" required className="border rounded px-2 py-1" />
              <input name="email" value={form.email} onChange={handleFormChange} placeholder="Email" type="email" className="border rounded px-2 py-1" />
              <select name="role" value={form.role} onChange={handleFormChange} required className="border rounded px-2 py-1">
                {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
              <select name="manager_id" value={form.manager_id} onChange={handleFormChange} className="border rounded px-2 py-1">
                <option value="">Aucun manager</option>
                {data.map(u => <option key={u.id} value={u.id}>{u.nom} {u.prenom} ({u.role})</option>)}
              </select>
              <input name="departement" value={form.departement} onChange={handleFormChange} placeholder="Département" className="border rounded px-2 py-1" />
              <input name="password" value={form.password} onChange={handleFormChange} placeholder="Mot de passe" type="password" required className="border rounded px-2 py-1" />
              {formError && <div className="text-red-600 text-sm">{formError}</div>}
              {formSuccess && <div className="text-green-600 text-sm">{formSuccess}</div>}
              <button type="submit" disabled={formLoading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">{formLoading ? "Ajout..." : "Ajouter"}</button>
            </form>
          </div>
        </div>
      )}
      <table className="min-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
        <thead className="bg-gray-100 text-sm text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Username</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {currentUsers.map((user, index) => (
            <tr key={user.id || index} className="border-t">
              <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td className="px-4 py-3">{user.username}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{editId === user.id ? (
                <select value={newRole} onChange={e => setNewRole(e.target.value)} className="border rounded px-2 py-1">
                  {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              ) : user.role}</td>
              <td className="px-4 py-3">
                {editId === user.id ? (
                  <>
                    <button onClick={() => handleSave(user)} className="mr-2 px-2 py-1 bg-green-500 text-white rounded">Valider</button>
                    <button onClick={handleCancel} className="px-2 py-1 bg-gray-300 rounded">Annuler</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(user)} className="px-2 py-1 bg-blue-500 text-white rounded">Modifier</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination with Arrows */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded bg-gray-300 p-2 hover:bg-gray-400 disabled:opacity-50"
        >
          &#8592;
        </button>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`rounded px-4 py-2 ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded bg-gray-300 p-2 hover:bg-gray-400 disabled:opacity-50"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Users;


