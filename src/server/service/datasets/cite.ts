import { db } from "@/db";
import type { AuthorsSelect } from "@/db/types";
import ServiceError from "@/server/service/errors";

export default class DatasetsCiteService {
  async byDatasetId(id: number) {
    const dataset = await db.query.datasets.findFirst({
      where: (dataset, { eq }) => eq(dataset.id, id),
      with: {
        authors: true,
      },
    });

    if (!dataset) {
      throw new ServiceError({
        reason: "Dataset Not Found",
        origin: "Dataset",
      });
    }

    const citation = new Citation(dataset);

    return citation.allCitations();
  }
}

class Citation {
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
  private readonly authors: AuthorsSelect[];
  private readonly yearCreated: number;
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
    authors: AuthorsSelect[];
    yearCreated: number | null;
    doi: string | null;
  }) {
    this.id = id;
    this.title = title;
    this.authors = authors;
    this.yearCreated = yearCreated ?? 0;
    this.doi = doi;
  }

  private static lastFirst(author: AuthorsSelect) {
    return `${author.lastName}, ${author.firstName}`;
  }

  private static firstLast(author: AuthorsSelect) {
    return `${author.firstName} ${author.lastName}`;
  }

  private static firstInitialLast(author: AuthorsSelect) {
    return `${Citation.toInitial(author.firstName)} ${author.lastName}`;
  }

  private static lastFirstInitial(author: AuthorsSelect) {
    return `${author.lastName}, ${Citation.toInitial(author.firstName)}`;
  }

  private static lastFirstInitialNoPunctuation(author: AuthorsSelect) {
    return `${author.lastName} ${Citation.toInitial(author.firstName, false)}`;
  }

  public static toInitial(name: string, punctuate = true) {
    if (!name.charAt(0)) {
      return "";
    }

    return name.charAt(0).toUpperCase() + (punctuate ? "." : "");
  }

  /**
   * Formats a list of authors in the given style.
   *
   * @param authors the list of authors to format
   * @param firstAuthorFormatter the formatter for the first author
   * @param subsequentAuthorsFormatter the formatter for subsequent authors (can be the same as the first)
   * @param etAlCutoff the number of authors to display before using "[first author] et al.", or -1 to disable
   * @param listFormatter the list formatter to use to join the authors
   *
   * @returns the formatted list of authors
   */
  private static formatAuthors({
    authors,
    firstAuthorFormatter,
    subsequentAuthorsFormatter = firstAuthorFormatter,
    etAlCutoff = -1,
    listFormatter = Citation.longConjunction,
  }: {
    authors: AuthorsSelect[];
    firstAuthorFormatter: (author: AuthorsSelect) => string;
    subsequentAuthorsFormatter?: (author: AuthorsSelect) => string;
    etAlCutoff?: number;
    listFormatter?: typeof Citation.longConjunction;
  }) {
    if (authors.length === 0) return "";

    // using et al.
    if (etAlCutoff > 0 && authors.length > etAlCutoff) {
      const firstAuthor = firstAuthorFormatter(authors[0]);
      return listFormatter.format([`${firstAuthor}, et al`]);
    }

    // normal formatting without et al.
    const formattedAuthors = authors.map((author, index) =>
      index === 0
        ? firstAuthorFormatter(author)
        : subsequentAuthorsFormatter(author),
    );

    return listFormatter.format(formattedAuthors);
  }

  /**
   * Returns all citation formats for this dataset.
   *
   * @returns all citation formats
   */
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

  /**
   * APA citation format
   *
   * @example `Iris [Dataset]. (1936). UCI Machine Learning Repository. https://doi.org/10.24432/C56C76.`
   *
   * @see https://libguides.murdoch.edu.au/APA/dataset
   */
  public apa() {
    const formattedAuthors = Citation.formatAuthors({
      authors: this.authors,
      firstAuthorFormatter: Citation.lastFirstInitial,
      subsequentAuthorsFormatter: Citation.lastFirstInitial,
      listFormatter: Citation.shortConjunction,
    });

    const year = `(${this.yearCreated}).`;
    const title = `${this.title} [Dataset].`;
    const authorsYearTitle = this.authors.length
      ? `${formattedAuthors} ${year} ${title}`
      : `${title} ${year}`;
    const source = `${Citation.source}.`;
    const doi = this.doi ? `${Citation.doiLinkPrefix}${this.doi}.` : "";

    const citation = `${authorsYearTitle} ${source} ${doi}`;
    return citation.trim();
  }

  /**
   * MLA citation format
   *
   * @see https://libguides.murdoch.edu.au/MLA/internet
   */
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
    const year = `${this.yearCreated},`;
    const doi = this.doi ? `${Citation.doiLinkPrefix}${this.doi}.` : "";

    const mla = `${authors} ${title} ${source} ${year} ${doi}`;
    return mla.trim();
  }

  /**
   * Chicago citation format
   *
   * @see https://libguides.murdoch.edu.au/Chicago/dataset
   */
  public chicago(): string {
    const formattedAuthors = Citation.formatAuthors({
      authors: this.authors,
      firstAuthorFormatter: Citation.lastFirst,
      subsequentAuthorsFormatter: Citation.firstLast,
    });

    const year = `${this.yearCreated}.`;
    const title = `${this.title}.`;
    const authorsYearTitle = this.authors.length
      ? `${formattedAuthors}. ${year} ${title}`
      : `${title} ${year}`;
    const source = `${Citation.source}.`;
    const doi = this.doi ? `${Citation.doiLinkPrefix}${this.doi}.` : "";

    const chicago = `${authorsYearTitle} ${source} ${doi}`;
    return chicago.trim();
  }

  /**
   * Vancouver citation format
   *
   * @see https://libguides.murdoch.edu.au/Vancouver/dataset
   */
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
    const year = `${this.yearCreated}.`;
    const source = `${Citation.source}.`;
    const doi = this.doi
      ? `Available from: ${Citation.doiLinkPrefix}${this.doi}.`
      : "";

    const vancouver = `${authors} ${title} ${year} ${source} ${doi}`;
    return vancouver.trim();
  }

  /**
   * IEEE citation format
   *
   * @see https://libguides.murdoch.edu.au/IEEE/dataset
   */
  public ieee(): string {
    const formattedAuthors = Citation.formatAuthors({
      authors: this.authors,
      firstAuthorFormatter: Citation.firstInitialLast,
      subsequentAuthorsFormatter: Citation.firstInitialLast,
      etAlCutoff: 6,
    });

    const authors = this.authors.length ? `${formattedAuthors}.` : "";
    const title = `"${this.title},"`;
    const source = `${Citation.source},`;
    const year = `${this.yearCreated}.`;
    const doi = this.doi
      ? `Available: ${Citation.doiLinkPrefix}${this.doi}.`
      : "";

    const ieee = `${authors} ${title} ${source} ${year} [Online]. ${doi}`;
    return ieee.trim();
  }

  /**
   * BibTeX citation format
   *
   * @see https://www.bibtex.com/format/
   */
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
    const authors = this.authors.length
      ? formatField("author", formattedAuthors)
      : "";
    const title = formatField("title", `{${this.title}}`);
    const year = formatField("year", this.yearCreated);
    const howPublished = formatField("howpublished", Citation.source);
    const doi = this.doi
      ? formatField("note", `{DOI}: ${Citation.doiLinkPrefix}${this.doi}`)
      : "";

    const fields = [identifier, authors, title, year, howPublished, doi]
      .filter((field) => field !== "")
      .join(",\n");

    return `@misc{${fields}\n}`;
  }
}
