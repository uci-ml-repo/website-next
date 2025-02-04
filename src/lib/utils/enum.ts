export function enumToArray<T extends Record<string, string>>(
  enumType: T,
): [T[keyof T], ...T[keyof T][]] {
  const values = Object.values(enumType);
  if (values.length === 0) {
    throw new Error("Enum must have at least one value");
  }
  return values as [T[keyof T], ...T[keyof T][]];
}

export function formatEnum(
  enumString: string | string[],
  titleCase: boolean = true,
) {
  const lowercaseWords = new Set(["the", "and", "or"]);

  function formatSingleEnum(str: string) {
    return str
      .split("_")
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : lowercaseWords.has(word) || !titleCase
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(" ");
  }

  if (typeof enumString === "string") {
    return formatSingleEnum(enumString);
  }

  return enumString.map(formatSingleEnum).join(", ");
}
