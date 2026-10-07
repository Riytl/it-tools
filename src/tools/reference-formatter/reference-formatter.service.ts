export type ReferenceType = 'journal' | 'book' | 'website'
export type ReferenceStyle = 'gbt' | 'apa'

export interface ReferenceInput {
  authors: string
  title: string
  year: string
  source: string
  url?: string
  type: ReferenceType
  volume?: string
  issue?: string
  pages?: string
  edition?: string
  place?: string
  accessDate?: string
  doi?: string
}

function clean(value?: string) {
  return value?.trim() || undefined;
}

function formatJournal(input: ReferenceInput, style: ReferenceStyle, authors: string, title: string, source: string, year: string) {
  const volume = clean(input.volume);
  const issue = clean(input.issue);
  const pages = clean(input.pages);
  const doi = clean(input.doi);
  const doiUrl = doi ? `https://doi.org/${doi.replace(/^(?:https?:\/\/(dx\.)?doi\.org\/|doi:\s*)/i, '')}` : undefined;

  if (style === 'gbt') {
    const issueAndVolume = volume || issue ? `, ${volume ?? ''}${issue ? `(${issue})` : ''}` : '';
    const pageRange = pages ? `: ${pages}` : '';
    return `${authors}. ${title}[J]. ${source}, ${year}${issueAndVolume}${pageRange}.${doiUrl ? ` DOI: ${doiUrl}.` : ''}`;
  }

  const issueAndVolume = volume ? `, ${volume}${issue ? `(${issue})` : ''}` : issue ? `, (${issue})` : '';
  const pageRange = pages ? `, ${pages}` : '';
  return `${authors}. (${year}). ${title}. ${source}${issueAndVolume}${pageRange}.${doiUrl ? ` ${doiUrl}` : ''}`;
}

function formatBook(input: ReferenceInput, style: ReferenceStyle, authors: string, title: string, publisher: string, year: string) {
  const edition = clean(input.edition);
  const place = clean(input.place);

  if (style === 'gbt') {
    const editionText = edition ? `. ${edition}` : '';
    const publisherText = place ? `${place}: ${publisher}` : publisher;
    return `${authors}. ${title}[M]${editionText}. ${publisherText}, ${year}.`;
  }

  const editionText = edition ? ` (${edition})` : '';
  return `${authors}. (${year}). ${title}${editionText}. ${publisher}.`;
}

function formatWebsite(input: ReferenceInput, style: ReferenceStyle, authors: string, title: string, year: string, url: string) {
  const siteName = clean(input.source);
  const accessDate = clean(input.accessDate);

  if (style === 'gbt') {
    const sourceText = siteName ? `${siteName}, ` : '';
    const accessText = accessDate ? ` [${accessDate}]` : '';
    return `${authors}. ${title}[EB/OL]. ${sourceText}${year}${accessText}. ${url}.`;
  }

  const siteText = siteName ? ` ${siteName}.` : '';
  const accessText = accessDate ? ` Retrieved ${accessDate}, from` : '';
  return `${authors}. (${year}). ${title}.${siteText}${accessText} ${url}.`;
}

/** Generate a citation draft from fields the user has supplied; this does not validate full style compliance. */
export function formatReference(input: ReferenceInput, style: ReferenceStyle) {
  const authors = clean(input.authors);
  const title = clean(input.title);
  const source = clean(input.source);
  const year = clean(input.year);
  const url = clean(input.url);

  if (!authors || !title || !year) {
    return undefined;
  }

  if (input.type === 'journal') {
    return source ? formatJournal(input, style, authors, title, source, year) : undefined;
  }

  if (input.type === 'book') {
    return source ? formatBook(input, style, authors, title, source, year) : undefined;
  }

  return url ? formatWebsite(input, style, authors, title, year, url) : undefined;
}
