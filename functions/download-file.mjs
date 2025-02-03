import stream from 'stream';
import crypto from 'crypto';
import mime from 'mime-types';
import { Worker } from 'worker_threads';

/**
 * Sert à télécharger un fichier distant
 * 
 * Le fichier est téléchargé sous forme de flux.
 * Si une erreur survient, elle est affichée dans la console mais devra être gérée par l'appelant.
 * 
 * @param {*} url - URL du fichier à télécharger
 * @returns Une promesse de fichier sous forme de flux accompagné du nom du fichier
 */
async function downloadFile(url) {
  return new Promise((resolve, reject) => {
    fetch(url, {}) 
      .then((response) => { 
        if (response.status !== 200) { 
          console.error(`Erreur lors du téléchargement du fichier: ${response.status} ${response.statusText}`); 
          reject(); 
          return; 
        } 
        const contentDisposition = response.headers['content-disposition']; 
        const contentType = response.headers['content-type']; 
        // Code pour extraire le nom du fichier. Utilise un nom aléatoire si le nom du fichier n'est pas spécifié
        const filename = contentDisposition?.split(';')[1].split('=')[1] ||
          (crypto.randomUUID().toString() + (contentType ? '.' + mime.extension(contentType) : '')); 
        resolve({ fileStream: stream.Readable.fromWeb(response.body), filename }); 
      }); 
    });
}

/**
 * Délègue le travail de téléchargement d'un fichier distant à un worker
 * 
 * @param {*} workerData - Paramètres du worker
 * @returns Une promesse du résultat du travail
 */
function delegateDownloadWork(workerData) {
    return new Promise((resolve, reject) => {
      const worker = new Worker("./works/download-file.work.mjs", {
        workerData
      });
      worker.on('message', (message) => {
        resolve(message);
      });
      worker.on('error', (error) => {
        reject(error);
      });
    });
  }

export default downloadFile;
export { delegateDownloadWork };