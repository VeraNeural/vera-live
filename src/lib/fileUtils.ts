export function isValidImageType(file: File): boolean {
  const allowed = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]);
  return allowed.has(file.type);
}

export function getMediaType(file: File): string {
  return file.type || "application/octet-stream";
}

/**
 * Convert a File to a base64 string (no data: prefix).
 */
export async function fileToBase64(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });

  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) return "";
  return dataUrl.slice(commaIndex + 1);
}
