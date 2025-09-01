import { useEffect, useState } from 'react';
import { pdfWorks } from '@/data/pdfWorks';
import { renderFirstPageToDataUrl } from '@/lib/pdfPreview';

export function useSeriesCover(seriesName: string) {
  const [cover, setCover] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const key = `series-cover|${seriesName}`;
        const cached = localStorage.getItem(key);
        if (cached) {
          setCover(cached);
          setLoading(false);
          return;
        }

        const works = pdfWorks.filter((w) => w.series === seriesName);
        for (const w of works) {
          try {
            const img = await renderFirstPageToDataUrl(w.pdfUrlRaw, { width: 600 });
            if (!cancelled && img) {
              setCover(img);
              try { localStorage.setItem(key, img); } catch {}
              break;
            }
          } catch {
            // try next work if this one fails (404, CORS, ...)
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [seriesName]);

  return { cover, loading };
}
