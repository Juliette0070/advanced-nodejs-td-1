import http from 'http';
import https from 'https';
import stream from 'stream';
import crypto from 'crypto';
import mime from 'mime-types';

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
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Erreur lors du téléchargement du fichier: ${response.statusMessage}`);
        reject();
      }
      const contentDisposition = response.headers['content-disposition'];
      const contentType = response.headers['content-type'];
      // Code pour extraire le nom du fichier. Utilise un nom aléatoire si le nom du fichier n'est pas spécifié
      const filename = contentDisposition?.split(';')[1].split('=')[1] || 
        (crypto.randomUUID().toString() + (contentType ? '.' + mime.extension(contentType) : ''));
      const readStream = new stream.Readable();
      response
        .on('data', (chunk) => {
          readStream.push(chunk);
        })
        .on('end', () => {
          readStream.push(null);
        })
        .on('error', (error) => {
          console.error(error);
        });
      resolve({ fileStream: readStream, filename });
    });
  });
}

export default downloadFile;