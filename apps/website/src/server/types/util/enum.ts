export function formatEnum(enumString: string | string[], titleCase: boolean = true) {
  const lowercaseWords = ["the", "and", "or"];

  function formatSingleEnum(str: string) {
    return str
      .split("_")
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : lowercaseWords.includes(word) || !titleCase
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
