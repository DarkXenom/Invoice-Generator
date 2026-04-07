export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');

  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const textParts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    let lastY: number | null = null;
    const lines: string[] = [];
    let currentLine = '';

    for (const item of textContent.items) {
      if (!('str' in item)) continue;

      const y = (item as { transform: number[] }).transform[5];

      if (lastY !== null && Math.abs(y - lastY) > 3) {
        // New line detected
        lines.push(currentLine.trim());
        currentLine = '';
      }

      currentLine += (item as { str: string }).str + ' ';
      lastY = y;
    }

    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    textParts.push(lines.join('\n'));
  }

  return textParts.join('\n\n--- Page Break ---\n\n');
}
