/**
 *
 * @param startYear Starting year. Defaults to current year.
 * @returns Single year or year range (e.g. "2012" or "2012-2015")
 */
export function copyrightYear(startYear: number | null | undefined): string {
  const currentYear = new Date().getFullYear();
  startYear = startYear ?? currentYear;
  return startYear < currentYear
    ? `${startYear}-${currentYear}`
    : `${startYear}`;
}
