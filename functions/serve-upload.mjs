import process from 'process';
import path from 'path';
import { STORAGE_PATH } from '../constants.mjs';
import saveFileStream from './save-file-stream.mjs';

/**
 * Sert à téléverser un fichier sur le serveur
 * 
 * @param {*} req - Requête
 * @param {*} res - Réponse
 * @returns Une promesse de réponse HTTP
 */
async function serveUpload(req, res) {
  const { headers } = req;
  const contentDisposition = headers['content-disposition'];
  if (!contentDisposition) {
    res.status(400).send('Il est nécessaire de spécifier la disposition du contenu');
    return;
  }
  const filePath = decodeURIComponent(req.params['path']) || '';
  // Code pour extraire le nom du fichier
  const filename = contentDisposition.split(';')[1].split('=')[1];

  // Code pour déposer un fichier
  saveFileStream(req, path.join(process.cwd(), STORAGE_PATH, filePath), filename)
    .then(
      () => {
        res.send('Fichier téléversé avec succès');
      },
      (error) => {
        res.status(500).send(error);
      });
}

export default serveUpload;