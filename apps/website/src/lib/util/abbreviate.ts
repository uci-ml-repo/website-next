export function abbreviateDecimal(value: number, significantDigits = 3) {
  const abbreviateDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    notation: "compact",
    maximumSignificantDigits: significantDigits,
    minimumSignificantDigits: 1,
  });

  return abbreviateDecimal.format(value);
}

export function abbreviateFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  if (bytes === 1) return "1 Byte";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedSize = parseFloat((bytes / Math.pow(1024, i)).toFixed(1));

  return `${formattedSize} ${sizes[i]}`;
}

export function abbreviateTime(seconds: number) {
  let value: number;
  let unit: string;

  if (seconds < 60) {
    value = seconds;
    unit = "s";
  } else if (seconds < 3600) {
    value = seconds / 60;
    unit = "min";
  } else if (seconds < 86400) {
    value = seconds / 3600;
    unit = "h";
  } else {
    value = seconds / 86400;
    unit = "d";
  }

  return `${Math.ceil(value)} ${unit}`;
}
