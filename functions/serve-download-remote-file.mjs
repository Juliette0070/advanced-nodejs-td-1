import path from 'path';
import { STORAGE_PATH } from '../constants.mjs';
import delegateDownloadWork from "./download-file.mjs";

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

  delegateDownloadWork({
    url,
    downloadDirPath: path.join(process.cwd(), STORAGE_PATH + '/' + DOWNLOADS_PATH),
    requestedFilename
  }).then((message) => {
      const { filename, fileSize } = message;
      return res.status(200).send(`Fichier téléchargé et sauvegardé: ${filename} (${fileSize} octets)`);
    })
    .catch((error) => {
      console.error('Erreur dans le worker:', error);
      return res.status(500).send(error.toString());
    });
}

export default serveDownloadRemoteFile;