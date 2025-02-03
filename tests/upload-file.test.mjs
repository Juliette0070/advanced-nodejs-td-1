import mock from 'mock-fs';
import path from 'path';
import app from "../index.mjs";
import request from "supertest";

describe("POST /upload/:path", () => {

  beforeEach(() => {

    // Mock the file system to avoid writing to disk
    mock({
      "/run/storage": {},
      "/run/_testfiles": {
        "test.txt": "Hello, World!"
      },
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
  });

  it("should upload a file", async () => {
    const response = await request(app)
      .post("/upload/test")
      .attach("file", "/run/_testfiles/test.txt")
      .set("Content-Disposition", "attachment; filename=test.txt");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Fichier téléversé avec succès");
  });

  it("should return 400 if no file is attached", async () => {
    const response = await request(app)
      .post("/upload/test");

    expect(response.status).toBe(400);
    expect(response.text).toBe("Il est nécessaire de spécifier la disposition du contenu");
  });

  it("should return 400 if disposition is not specified", async () => {
    const response = await request(app)
      .post("/upload/test")
      .attach("file", "/run/_testfiles/test.txt");

    expect(response.status).toBe(400);
    expect(response.text).toBe("Il est nécessaire de spécifier la disposition du contenu");
  });
});