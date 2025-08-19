import type { AuthorSelect } from "@packages/db/types";

export class Citation {
  private static readonly source = "UCI Machine Learning Repository";
  private static readonly doiLinkPrefix = "https://doi.org/";

  private static readonly longConjunction = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });

  private static readonly shortConjunction = new Intl.ListFormat("en", {
    style: "short",
    type: "conjunction",
  });

  private static noConjunction = new Intl.ListFormat("en", {
    style: "short",
    type: "unit",
  });

  private readonly id: number;
  private readonly title: string;
  private readonly authors: AuthorSelect[];
  private readonly yearCreated: number | null;
  private readonly doi: string | null;

  constructor({
    id,
    title,
    authors,
    yearCreated,
    doi,
  }: {
    id: number;
    title: string;
    authors: AuthorSelect[];
    yearCreated: number | null;
    doi: string | null;
  }) {
    this.id = id;
    this.title = title;
    this.authors = authors;
    this.yearCreated = yearCreated;
    this.doi = doi;
  }

  private static lastFirst(author: AuthorSelect) {
    return `${author.lastName}, ${author.firstName}`;
  }

  private static firstLast(author: AuthorSelect) {
    return `${author.firstName} ${author.lastName}`;
  }

  private static firstInitialLast(author: AuthorSelect) {
    return `${Citation.toInitial(author.firstName)} ${author.lastName}`;
  }

  private static lastFirstInitial(author: AuthorSelect) {
    return `${author.lastName}, ${Citation.toInitial(author.firstName)}`;
  }

  private static lastFirstInitialNoPunctuation(author: AuthorSelect) {
    return `${author.lastName} ${Citation.toInitial(author.firstName, false)}`;
  }

  private static toInitial(name: string, punctuate = true) {
    if (!name.charAt(0)) {
      return "";
    }

    return name.charAt(0).toUpperCase() + (punctuate ? "." : "");
  }

  private static formatAuthors({
    authors,
    firstAuthorFormatter,
    subsequentAuthorsFormatter = firstAuthorFormatter,
    etAlCutoff = -1,
    listFormatter = Citation.longConjunction,
  }: {
    authors: AuthorSelect[];
    firstAuthorFormatter: (author: AuthorSelect) => string;
    subsequentAuthorsFormatter?: (author: AuthorSelect) => string;
    etAlCutoff?: number;
    listFormatter?: typeof Citation.longConjunction;
  }) {
    if (authors.length === 0) return "";

    if (etAlCutoff > 0 && authors.length > etAlCutoff) {
      const firstAuthor = firstAuthorFormatter(authors[0]);
      return listFormatter.format([`${firstAuthor}, et al`]);
    }

    const formattedAuthors = authors.map((author, index) =>
      index === 0 ? firstAuthorFormatter(author) : subsequentAuthorsFormatter(author),
    );

    return listFormatter.format(formattedAuthors);
  }

  public allCitations() {
    return {
      apa: this.apa(),
      mla: this.mla(),
      chicago: this.chicago(),
      vancouver: this.vancouver(),
      ieee: this.ieee(),
      bibtex: this.bibtex(),
    };
  }

  public apa() {
    const formattedAuthors = Citation.formatAuthors({
      authors: this.authors,
      firstAuthorFormatter: Citation.lastFirstInitial,
      subsequentAuthorsFormatter: Citation.lastFirstInitial,
      listFormatter: Citation.shortConjunction,
    });

    const year = this.yearCreated ? `(${this.yearCreated}).` : undefined;
    const title = `${this.title} [Dataset].`;
    const authorsYearTitle = this.authors.length
      ? `${formattedAuthors} ${year ? `${year} ` : ""}${title}`
      : `${title}${year ? ` ${year}` : ""}`;
    const source = `${Citation.source}.`;
    const doi = this.doi ? `${Citation.doiLinkPrefix}${this.doi}.` : "";

    const parts = [authorsYearTitle, source, doi].filter((part) => !!part);
    const citation = parts.join(" ");
    return citation.trim();
  }

  public mla() {
    const formattedAuthors = Citation.formatAuthors({
      authors: this.authors,
      firstAuthorFormatter: Citation.lastFirst,
      subsequentAuthorsFormatter: Citation.firstLast,
      etAlCutoff: 3,
    });

    const authors = this.authors.length ? `${formattedAuthors}.` : "";
    const title = `"${this.title}."`;
    const source = `${Citation.source},`;
    const year = this.yearCreated ? `${this.yearCreated},` : undefined;
    const doi = this.doi ? `${Citation.doiLinkPrefix}${this.doi}.` : "";

    const parts = [authors, title, source, year, doi].filter((part) => !!part);
    const mla = parts.join(" ");
    return mla.trim();
  }

  public chicago(): string {
    const formattedAuthors = Citation.formatAuthors({
      authors: this.authors,
      firstAuthorFormatter: Citation.lastFirst,
      subsequentAuthorsFormatter: Citation.firstLast,
    });

    const year = this.yearCreated ? `${this.yearCreated}.` : undefined;
    const title = `${this.title}.`;
    const authorsYearTitle = this.authors.length
      ? `${formattedAuthors}. ${year ? `${year} ` : ""}${title}`
      : `${title}${year ? ` ${year}` : ""}`;
    const source = `${Citation.source}.`;
    const doi = this.doi ? `${Citation.doiLinkPrefix}${this.doi}.` : "";

    const parts = [authorsYearTitle, source, doi].filter((part) => !!part);
    const chicago = parts.join(" ");
    return chicago.trim();
  }

  public vancouver(): string {
    const formattedAuthors = Citation.formatAuthors({
      authors: this.authors,
      firstAuthorFormatter: Citation.lastFirstInitialNoPunctuation,
      subsequentAuthorsFormatter: Citation.lastFirstInitialNoPunctuation,
      etAlCutoff: 6,
      listFormatter: Citation.noConjunction,
    });

    const authors = this.authors.length ? `${formattedAuthors}.` : "";
    const title = `${this.title} [dataset].`;
    const year = this.yearCreated ? `${this.yearCreated}.` : undefined;
    const source = `${Citation.source}.`;
    const doi = this.doi ? `Available from: ${Citation.doiLinkPrefix}${this.doi}.` : "";

    const parts = [authors, title, year, source, doi].filter((part) => !!part);
    const vancouver = parts.join(" ");
    return vancouver.trim();
  }

  public ieee(): string {
    const formattedAuthors = Citation.formatAuthors({
      authors: this.authors,
      firstAuthorFormatter: Citation.firstInitialLast,
      subsequentAuthorsFormatter: Citation.firstInitialLast,
      etAlCutoff: 6,
    });

    const authors = this.authors.length ? `${formattedAuthors}.` : "";
    const title = `"${this.title},"`;
    const source = `${Citation.source}${this.yearCreated ? "," : "."}`;
    const year = this.yearCreated ? `${this.yearCreated}.` : undefined;
    const doi = this.doi ? `Available: ${Citation.doiLinkPrefix}${this.doi}.` : "";

    const parts = [authors, title, source, year, "[Online].", doi].filter((part) => !!part);
    const ieee = parts.join(" ");
    return ieee.trim();
  }

  public bibtex(): string {
    function formatField(name: string, value: string | number) {
      return name.padEnd(13, " ").padStart(15, " ") + `= {${value}}`;
    }

    const formattedAuthors = Citation.formatAuthors({
      authors: this.authors,
      firstAuthorFormatter: Citation.lastFirst,
      subsequentAuthorsFormatter: Citation.lastFirst,
      etAlCutoff: -1,
    });

    const identifier = `${this.title.toLowerCase().replace(/ /g, "_")}_${this.id}`;
    const authors = this.authors.length ? formatField("author", formattedAuthors) : "";
    const title = formatField("title", `{${this.title}}`);
    const year = this.yearCreated ? formatField("year", this.yearCreated) : undefined;
    const howPublished = formatField("howpublished", Citation.source);
    const doi = this.doi ? formatField("note", `{DOI}: ${Citation.doiLinkPrefix}${this.doi}`) : "";

    const fields = [identifier, authors, title, year, howPublished, doi]
      .filter((field) => !!field)
      .join(",\n");

    return `@misc{${fields}\n}`;
  }
}
