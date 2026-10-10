/** Downloads a file in the browser. */
export async function saveFile(name: string, content: string, mimeType: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = Object.assign(document.createElement('a'), {
    href: url,
    download: name,
  });
  link.click();
  URL.revokeObjectURL(url);
}
