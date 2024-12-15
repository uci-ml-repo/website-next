export function abbreviateDecimal(value: number) {
  const abbreviateDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    notation: "compact",
    maximumSignificantDigits: 3,
    minimumSignificantDigits: 1,
  });

  return abbreviateDecimal.format(value);
}

export function abbreviateFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedSize = parseFloat((bytes / Math.pow(1024, i)).toFixed(1));

  return `${formattedSize} ${sizes[i]}`;
}

export function formatEnum(strings: string[]) {
  const lowercaseWords = new Set(["THE", "AND", "OR"]);

  return strings
    .map((str) =>
      str
        .split("_")
        .map((word, index) =>
          !(index === 0) && lowercaseWords.has(word)
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" "),
    )
    .join(", ");
}
