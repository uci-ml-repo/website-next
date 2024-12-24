export function paperUrl({ semanticScholarId }: { semanticScholarId: number }) {
  return `https://api.semanticscholar.org/CorpusID:${semanticScholarId}`;
}
