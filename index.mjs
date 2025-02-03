import express from 'express';
import { PORT } from './constants.mjs';
import serveUpload from './functions/serve-upload.mjs';
import serveDownload from './functions/serve-download.mjs';
import serveDownloadRemoteFile from './functions/serve-download-remote-file.mjs';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Bienvenue sur le serveur de fichiers');
});

app.post('/upload/:path', serveUpload);

app.get('/download/:filename', serveDownload);

app.post('/downloadRemoteFile', serveDownloadRemoteFile);

export default app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000');
});