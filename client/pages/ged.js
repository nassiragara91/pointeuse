"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaEye,
  FaDownload,
  FaTrash,
  FaUpload,
  FaSearch,
  FaFolder,
  FaCalendar,
} from "react-icons/fa"

const FILE_TYPE_COLORS = {
  pdf: "bg-gradient-to-br from-red-500 to-red-600 text-white",
  docx: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
  xlsx: "bg-gradient-to-br from-green-500 to-green-600 text-white",
  png: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
  jpg: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
  jpeg: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
}

const FILE_TYPE_ICONS = {
  pdf: FaFilePdf,
  docx: FaFileWord,
  xlsx: FaFileExcel,
  png: FaFileImage,
  jpg: FaFileImage,
  jpeg: FaFileImage,
}

export default function GED() {
  const [documents, setDocuments] = useState([])
  const [search, setSearch] = useState("")
  const [projet, setProjet] = useState("")
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef()

  useEffect(() => {
    axios
      .get("http://localhost:4000/documents/documents")
      .then((res) => setDocuments(res.data))
      .catch(() => setDocuments([]))
  }, [refresh])

  const filteredDocs = documents.filter(
    (doc) =>
      doc.nom.toLowerCase().includes(search.toLowerCase()) || doc.projet.toLowerCase().includes(search.toLowerCase()),
  )

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !projet) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("projet", projet)

    try {
      await axios.post("http://localhost:4000/documents/documents", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      setProjet("")
      setFile(null)
      fileInputRef.current.value = ""
      setRefresh((r) => !r)
    } catch (err) {
      alert("Erreur upload")
    }
    setUploading(false)
  }

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/documents/documents/${id}`)
    setRefresh((r) => !r)
    setConfirmDelete(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const getBadge = (type) => {
    const color = FILE_TYPE_COLORS[type] || "bg-gradient-to-br from-gray-500 to-gray-600 text-white"
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${color} shadow-sm`}>{type.toUpperCase()}</span>
  }

  const getIcon = (type) => {
    const Icon = FILE_TYPE_ICONS[type] || FaFilePdf
    return <Icon className="text-3xl" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            GED
          </h1>
          <p className="text-xl text-gray-600 font-medium">Gestion Électronique des Documents</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-4"></div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaUpload className="text-blue-600" />
            Ajouter un document
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Drag and Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
              />

              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUpload className="text-2xl text-blue-600" />
                </div>

                {file ? (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-700">Glissez-déposez votre fichier ici</p>
                    <p className="text-gray-500">ou cliquez pour sélectionner</p>
                    <p className="text-xs text-gray-400">Formats supportés: PDF, DOCX, XLSX, PNG, JPG, JPEG</p>
                  </div>
                )}
              </div>
            </div>

            {/* Project Input and Submit */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du projet</label>
                <input
                  type="text"
                  placeholder="Entrez le nom du projet..."
                  value={projet}
                  onChange={(e) => setProjet(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-400 bg-blue-50 text-gray-900 placeholder-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all duration-200"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={uploading || !file || !projet}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Upload...
                    </div>
                  ) : (
                    "Ajouter le document"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou projet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocs.length === 0 && (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFolder className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun document trouvé</h3>
                <p className="text-gray-400">Ajoutez votre premier document pour commencer</p>
              </div>
            </div>
          )}

          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 group-hover:border-blue-200 transition-colors">
                    {getIcon(doc.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 line-clamp-2" title={doc.nom}>
                      {doc.nom}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <FaFolder className="text-xs" />
                      <span className="truncate" title={doc.projet}>
                        {doc.projet}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between mb-4">
                  {getBadge(doc.type)}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FaCalendar />
                    <span>{new Date(doc.dateAjout).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>

                {doc.version && (
                  <div className="text-xs text-gray-500 mb-4">
                    Version: <span className="font-semibold">{doc.version}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 pb-6">
                <div className="flex gap-2">
                  {/* Preview Button */}
                  {["pdf", "png", "jpg", "jpeg"].includes(doc.type) && (
                    <a
                      href={`http://localhost:4000/documents/documents/${doc.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg p-3 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                      title="Prévisualiser"
                    >
                      <FaEye size={16} />
                      <span className="text-sm">Voir</span>
                    </a>
                  )}

                  {/* Download Button */}
                  <a
                    href={`http://localhost:4000/documents/documents/${doc.id}/download`}
                    download={doc.nom}
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg p-3 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    title="Télécharger"
                  >
                    <FaDownload size={16} />
                    <span className="text-sm">Télécharger</span>
                  </a>

                  {/* Delete Button */}
                  <button
                    onClick={() => setConfirmDelete(doc.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 rounded-lg p-3 transition-all duration-200 flex items-center justify-center"
                    title="Supprimer"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>

              {/* Delete Confirmation Modal */}
              {confirmDelete === doc.id && (
                <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                  <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-sm mx-4">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTrash className="text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
                      <p className="text-gray-600 text-sm">
                        Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        {documents.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Total: <strong className="text-gray-900">{documents.length}</strong> documents
              </span>
              <span>
                Affichés: <strong className="text-gray-900">{filteredDocs.length}</strong> documents
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
