import { jest } from "@jest/globals";
import fs from "fs";
import stream from "stream";
import saveFileStream from "./save-file-stream.mjs";

describe("saveFileStream", () => {
  it("should create directory and write file", async () => {
    // given
    const inputStream = new stream.Readable();
    inputStream.push("test");
    inputStream.push(null);
    const path = "test";
    const filename = "test.txt";

    // when
    const spiedMkdir = jest.spyOn(fs, "mkdir").mockImplementation((_path, _options, callback) => {
      callback();
    });
    const spiedCreateWriteStream = jest.spyOn(fs, "createWriteStream").mockReturnValue(new stream.PassThrough());
    saveFileStream(inputStream, path, filename);

    // then
    expect(spiedMkdir).toHaveBeenCalledTimes(1);
    expect(spiedCreateWriteStream).toHaveBeenCalledTimes(1);
  });
});