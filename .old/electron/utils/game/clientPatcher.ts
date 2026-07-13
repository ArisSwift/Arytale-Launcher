import fs from "fs";

const CUSTOM_DOMAIN = "api.aris-swift.com";
const ORIGINAL_DOMAIN = "hytale.com";

function findAllOccurrences(haystack: Buffer, needle: Buffer): number[] {
  const positions: number[] = [];
  const needleLen = needle.length;
  for (let i = 0; i <= haystack.length - needleLen; i++) {
    if (haystack.subarray(i, i + needleLen).equals(needle)) {
      positions.push(i);
    }
  }
  return positions;
}

/**
 * Patch the Hytale client binary to redirect auth traffic to a custom domain.
 *
 * Tries both UTF-8 (.NET assemblies) and UTF-16LE (native binaries).
 * Finds full URL patterns (e.g. "sessions.hytale.com") and replaces them
 * with the custom domain, padded with null bytes.
 */
export function patchClientBinary(
  clientPath: string,
  domain: string = CUSTOM_DOMAIN,
): { patched: boolean; backupPath: string; patchedPath: string } {
  if (domain.length < 4) {
    throw new Error(
      `Domain "${domain}" must be at least 4 characters (got ${domain.length})`,
    );
  }

  const backupPath = clientPath + ".original";
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(clientPath, backupPath);
  }

  const data = fs.readFileSync(clientPath);

  const patterns = [
    "sessions.hytale.com",
    "account-data.hytale.com",
    "api.hytale.com",
    "telemetry.hytale.com",
    "hytale.com",
  ];

  // Try UTF-8 first (.NET assemblies store strings as UTF-8 in #Strings heap)
  const utf8Result = patchWithEncoding(data, patterns, domain, "utf8");
  if (utf8Result.anyPatched) {
    fs.writeFileSync(clientPath, utf8Result.patched);
    return { patched: true, backupPath, patchedPath: clientPath };
  }

  // Fall back to UTF-16LE (native binaries)
  const utf16Result = patchWithEncoding(data, patterns, domain, "utf16le");
  if (utf16Result.anyPatched) {
    fs.writeFileSync(clientPath, utf16Result.patched);
    return { patched: true, backupPath, patchedPath: clientPath };
  }

  return { patched: false, backupPath, patchedPath: clientPath };
}

function patchWithEncoding(
  data: Buffer,
  patterns: string[],
  domain: string,
  encoding: "utf8" | "utf16le",
): { patched: boolean; patched: Buffer } {
  let patched = Buffer.from(data);
  let anyPatched = false;

  for (const pattern of patterns) {
    const patternBytes =
      encoding === "utf8"
        ? Buffer.from(pattern, "utf-8")
        : Buffer.from(pattern, "utf16le");

    const positions = findAllOccurrences(patched, patternBytes);

    for (const pos of positions) {
      const customBytes =
        encoding === "utf8"
          ? Buffer.from(domain, "utf-8")
          : Buffer.from(domain, "utf16le");

      if (customBytes.length <= patternBytes.length) {
        customBytes.copy(patched, pos);
        for (let i = customBytes.length; i < patternBytes.length; i++) {
          patched[pos + i] = 0x00;
        }
        anyPatched = true;
      }
    }
  }

  return { patched: anyPatched, patched };
}

/**
 * Restore the original client binary from backup.
 */
export function restoreClientBinary(clientPath: string): boolean {
  const backupPath = clientPath + ".original";

  if (!fs.existsSync(backupPath)) {
    return false;
  }

  fs.copyFileSync(backupPath, clientPath);
  fs.unlinkSync(backupPath);
  return true;
}

/**
 * Check if a client binary is patched.
 */
export function isClientPatched(
  clientPath: string,
  domain: string = CUSTOM_DOMAIN,
): boolean {
  if (!fs.existsSync(clientPath)) {
    return false;
  }

  const data = fs.readFileSync(clientPath);

  // Check both encodings
  const utf8Bytes = Buffer.from(domain, "utf-8");
  if (findAllOccurrences(data, utf8Bytes).length > 0) return true;

  const utf16Bytes = Buffer.from(domain, "utf16le");
  if (findAllOccurrences(data, utf16Bytes).length > 0) return true;

  return false;
}

/**
 * Check if a backup exists for the client binary.
 */
export function hasClientBackup(clientPath: string): boolean {
  const backupPath = clientPath + ".original";
  return fs.existsSync(backupPath);
}
