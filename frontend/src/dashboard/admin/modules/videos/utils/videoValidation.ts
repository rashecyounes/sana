const MAX_VIDEO_SIZE_MB = 500;

const allowedMimeTypes = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
];

const allowedExtensions = [".mp4", ".mov", ".webm", ".mkv"];

export function validateVideoFile(file: File): string | null {
  const fileSizeMb = file.size / 1024 / 1024;

  if (fileSizeMb > MAX_VIDEO_SIZE_MB) {
    return `Video is too large. Maximum allowed size is ${MAX_VIDEO_SIZE_MB}MB.`;
  }

  const fileName = file.name.toLowerCase();

  const hasAllowedExtension = allowedExtensions.some((extension) =>
    fileName.endsWith(extension)
  );

  if (!hasAllowedExtension) {
    return "Unsupported video extension. Please upload MP4, MOV, WEBM, or MKV.";
  }

  if (file.type && !allowedMimeTypes.includes(file.type)) {
    return "Unsupported video type. Please use MP4, MOV, WEBM, or MKV.";
  }

  return null;
}