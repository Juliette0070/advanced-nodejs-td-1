import { jest } from "@jest/globals";
import http from "http";
import https from "https";
import downloadFile from "./download-file.mjs";

const RECURSIVE_ON = {
  on: jest.fn().mockReturnThis()
}

describe("downloadFile", () => {
  it("should download file with GET HTTP method", async () => {
    // given
    const url = "http://example.com/test.txt";
    const response = {
      statusCode: 200,
      headers: {
        "content-disposition": "attachment; filename=test.txt",
        "content-type": "text/plain"
      },
      on: jest.fn().mockImplementation(RECURSIVE_ON.on)
    };
    const client = {
      get: jest.fn().mockImplementation((url, callback) => callback(response))
    };

    // when
    jest.spyOn(http, "get").mockImplementation(client.get);
    downloadFile(url);

    // then
    expect(client.get).toHaveBeenCalledTimes(1);
  });

  it("should use http module when URL is not secure", async () => {
    // given
    const url = "http://example.com/test.txt";
    const client = {
      get: jest.fn().mockImplementation(RECURSIVE_ON.on)
    };
    jest.mock("http", () => ({ get: client.get }));

    // when
    jest.spyOn(http, "get").mockImplementation(client.get);
    downloadFile(url);

    // then
    expect(client.get).toHaveBeenCalledTimes(1);
  });

  it("should use https module when URL is secure", async () => {
    // given
    const url = "https://example.com/test.txt";
    const client = {
      get: jest.fn()
    };
    jest.mock("https", () => ({ get: client.get }));

    // when
    jest.spyOn(https, "get").mockImplementation(client.get);
    downloadFile(url);

    // then
    expect(client.get).toHaveBeenCalledTimes(1);
  });

  it("should determine filename from content-disposition header", async () => {
    // given
    const url = "http://example.com/test.txt";
    const response = {
      statusCode: 200,
      headers: {
        "content-disposition": "attachment; filename=test.txt",
        "content-type": "text/plain"
      },
      on: jest.fn().mockImplementation(RECURSIVE_ON.on)
    };
    const client = {
      get: jest.fn().mockImplementation((url, callback) => callback(response))
    };

    // when
    jest.spyOn(http, "get").mockImplementation(client.get);
    const result = await downloadFile(url);

    // then
    expect(result.filename).toBe("test.txt");
  });

  it("should generate random filename when content-disposition header is missing", async () => {
    // given
    const url = "http://example.com/test.txt";
    const response = {
      statusCode: 200,
      headers: {
        "content-type": "text/plain"
      },
      on: jest.fn().mockImplementation(RECURSIVE_ON.on)
    };
    const client = {
      get: jest.fn().mockImplementation((url, callback) => callback(response))
    };

    // when
    jest.spyOn(http, "get").mockImplementation(client.get);
    const result = await downloadFile(url);

    // then
    expect(result.filename).toMatch(/^[a-f0-9-]+.*$/);
  });

  it("should generate filename with extension from content-type header", async () => {
    // given
    const url = "http://example.com/test.txt";
    const response = {
      statusCode: 200,
      headers: {
        "content-type": "application/pdf"
      },
      on: jest.fn().mockImplementation(RECURSIVE_ON.on)
    };
    const client = {
      get: jest.fn().mockImplementation((url, callback) => callback(response))
    };

    // when
    jest.spyOn(http, "get").mockImplementation(client.get);
    const result = await downloadFile(url);

    // then
    expect(result.filename).toMatch(/^[a-f0-9-]+\.pdf$/);
  });
});