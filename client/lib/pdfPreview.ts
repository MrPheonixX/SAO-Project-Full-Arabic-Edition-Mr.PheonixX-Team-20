import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

export type PdfCoverOptions = {
  width?: number;
  quality?: number;
};

const cache = new Map<string, string>();

export async function renderFirstPageToDataUrl(pdfUrl: string, options: PdfCoverOptions = {}): Promise<string> {
  const key = `${pdfUrl}|${options.width || 600}`;
  if (cache.has(key)) return cache.get(key)!;

  const width = options.width ?? 600;

  GlobalWorkerOptions.workerSrc = workerUrl as unknown as string;

  const loadingTask = getDocument({ url: pdfUrl, withCredentials: false });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 1 });
  const scale = width / viewport.width;
  const scaledViewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D context not available');

  canvas.width = Math.floor(scaledViewport.width);
  canvas.height = Math.floor(scaledViewport.height);

  await page.render({ canvasContext: context, viewport: scaledViewport }).promise;

  const dataUrl = canvas.toDataURL('image/png', options.quality ?? 0.92);
  cache.set(key, dataUrl);
  return dataUrl;
}
