import { Document } from '../models/index.js';
import path from 'path';
import fs from 'fs';

export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({ attributes: { exclude: ['fichier'] } });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document non trouvé' });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document non trouvé' });
    res.setHeader('Content-Disposition', `attachment; filename="${document.nom}"`);
    res.setHeader('Content-Type', getMimeType(document.type));
    res.send(document.fichier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function getMimeType(type) {
  switch (type) {
    case 'pdf': return 'application/pdf';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    default: return 'application/octet-stream';
  }
}

export const createDocument = async (req, res) => {
  try {
    const { projet } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Aucun fichier uploadé' });
    const ext = path.extname(file.originalname).slice(1);
    // Version automatique : cherche la dernière version pour ce nom/projet
    const lastDoc = await Document.findOne({
      where: { nom: file.originalname, projet },
      order: [['version', 'DESC']]
    });
    let version = 'v1';
    if (lastDoc) {
      const lastVersion = parseInt(lastDoc.version.replace('v', ''));
      version = 'v' + (isNaN(lastVersion) ? 2 : lastVersion + 1);
    }
    const newDoc = await Document.create({
      nom: file.originalname,
      projet,
      type: ext,
      version,
      fichier: file.buffer,
      dateAjout: new Date(),
    });
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document non trouvé' });
    await document.destroy();
    res.json({ message: 'Document supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document non trouvé' });
    const { projet, version } = req.body;
    if (projet) document.projet = projet;
    if (version) document.version = version;
    await document.save();
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 