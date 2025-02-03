import process from 'process';
import fs from 'fs';
import path from 'path';
import { STORAGE_PATH } from '../constants.mjs';

/**
 * Sert à télécharger un fichier du serveur
 * 
 * @param {*} req - Requête
 * @param {*} res - Réponse
 * @returns Une promesse de réponse HTTP
 */
async function serveDownload(req, res) {
  const { filename } = req.params;
    // Code pour télécharger un fichier
    fs.createReadStream(path.join(process.cwd(), STORAGE_PATH, filename))
      .on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.status(404).send('Fichier introuvable');
          return;
        }
        res.status(500).send('Erreur lors du téléchargement du fichier');
      })
      .pipe(res)
      .on('end', () => {
        res.end();
      });
}

export default serveDownload;