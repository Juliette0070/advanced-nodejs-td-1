import mock from 'mock-fs';
import path from 'path';
import app from "../index.mjs";
import request from "supertest";

describe("POST /download/:path", () => {

  beforeEach(() => {

    // Mock the file system to avoid writing to disk
    mock({
      [process.cwd() + "/run/storage"]: {
        "test.txt": "Hello, World!"
      },
      [process.cwd() + "/run/storage/testfiles"]: {
        "test.txt": "Hello, World! from testfiles"
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

  it("should download the specified file at root", async () => {
    const response = await request(app)
      .get("/download/test.txt")
      
      expect(response.status).toBe(200);
      expect(response.text).toBe("Hello, World!");
  });

  it("should download the specified file in a subdirectory", async () => {
    const response = await request(app)
      .get("/download/testfiles%2Ftest.txt")
      
      expect(response.status).toBe(200);
      expect(response.text).toBe("Hello, World! from testfiles");
  });

  it("should return 404 if the file does not exist", async () => {
    const response = await request(app)
      .get("/download/unknown.txt")
      
      expect(response.status).toBe(404);
      expect(response.text).toBe("Fichier introuvable");
  });
});