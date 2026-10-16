import assert from "node:assert/strict";
import { test } from "node:test";

import { countZipFiles, zipDirectoryLocation } from "./zip";

function directoryEntry(name: string, encrypted = false) {
  const header = Buffer.alloc(46);
  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(encrypted ? 1 : 0, 8);
  header.writeUInt16LE(Buffer.byteLength(name), 28);
  return Buffer.concat([header, Buffer.from(name)]);
}

function endRecord(entries: number, size: number, start = 100, comment = "") {
  const header = Buffer.alloc(22);
  header.writeUInt32LE(0x06054b50, 0);
  header.writeUInt16LE(entries, 8);
  header.writeUInt16LE(entries, 10);
  header.writeUInt32LE(size, 12);
  header.writeUInt32LE(start, 16);
  header.writeUInt16LE(Buffer.byteLength(comment), 20);
  return Buffer.concat([header, Buffer.from(comment)]);
}

test("ZIP validation counts files while excluding directory entries", () => {
  const directory = Buffer.concat([
    directoryEntry("data/"),
    directoryEntry("data/train.csv"),
    directoryEntry("data/test.csv"),
  ]);
  const tail = endRecord(3, directory.length, 100, "Dataset archive");
  assert.deepEqual(zipDirectoryLocation(tail, 100 + directory.length + tail.length), {
    start: 100,
    size: directory.length,
    entries: 3,
  });
  assert.equal(countZipFiles(directory, 3), 2);
});

test("ZIP validation rejects missing, truncated, empty, and oversized directories", () => {
  assert.throws(() => zipDirectoryLocation(Buffer.from("not a ZIP"), 9));
  assert.throws(() => zipDirectoryLocation(endRecord(0, 0), 122));
  assert.throws(() => zipDirectoryLocation(endRecord(10_001, 100), 222));
  assert.throws(() => countZipFiles(directoryEntry("data.csv").subarray(0, 40), 1));
  assert.throws(() => countZipFiles(directoryEntry("folder/"), 1));
  assert.throws(() => countZipFiles(directoryEntry("data.csv"), 2));
});

test("ZIP validation rejects encrypted files and unsafe file paths", () => {
  assert.throws(() => countZipFiles(directoryEntry("data.csv", true), 1));
  for (const name of [
    "../data.csv",
    "/data.csv",
    "nested/../../data.csv",
    "C:/data.csv",
    "nested\\data.csv",
    "data\0.csv",
  ]) {
    assert.throws(() => countZipFiles(directoryEntry(name), 1), name);
  }
});

test("ZIP validation rejects split volumes, ZIP64 markers, trailing garbage, and inconsistent offsets", () => {
  const split = endRecord(1, 50);
  split.writeUInt16LE(1, 4);
  assert.throws(() => zipDirectoryLocation(split, 172));
  assert.throws(() => zipDirectoryLocation(endRecord(65_535, 50), 172));
  assert.throws(() =>
    zipDirectoryLocation(Buffer.concat([endRecord(1, 50), Buffer.from("junk")]), 176),
  );
  assert.throws(() => zipDirectoryLocation(endRecord(1, 50, 1_000), 172));
});
