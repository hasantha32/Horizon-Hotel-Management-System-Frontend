export function formatSlug(inputString: string): string {
  if (!inputString) return '';
  /* This line is replacing any whitespace with hyphens (`-`) and converting the string to lowercase. */
  const replacedString = inputString.replace(/\s+/g, '-').toLowerCase();
  /* This Line is removing any trailing hyphens from the `replacedString`. */
  const trimmedString = replacedString.replace(/-+$/, '');
  return trimmedString;
}
