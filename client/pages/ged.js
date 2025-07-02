import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaEye, FaDownload, FaTrash, FaUpload } from 'react-icons/fa';

const FILE_TYPE_COLORS = {
  pdf: 'bg-red-600 text-white',
  docx: 'bg-blue-600 text-white',
  xlsx: 'bg-green-600 text-white',
  png: 'bg-yellow-500 text-white',
  jpg: 'bg-yellow-500 text-white',
  jpeg: 'bg-yellow-500 text-white',
};

const FILE_TYPE_ICONS = {
  pdf: FaFilePdf,
  docx: FaFileWord,
  xlsx: FaFileExcel,
  png: FaFileImage,
  jpg: FaFileImage,
  jpeg: FaFileImage,
};

export default function GED() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [projet, setProjet] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:4000/documents/documents')
      .then(res => setDocuments(res.data))
      .catch(() => setDocuments([]));
  }, [refresh]);

  const filteredDocs = documents.filter(doc =>
    doc.nom.toLowerCase().includes(search.toLowerCase()) ||
    doc.projet.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !projet) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projet', projet);
    try {
      await axios.post('http://localhost:4000/documents/documents', formData);
      setProjet('');
      setFile(null);
      fileInputRef.current.value = '';
      setRefresh(r => !r);
    } catch (err) {
      alert('Erreur upload');
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/documents/documents/${id}`);
    setRefresh(r => !r);
    setConfirmDelete(null);
  };

  const getBadge = (type) => {
    const color = FILE_TYPE_COLORS[type] || 'bg-gray-700 text-white';
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{type.toUpperCase()}</span>;
  };

  const getIcon = (type) => {
    const Icon = FILE_TYPE_ICONS[type] || FaFilePdf;
    return <Icon className="text-4xl" />;
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">GED - Gestion Électronique des Documents</h1>
        {/* Upload Form */}
        <form className="flex flex-col md:flex-row gap-3 mb-10 items-center" onSubmit={handleUpload}>
          <div className="relative flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
              tabIndex={0}
              aria-label="Choisir un fichier"
            />
            <button
              type="button"
              tabIndex={-1}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow border border-blue-300 font-semibold cursor-pointer hover:bg-blue-200 focus:outline-none"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <FaUpload /> Choisir un fichier
            </button>
            <span className="ml-3 text-gray-700 text-sm truncate max-w-[180px]">
              {file ? file.name : 'Aucun fichier choisi'}
            </span>
          </div>
          <input
            type="text"
            placeholder="Projet"
            value={projet}
            onChange={e => setProjet(e.target.value)}
            className="border rounded px-2 py-2 bg-white shadow-sm text-gray-900"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-700 text-white px-8 py-2 rounded shadow hover:bg-blue-800 disabled:opacity-50 font-semibold"
          >
            {uploading ? 'Upload...' : 'Ajouter'}
          </button>
        </form>
        {/* Search */}
        <input
          type="text"
          placeholder="Recherche par nom ou projet..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-2 py-3 mb-10 w-full bg-white shadow-sm text-gray-900 text-lg"
        />
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredDocs.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-16 bg-white rounded shadow text-xl">Aucun document trouvé.</div>
          )}
          {filteredDocs.map(doc => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-lg p-7 flex flex-col gap-4 relative group hover:shadow-2xl transition min-h-[220px] h-[260px]">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-gray-200 border-2 border-gray-300">
                  {getIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-bold text-xl text-gray-900 leading-tight max-h-[2.8em] overflow-hidden relative pr-2"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                    title={doc.nom}
                  >
                    {doc.nom}
                    <span className="absolute bottom-0 right-0 w-8 h-4 bg-gradient-to-l from-white to-transparent pointer-events-none" style={{display:'block'}}></span>
                  </div>
                  <div
                    className="text-base text-gray-600 leading-tight max-h-[2.4em] overflow-hidden relative pr-2"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                    title={doc.projet}
                  >
                    Projet : {doc.projet}
                    <span className="absolute bottom-0 right-0 w-8 h-4 bg-gradient-to-l from-white to-transparent pointer-events-none" style={{display:'block'}}></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                {getBadge(doc.type)}
                <span className="text-sm text-gray-700 font-semibold">{doc.version}</span>
                <span className="text-sm text-gray-400 ml-auto">{new Date(doc.dateAjout).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-3 mt-4">
                {/* Voir/Preview */}
                {['pdf', 'png', 'jpg', 'jpeg'].includes(doc.type) && (
                  <a
                    href={`http://localhost:4000/documents/documents/${doc.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition shadow"
                    title="Voir"
                  >
                    <FaEye size={20} />
                  </a>
                )}
                {/* Télécharger */}
                <a
                  href={`http://localhost:4000/documents/documents/${doc.id}/download`}
                  download={doc.nom}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 transition shadow"
                  title="Télécharger"
                >
                  <FaDownload size={20} />
                </a>
                {/* Supprimer */}
                <button
                  onClick={() => setConfirmDelete(doc.id)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition shadow"
                  title="Supprimer"
                >
                  <FaTrash size={20} />
                </button>
                {/* Confirmation */}
                {confirmDelete === doc.id && (
                  <div className="absolute top-2 left-2 right-2 bg-white border-2 border-red-400 rounded-xl shadow-lg p-6 z-50 flex flex-col items-center animate-fade-in">
                    <p className="mb-3 text-gray-700 text-lg font-semibold">Confirmer suppression ?</p>
                    <div className="flex gap-4">
                      <button onClick={() => handleDelete(doc.id)} className="text-red-700 font-bold text-lg">Oui</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-gray-600 text-lg">Non</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 