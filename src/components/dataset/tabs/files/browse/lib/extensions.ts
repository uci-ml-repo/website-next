export const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".svg",
  ".webp",
  ".avif",
  ".bmp",
  ".ico",
  ".apng",
];

export const videoExtensions = [".mp4", ".webm", ".ogg", ".ogv"];

export const audioExtensions = [".mp3", ".wav", ".oga"];

export const pdfExtensions = [".pdf"];

export const tabularToDelimiter: Record<string, string | RegExp> = {
  ".tsv": "\t",
  ".csv": ",",
  ".data": /,\s*(?=(?:[^"]*"[^"]*")*[^"]*$)|\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/,
  ".test": /,\s*(?=(?:[^"]*"[^"]*")*[^"]*$)|\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/,
};
