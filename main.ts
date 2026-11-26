// Entry point for the newspaper: takes the rendered entry.png that sits
// next to this file and hands it to the grader's output folder, proving
// along the way that the file is a real 1024x1024 PNG under 1 MiB and that
// the delivered copy matches the original bit for bit.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The eight bytes that open every PNG file.
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
// Nothing larger than this is accepted.
const MAX_FILE_BYTES = 1024 * 1024;
// The page has to be a square of exactly this edge length.
const REQUIRED_EDGE = 1024;

function failNow(reason: string): never {
  console.error(`cannot publish entry.png: ${reason}`);
  process.exit(1);
}

function digestHex(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

// Pulls width and height from the IHDR chunk, but only after proving the
// bytes are a PNG at all. Layout after the 8-byte signature: a 4-byte
// length, the four letters "IHDR", then width and height, each a big-endian
// 32-bit unsigned integer.
function readDimensions(bytes: Buffer): { width: number; height: number } {
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    failNow("entry.png does not start with the PNG signature");
  }
  if (bytes.toString("ascii", 12, 16) !== "IHDR") {
    failNow("entry.png is missing its IHDR chunk");
  }
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

// Where the finished page has to land. The environment variable wins;
// without it the grader's default folder is used.
function outputFolder(): string {
  const wanted = (process.env.MAKEFUN_OUTPUT_DIR || "").trim();
  return resolve(wanted === "" ? "/output" : wanted);
}

// Writes the bytes out and reads them straight back, comparing digests so
// a short or corrupted write can never slip through unnoticed.
function deliverCopy(imageBytes: Buffer, destPath: string): void {
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, imageBytes);
  const writtenBack = readFileSync(destPath);
  const sourceHash = digestHex(imageBytes);
  const copyHash = digestHex(writtenBack);
  if (sourceHash !== copyHash) {
    failNow(`delivered file differs from source: ${sourceHash} vs ${copyHash}`);
  }
  console.log(`entry.png delivered: ${imageBytes.length} bytes, sha256 ${sourceHash}`);
}

function main(): void {
  const repoRoot = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(repoRoot, "entry.png");
  if (!existsSync(sourcePath)) {
    failNow(`no entry.png at ${sourcePath}`);
  }

  const imageBytes = readFileSync(sourcePath);
  const { width, height } = readDimensions(imageBytes);
  if (width !== REQUIRED_EDGE || height !== REQUIRED_EDGE) {
    failNow(`entry.png measures ${width}x${height}, not ${REQUIRED_EDGE}x${REQUIRED_EDGE}`);
  }
  if (imageBytes.length > MAX_FILE_BYTES) {
    failNow(`entry.png is ${imageBytes.length} bytes, above the ${MAX_FILE_BYTES} byte cap`);
  }

  deliverCopy(imageBytes, join(outputFolder(), "entry.png"));
}

main();
