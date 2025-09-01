import { useEffect, useState } from 'react';
import { renderFirstPageToDataUrl } from '@/lib/pdfPreview';

export function usePdfCover(pdfUrl: string | undefined, initial?: string) {
  const [cover, setCover] = useState<string | undefined>(initial);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!pdfUrl || cover) return;
      setLoading(true);
      try {
        const img = await renderFirstPageToDataUrl(pdfUrl, { width: 600 });
        if (!cancelled) setCover(img);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to render PDF cover');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  return { cover, loading, error };
}
