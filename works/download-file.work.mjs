import { parentPort, workerData } from 'worker_threads';
import stream from 'stream';
import downloadFile from '../functions/download-file.mjs';
import saveFileStream from '../functions/save-file-stream.mjs';


// Récupération des paramètres
const { url, downloadDirPath, requestedFilename } = workerData;

// Téléchargement du fichier
downloadFile(url)
  .then(({ fileStream, filename }) => {
    // Sauvegarde du fichier
    var fileSize = 0;
    const finalFilename = requestedFilename || filename;
    const spyStream = new stream.PassThrough();
    const saveStream = new stream.PassThrough();
    spyStream.on('data', (chunk) => {
      fileSize += chunk.length;
    });
    // Pipe pour observer le flux et le sauvegarder
    fileStream.pipe(spyStream).pipe(saveStream);
    return saveFileStream(saveStream, downloadDirPath, finalFilename)
      .then(() => {
        // Export des informations du fichier
        parentPort.postMessage({
          filename: finalFilename,
          fileSize
        });
      });
  });