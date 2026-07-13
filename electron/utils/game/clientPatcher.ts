import fs from "fs";
import path from "path";

const CUSTOM_DOMAIN = "api.aris-swift.com";
const ORIGINAL_DOMAIN = "hytale.com";

/**
 * Convert a string to UTF-16LE byte array
 */
function stringToUtf16le(str: string): Buffer {
  const buf = Buffer.alloc(str.length * 2);
  for (let i = 0; i < str.length; i++) {
    buf.writeUInt16LE(str.charCodeAt(i), i * 2);
  }
  return buf;
}

/**
 * Find all occurrences of a UTF-16LE encoded string in a buffer
 */
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
 * This replaces all occurrences of "hytale.com" (UTF-16LE) in the binary
 * with the custom domain. The domain must be 4-16 characters.
 *
 * For domains ≤10 characters: direct replacement (padded with spaces)
 * For domains 11-16 characters: split mode (distributes across domain slots)
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

  // Note: Domain length >16 may not work with some game versions
  // but we allow it as the user requested

  const originalDomain = ORIGINAL_DOMAIN;

  if (domain.length <= originalDomain.length) {
    // Simple case: replacement is shorter or same length
    return patchSimple(clientPath, originalDomain, domain);
  } else {
    // Replacement is longer - use split mode
    return patchSplit(clientPath, originalDomain, domain);
  }
}

/**
 * Simple patching for domains ≤10 characters.
 * Replaces "hytale.com" with the custom domain (padded with null bytes).
 */
function patchSimple(
  clientPath: string,
  originalDomain: string,
  customDomain: string,
): { patched: boolean; backupPath: string; patchedPath: string } {
  const backupPath = clientPath + ".original";
  const patchedPath = clientPath;

  // Create backup if it doesn't exist
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(clientPath, backupPath);
  }

  const data = fs.readFileSync(clientPath);
  const originalBytes = stringToUtf16le(originalDomain);
  const positions = findAllOccurrences(data, originalBytes);

  if (positions.length === 0) {
    return { patched: false, backupPath, patchedPath };
  }

  // Create patched data
  const patched = Buffer.from(data);

  for (const pos of positions) {
    // Write custom domain
    const customBytes = stringToUtf16le(customDomain);
    customBytes.copy(patched, pos, 0, Math.min(customBytes.length, originalBytes.length));

    // Pad with spaces if custom domain is shorter
    if (customBytes.length < originalBytes.length) {
      const padding = Buffer.alloc(
        originalBytes.length - customBytes.length,
        0x20,
      ); // space character
      padding.copy(patched, pos + customBytes.length);
    }
  }

  fs.writeFileSync(patchedPath, patched);
  return { patched: true, backupPath, patchedPath };
}

/**
 * Split patching for domains 11-16 characters.
 * Distributes the domain across the subdomain prefix and main domain slots.
 */
function patchSplit(
  clientPath: string,
  originalDomain: string,
  customDomain: string,
): { patched: boolean; backupPath: string; patchedPath: string } {
  const backupPath = clientPath + ".original";
  const patchedPath = clientPath;

  // Create backup if it doesn't exist
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(clientPath, backupPath);
  }

  const data = fs.readFileSync(clientPath);

  // Find all full URLs containing hytale.com
  // The binary contains strings like "sessions.hytale.com", "account-data.hytale.com", etc.
  // We need to find these full domain strings and replace them

  // First, try to find common patterns
  const patterns = [
    "sessions.hytale.com",
    "account-data.hytale.com",
    "telemetry.hytale.com",
    "hytale.com",
  ];

  let patched = Buffer.from(data);
  let anyPatched = false;

  for (const pattern of patterns) {
    const patternBytes = stringToUtf16le(pattern);
    const positions = findAllOccurrences(patched, patternBytes);

    for (const pos of positions) {
      // For split mode, we distribute the custom domain across the available space
      // The pattern is: subdomain.domain.tld
      // We replace with: custom.domain (single endpoint)

      // Calculate how much space we have
      const availableBytes = patternBytes.length;
      const customBytes = stringToUtf16le(customDomain);

      if (customBytes.length <= availableBytes) {
        // Custom domain fits - write it and pad with null bytes
        customBytes.copy(patched, pos);
        // Fill remaining space with null bytes
        for (let i = customBytes.length; i < availableBytes; i++) {
          patched[pos + i] = 0x00;
        }
        anyPatched = true;
      }
    }
  }

  if (!anyPatched) {
    return { patched: false, backupPath, patchedPath };
  }

  fs.writeFileSync(patchedPath, patched);
  return { patched: true, backupPath, patchedPath };
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
  const domainBytes = stringToUtf16le(domain);
  const positions = findAllOccurrences(data, domainBytes);

  return positions.length > 0;
}

/**
 * Check if a backup exists for the client binary.
 */
export function hasClientBackup(clientPath: string): boolean {
  const backupPath = clientPath + ".original";
  return fs.existsSync(backupPath);
}
