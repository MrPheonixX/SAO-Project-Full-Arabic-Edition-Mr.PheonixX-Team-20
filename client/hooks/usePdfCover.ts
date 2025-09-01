import { useEffect, useState } from 'react';
import { renderFirstPageToDataUrl } from '@/lib/pdfPreview';

export function usePdfCover(pdfUrl: string | undefined, initial?: string) {
  const [cover, setCover] = useState<string | undefined>(initial);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!pdfUrl) return;

      const width = 600;
      const key = `pdf-cover|${pdfUrl}|${width}`;

      // Try localStorage cache first
      try {
        const cached = localStorage.getItem(key);
        if (cached && !cover) {
          setCover(cached);
          return;
        }
      } catch (_) {
        // ignore storage errors (e.g., privacy mode)
      }

      if (cover) return;

      setLoading(true);
      try {
        const img = await renderFirstPageToDataUrl(pdfUrl, { width });
        if (!cancelled) {
          setCover(img);
          try {
            localStorage.setItem(key, img);
          } catch (_) {
            // ignore storage quota errors
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to render PDF cover');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    // If we already have an initial cover, persist it for future loads
    if (initial && pdfUrl && !cover) {
      const width = 600;
      const key = `pdf-cover|${pdfUrl}|${width}`;
      try {
        localStorage.setItem(key, initial);
      } catch (_) {
        // ignore storage errors
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  return { cover, loading, error };
}
