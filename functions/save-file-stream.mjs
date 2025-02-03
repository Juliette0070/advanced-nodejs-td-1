import fs from 'fs';
import path from 'path';

/**
 * Sauvegarde un fichier dans le système de fichiers
 * 
 * @param {*} readStream - Flux de lecture
 * @param {*} path - Chemin du répertoire de stockage
 * @param {*} filename - Nom du fichier
 * @returns Une promesse de fichier sauvegardé
 */
async function saveFileStream(readStream, filepath, filename) {
  return new Promise((resolve, reject) => {
    fs.mkdir(filepath, { recursive: true }, (err) => {
      if (err) {
        reject('Erreur lors de la création du répertoire');
        return;
      }
      const fsFileStream = fs.createWriteStream(path.join(filepath, filename));
      readStream
        .pipe(fsFileStream)
        .on('finish', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  });
}

export default saveFileStream;