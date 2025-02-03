import path from 'path';
import { STORAGE_PATH } from '../constants.mjs';
import downloadFile from "./download-file.mjs";
import saveFileStream from "./save-file-stream.mjs";

const DOWNLOADS_PATH = 'downloads';

/**
 * Télécharge un fichier distant et le sauvegarde localement
 * 
 * @param {*} req - Requête
 * @param {*} res - Réponse
 * @returns Une promesse de réponse HTTP
 */
async function serveDownloadRemoteFile(req, res) {
  const { url, filename: requestedFilename } = req.body;
  if (!url) {
    res.status(400).send('Il est nécessaire de spécifier l\'URL du fichier à télécharger');
    return;
  }

  downloadFile(url)
    .then(({ fileStream, filename }) => {
      return saveFileStream(fileStream, path.join(process.cwd(), STORAGE_PATH + '/' + DOWNLOADS_PATH), requestedFilename || filename);
    })
    .then(() => {
      res.status(200).send('Fichier téléchargé et sauvegardé');
    })
    .catch((error) => {
      res.status(500).send(error);
    })
}

export default serveDownloadRemoteFile;