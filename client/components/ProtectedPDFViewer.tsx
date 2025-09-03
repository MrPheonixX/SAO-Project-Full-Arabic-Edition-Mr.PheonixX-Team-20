import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Bookmark,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

interface ProtectedPDFViewerProps {
  pdfUrl: string;
  title: string;
  titleAr: string;
  series: string;
  volumeNumber?: number;
  onBack?: () => void;
}

type Engine = "native" | "pdfjs";

const ProtectedPDFViewer: React.FC<ProtectedPDFViewerProps> = ({
  pdfUrl,
  title,
  titleAr,
  series,
  volumeNumber,
  onBack,
}) => {
  const [engine, setEngine] = useState<Engine>("native");

  const [isLoading, setIsLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [readProgress, setReadProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [theme, setTheme] = useState<"dark" | "light" | "sepia">("dark");
  const [readingMode, setReadingMode] = useState<"single" | "book" | "slide">(
    "book",
  );
  const [soundOn, setSoundOn] = useState(true);
  const [accent, setAccent] = useState<'cyan'|'violet'|'emerald'|'rose'|'amber'|'blue'>('blue');
  const ACCENTS = {
    cyan:   { border:'border-cyan-500/30', text:'text-cyan-400', bgBadge:'bg-cyan-500/20', hover:'hover:text-cyan-400', dot:'bg-cyan-400' },
    violet: { border:'border-violet-500/30', text:'text-violet-400', bgBadge:'bg-violet-500/20', hover:'hover:text-violet-400', dot:'bg-violet-400' },
    emerald:{ border:'border-emerald-500/30', text:'text-emerald-400', bgBadge:'bg-emerald-500/20', hover:'hover:text-emerald-400', dot:'bg-emerald-400' },
    rose:   { border:'border-rose-500/30', text:'text-rose-400', bgBadge:'bg-rose-500/20', hover:'hover:text-rose-400', dot:'bg-rose-400' },
    amber:  { border:'border-amber-500/30', text:'text-amber-400', bgBadge:'bg-amber-500/20', hover:'hover:text-amber-400', dot:'bg-amber-400' },
    blue:   { border:'border-blue-500/30', text:'text-blue-400', bgBadge:'bg-blue-500/20', hover:'hover:text-blue-400', dot:'bg-blue-400' },
  } as const;
  const A = () => ACCENTS[accent];

  const PDFJS_VER = "4.9.155";
  const CMAP_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VER}/cmaps/`;
  const SFD_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VER}/standard_fonts/`;

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);
  const startTimeRef = useRef(Date.now());
  const pageTurnAudioRef = useRef<HTMLAudioElement>(null);

  // Cleanup PDF.js doc when switching away from it
  useEffect(() => {
    if (engine !== "pdfjs") {
      try {
        pdfDocRef.current?.destroy?.();
      } catch {}
      pdfDocRef.current = null;
      setLoadError(null);
      setIsLoading(!iframeLoaded);
    } else {
      setIsLoading(true);
    }
  }, [engine, iframeLoaded]);

  useEffect(() => {
    if (engine !== "pdfjs") return;
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setLoadProgress(5);
      setLoadError(null);

      try {
        (GlobalWorkerOptions as any).workerSrc = workerUrl as unknown as string;
      } catch {}
      if (!(GlobalWorkerOptions as any).workerSrc) {
        (GlobalWorkerOptions as any).workerSrc =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/build/pdf.worker.min.js";
      }

      const openWithTask = async (task: any) => {
        try {
          if (typeof task.onProgress === "function") {
            task.onProgress = (p: any) => {
              if (p && p.loaded) {
                const pct = p.total
                  ? (p.loaded / p.total) * 80 + 10
                  : Math.min(90, loadProgress + 5);
                setLoadProgress(Math.max(10, Math.min(95, Math.round(pct))));
              }
            };
          }
        } catch {}
        const doc = await task.promise;
        return doc;
      };

      try {
        const directTask = getDocument({
          url: pdfUrl,
          withCredentials: false,
          cMapUrl: CMAP_URL,
          cMapPacked: true,
          standardFontDataUrl: SFD_URL,
          disableFontFace: false,
          enableXfa: true,
          verbosity: 3,
        });
        const doc = await openWithTask(directTask);
        if (cancelled) return;
        pdfDocRef.current = doc;
        setTotalPages(doc.numPages);
        setLoadProgress(90);
        await renderPage(1, doc, scale, rotation);
        setLoadProgress(100);
        setIsLoading(false);
        return;
      } catch (directErr: any) {
        try {
          setLoadProgress(15);
          const res = await fetch(
            `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`,
          );
          if (!res.ok) throw new Error(`Proxy fetch failed: ${res.status}`);
          const buf = await res.arrayBuffer();
          setLoadProgress(40);
          const proxyTask = getDocument({
            data: buf,
            cMapUrl: CMAP_URL,
            cMapPacked: true,
            standardFontDataUrl: SFD_URL,
            disableFontFace: false,
            enableXfa: true,
            verbosity: 3,
          });
          const doc = await openWithTask(proxyTask);
          if (cancelled) return;
          pdfDocRef.current = doc;
          setTotalPages(doc.numPages);
          setLoadProgress(90);
          await renderPage(1, doc, scale, rotation);
          setLoadProgress(100);
          setIsLoading(false);
          return;
        } catch (proxyErr: any) {
          setIsLoading(false);
          setLoadError(
            proxyErr?.message || directErr?.message || "فشل تحميل ملف PDF",
          );
        }
      }
    }

    load();
    return () => {
      cancelled = true;
      try {
        pdfDocRef.current?.destroy?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl, engine]);

  useEffect(() => {
    if (engine !== "pdfjs") return;
    if (pdfDocRef.current) {
      renderPage(currentPage || 1, pdfDocRef.current, scale, rotation);
    }
  }, [currentPage, scale, rotation, readingMode, engine]);

  useEffect(() => {
    const onResize = () => {
      if (engine !== "pdfjs") return;
      if (pdfDocRef.current) {
        renderPage(currentPage || 1, pdfDocRef.current, scale, rotation);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [currentPage, scale, rotation, readingMode, engine]);

  function getFitScale(
    viewW: number,
    viewH: number,
    contW: number,
    contH: number,
  ) {
    const sx = contW / viewW;
    const sy = contH / viewH;
    return Math.min(sx, sy);
  }

  async function renderPage(
    pageNum: number,
    doc: any,
    scaleVal: number,
    rotationVal: number,
  ) {
    const container = stageRef.current;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const contW = container ? container.clientWidth : window.innerWidth;
    const contH = container ? container.clientHeight : window.innerHeight - 112;

    if (readingMode === "book") {
      const rightNum = Math.min(pageNum, doc.numPages);
      const leftNum = rightNum + 1 <= doc.numPages ? rightNum + 1 : null;

      const leftCanvas = canvasRef.current;
      const rightCanvas = rightCanvasRef.current;
      const rightPage = await doc.getPage(rightNum);
      const rightViewportUnit = rightPage.getViewport({
        scale: 1,
        rotation: rotationVal,
      });
      const leftPage = leftNum ? await doc.getPage(leftNum) : null;
      const leftViewportUnit = leftPage
        ? leftPage.getViewport({ scale: 1, rotation: rotationVal })
        : null;
      const totalWUnit =
        rightViewportUnit.width + (leftViewportUnit?.width || 0) + 16;
      const maxHUnit = Math.max(
        rightViewportUnit.height,
        leftViewportUnit?.height || 0,
      );
      const fit = getFitScale(totalWUnit, maxHUnit, contW, contH);
      const eff = fit * scaleVal;

      if (rightCanvas) {
        const rightViewport = rightPage.getViewport({
          scale: eff,
          rotation: rotationVal,
        });
        const rctx = rightCanvas.getContext("2d");
        if (rctx) {
          rightCanvas.style.width = `${Math.floor(rightViewport.width)}px`;
          rightCanvas.style.height = `${Math.floor(rightViewport.height)}px`;
          rightCanvas.width = Math.floor(rightViewport.width * dpr);
          rightCanvas.height = Math.floor(rightViewport.height * dpr);
          rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          await rightPage.render({
            canvasContext: rctx,
            viewport: rightViewport,
            intent: "display",
            renderInteractiveForms: false,
            enableWebGL: true,
          }).promise;
        }
      }
      if (leftCanvas && leftPage && leftViewportUnit) {
        const leftViewport = leftPage.getViewport({
          scale: eff,
          rotation: rotationVal,
        });
        const lctx = leftCanvas.getContext("2d");
        if (lctx) {
          leftCanvas.style.width = `${Math.floor(leftViewport.width)}px`;
          leftCanvas.style.height = `${Math.floor(leftViewport.height)}px`;
          leftCanvas.width = Math.floor(leftViewport.width * dpr);
          leftCanvas.height = Math.floor(leftViewport.height * dpr);
          lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          await leftPage.render({
            canvasContext: lctx,
            viewport: leftViewport,
            intent: "display",
            renderInteractiveForms: false,
            enableWebGL: true,
          }).promise;
        }
      } else if (leftCanvas) {
        const lctx = leftCanvas.getContext("2d");
        if (lctx) lctx.clearRect(0, 0, leftCanvas.width, leftCanvas.height);
      }
    } else {
      const page = await doc.getPage(pageNum);
      const unit = page.getViewport({ scale: 1, rotation: rotationVal });
      const fit = getFitScale(unit.width, unit.height, contW, contH);
      const viewport = page.getViewport({
        scale: fit * scaleVal,
        rotation: rotationVal,
      });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (readingMode === "slide") {
        canvas.style.opacity = "0";
      }
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      await page.render({
        canvasContext: ctx,
        viewport,
        intent: "display",
        renderInteractiveForms: false,
        enableWebGL: true,
      }).promise;
      if (readingMode === "slide") {
        requestAnimationFrame(() => {
          canvas.style.transition = "opacity 250ms";
          canvas.style.opacity = "1";
        });
      }
    }
  }

  useEffect(() => {
    const timeInterval = setInterval(
      () => setReadingTime((prev) => prev + 1),
      1000,
    );
    const hideControlsTimeout = setTimeout(() => setShowControls(false), 5000);
    return () => {
      clearInterval(timeInterval);
      clearTimeout(hideControlsTimeout);
    };
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setShowControls(true);
      setTimeout(() => {
        if (Date.now() - lastActivity > 3000) setShowControls(false);
      }, 3000);
    };
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((ev) => document.addEventListener(ev, handleActivity));
    return () => {
      events.forEach((ev) => document.removeEventListener(ev, handleActivity));
    };
  }, [lastActivity]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleNextPage = () => {
    const step = readingMode === "book" ? 2 : 1;
    const next = Math.min(currentPage + step, totalPages || 999);
    setCurrentPage(next);
    updateReadProgress();
    if (soundOn) pageTurnAudioRef.current?.play().catch(() => {});
  };

  const handlePrevPage = () => {
    const step = readingMode === "book" ? 2 : 1;
    const prev = Math.max(currentPage - step, 1);
    setCurrentPage(prev);
    updateReadProgress();
    if (soundOn) pageTurnAudioRef.current?.play().catch(() => {});
  };

  const updateReadProgress = () => {
    if (totalPages > 0) {
      const progress = (currentPage / totalPages) * 100;
      setReadProgress(progress);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  useEffect(() => {
    if (engine !== "pdfjs") return;
    if (readingMode === "book" && currentPage % 2 === 0) {
      setCurrentPage(Math.max(1, currentPage - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingMode, engine]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName?.match(/INPUT|TEXTAREA|SELECT/i))
        return;
      if (engine === "pdfjs") {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          handleNextPage();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          handlePrevPage();
        } else if (e.key === "+") {
          handleZoomIn();
        } else if (e.key === "-") {
          handleZoomOut();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNextPage, handlePrevPage, engine]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const nativeSrc = `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}#view=FitH&toolbar=0&navpanes=0&statusbar=0&messages=0&scrollbar=1`;

  // Prevent hanging: prefetch a tiny byte range to confirm availability and hide loader
  useEffect(() => {
    let cancelled = false;
    if (engine !== "native") return;
    setIsLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      if (!cancelled) setIsLoading(false);
    }, 5000);
    (async () => {
      try {
        const res = await fetch(
          `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`,
          {
            method: "GET",
            headers: { Range: "bytes=0-0", Accept: "application/pdf" },
            signal: controller.signal,
          },
        );
        if (!cancelled && (res.ok || res.status === 206)) {
          setIframeLoaded(true);
          setIsLoading(false);
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [engine, pdfUrl]);

  useEffect(() => {
    if (engine !== "native") return;
    setIsLoading(!iframeLoaded);
  }, [engine, iframeLoaded]);

  if (engine === "native" && !iframeLoaded && isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className={`w-96 bg-black/40 backdrop-blur-xl border ${A().border}`}>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <BookOpen className="w-16 h-16 mx-auto ${A().text} animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{titleAr}</h3>
            <Progress value={loadProgress || 30} className="mb-4" />
            <p className="text-gray-300 text-sm">
              جاري فتح العارض المدمج بالنظام...
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 ${A().dot} rounded-full animate-pulse" />
              <span>أفضل جودة للنص العربي</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (engine === "pdfjs" && isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className={`w-96 bg-black/40 backdrop-blur-xl border ${A().border}`}>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <BookOpen className="w-16 h-16 mx-auto ${A().text} animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{titleAr}</h3>
            <Progress value={loadProgress} className="mb-4" />
            <p className="text-gray-300 text-sm">
              جاري تحميل المحتوى... {Math.round(loadProgress)}%
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 ${A().dot} rounded-full animate-pulse" />
              <span>تأمين المحتوى...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
        <div>
          <h3 className="text-xl font-bold mb-2">
            تعذّر عرض الـ PDF داخل الموقع
          </h3>
          <p className="text-gray-300 mb-4">{loadError}</p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              إ��ادة ��لمحاولة
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(pdfUrl, "_blank")}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              فتح مباشر (قد يُحظر)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className={`min-h-screen relative ${isFullscreen ? "fixed inset-0 z-50" : ""} ${theme === "dark" ? "bg-black text-white" : theme === "light" ? "bg-white text-black" : "bg-amber-50 text-black"}`}
      style={{ fontFamily: "Noto Sans Arabic, system-ui, sans-serif" }}
    >
      <div
        className={`absolute top-0 left-0 right-0 ${theme === "light" ? "bg-white/90" : "bg-black/80"} backdrop-blur-sm border-b ${A().border} z-40 transition-transform duration-300 ${showControls ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center justify-between p-4 flex-row-reverse">
          <div className="flex items-center gap-4 flex-row-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className={`${theme === "light" ? "text-gray-800" : "text-white"} ${A().hover}`}
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>
            <div>
              <h1 className="text-lg font-bold">{titleAr}</h1>
              <p className="text-sm opacity-70">
                {series} {volumeNumber && `- المجلد ${volumeNumber}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`${A().bgBadge} ${A().text} ${A().border}`}
            >
              وقت القراءة: {formatTime(readingTime)}
            </Badge>
            {engine === "pdfjs" && (
              <Badge
                variant="secondary"
                className="bg-purple-500/20 text-purple-400 border-purple-500/30"
              >
                التقدم: {Math.round(readProgress)}%
              </Badge>
            )}
          </div>
        </div>

        <div className="px-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {engine === "pdfjs" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className={`${theme === "light" ? "text-gray-700" : "text-white"}`}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm opacity-70">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className={`${theme === "light" ? "text-gray-700" : "text-white"}`}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme("light")}
              className={`${theme === "light" ? "text-blue-400" : "text-white"}`}
            >
              <Sun className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme("dark")}
              className={`${theme === "dark" ? "text-blue-400" : "text-white"}`}
            >
              <Moon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme("sepia")}
              className={`${theme === "sepia" ? "text-blue-400" : "text-white"}`}
            >
              <Eye className="w-4 h-4 rotate-180" />
            </Button>
            <div className="w-px h-6 bg-gray-600 mx-1" />
            <div className="flex items-center gap-1 bg-gray-800/60 rounded-lg p-1">
              <Button
                variant={engine === "native" ? "default" : "ghost"}
                size="sm"
                onClick={() => setEngine("native")}
                className="px-3"
              >
                عارض النظام
              </Button>
              <Button
                variant={engine === "pdfjs" ? "default" : "ghost"}
                size="sm"
                onClick={() => setEngine("pdfjs")}
                className="px-3"
              >
                عارض متقدم
              </Button>
            </div>
            {engine === "pdfjs" && (
              <>
                <div className="w-px h-6 bg-gray-600 mx-1" />
                <div className="flex items-center gap-1 bg-gray-800/60 rounded-lg p-1">
                  <Button
                    variant={readingMode === "single" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setReadingMode("single")}
                    className="px-3"
                  >
                    تمرير
                  </Button>
                  <Button
                    variant={readingMode === "book" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setReadingMode("book")}
                    className="px-3"
                  >
                    ��تاب
                  </Button>
                  <Button
                    variant={readingMode === "slide" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setReadingMode("slide")}
                    className="px-3"
                  >
                    شرائح
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {engine === "pdfjs" && (
          <div className="px-4 pb-2">
            <Progress value={readProgress} className="h-1" />
          </div>
        )}
      </div>

      <div
        ref={stageRef}
        className="w-full h-screen pt-28 flex items-center justify-center select-none relative"
      >
        {engine === "native" ? (
          <iframe
            title={title}
            src={nativeSrc}
            className="w-full h-full border-0 bg-white"
            onLoad={() => {
              setIframeLoaded(true);
              setIsLoading(false);
            }}
            onError={() => {
              setEngine("pdfjs");
            }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-modals allow-popups"
            allow="fullscreen"
          />
        ) : (
          <>
            {readingMode === "book" ? (
              <div className="flex gap-2 items-center justify-center w-full h-full flex-row-reverse">
                <canvas
                  ref={rightCanvasRef}
                  className="max-w-[49%] max-h-full bg-white"
                />
                <canvas
                  ref={canvasRef}
                  className="max-w-[49%] max-h-full bg-white"
                />
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full bg-white"
              />
            )}
            <div className="absolute inset-0 flex" aria-hidden>
              <button
                onClick={handleNextPage}
                className="h-full w-1/2 cursor-pointer"
                style={{ background: "transparent" }}
              />
              <button
                onClick={handlePrevPage}
                className="h-full w-1/2 cursor-pointer"
                style={{ background: "transparent" }}
              />
            </div>
          </>
        )}
      </div>

      {engine === "pdfjs" ? (
        <div
          className={`absolute bottom-0 left-0 right-0 ${theme === "light" ? "bg-white/90 text-black" : "bg-black/80 text-white"} backdrop-blur-sm border-t ${A().border} z-40 transition-transform duration-300 ${showControls ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex items-center justify-between p-4 flex-row-reverse">
            <div className="flex items-center gap-2 flex-row-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPage}
                className={`${theme === "light" ? "text-gray-800" : "text-white"} ${A().hover}`}
              >
                التالي
                <ChevronLeft className="w-4 h-4 mr-2" />
              </Button>
              <Badge
                variant="outline"
                className={`${A().border} ${A().text}`}
              >
                الصفحة {currentPage}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className={`${theme === "light" ? "text-gray-800" : "text-white"} ${A().hover} disabled:opacity-50`}
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-row-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className={`${theme === "light" ? "text-gray-800" : "text-white"} ${A().hover} disabled:opacity-50`}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Badge
                variant="outline"
                className={`${A().border} ${A().text}`}
              >
                {Math.round(scale * 100)}%
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= 3.0}
                className={`${theme === "light" ? "text-gray-800" : "text-white"} ${A().hover} disabled:opacity-50`}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-gray-600 mx-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className={`${theme === "light" ? "text-gray-800" : "text-white"} ${A().hover}`}
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBookmark}
                className={`${isBookmarked ? "text-yellow-400" : "text-white"} hover:text-yellow-400`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className={`${theme === "light" ? "text-gray-800" : "text-white"} ${A().hover}`}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowControls(!showControls)}
                className={`${theme === "light" ? "text-gray-800" : "text-white"} ${A().hover}`}
              >
                {showControls ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`absolute bottom-0 left-0 right-0 ${theme === "light" ? "bg-white/90 text-black" : "bg-black/80 text-white"} backdrop-blur-sm border-t ${A().border} z-40 transition-transform duration-300 ${showControls ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex items-center justify-end p-4 gap-2 flex-row-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className={`${theme === "light" ? "text-gray-800" : "text-white"} ${A().hover}`}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowControls(!showControls)}
              className={`${theme === "light" ? "text-gray-800" : "text-white"} ${A().hover}`}
            >
              {showControls ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(pdfUrl, "_blank")}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              فتح في تبويب جديد
            </Button>
          </div>
        </div>
      )}

      <audio
        ref={pageTurnAudioRef}
        src="data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA"
        preload="auto"
      />
    </div>
  );
};

export default ProtectedPDFViewer;
