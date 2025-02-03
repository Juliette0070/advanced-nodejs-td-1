import mock from 'mock-fs';
import path from 'path';
import http from 'http';
import app from "../index.mjs";
import request from "supertest";

describe("POST /downloadRemoteFile", () => {

  var fakeServer;

  beforeAll(() => {
    // Create a fake server to simulate a remote file
    fakeServer = http.createServer(function (req, res) {
      if (req.url === '/test.txt') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, World!');
        return;
      }
      res.writeHead(404);
      res.end();
    });
    fakeServer.listen(8081);
  });
  
  beforeEach(() => {

    // Mock the file system to avoid writing to disk
    mock({
      [process.cwd() + "/run/storage"]: {},
      // Load node_modules from the real file system
      "node_modules": mock.load(path.resolve(process.cwd(), "node_modules")),
      "/workspace/node_modules": mock.load(path.resolve(process.cwd(), "../node_modules"))
    });
  });

  afterEach(() => {
    mock.restore();
  });

  afterAll(() => {
    // Close the server
    app.close();
    fakeServer.close();
  });

  it("should download a remote file", async () => {
    const response = await request(app)
      .post("/downloadRemoteFile")
      .send({ url: "http://localhost:8081/test.txt" });
      
      expect(response.status).toBe(200);
      expect(response.text).toBe("Fichier téléchargé et sauvegardé");
  });

  it("should return 400 if no URL is specified", async () => {
    const response = await request(app)
      .post("/downloadRemoteFile");
      
      expect(response.status).toBe(400);
      expect(response.text).toBe("Il est nécessaire de spécifier l'URL du fichier à télécharger");
  });

  it("should return 500 if the file is not found", async () => {
    const response = await request(app)
      .post("/downloadRemoteFile")
      .send({ url: "http://localhost:8081/unknown.txt" });
      
      expect(response.status).toBe(500);
  });
});