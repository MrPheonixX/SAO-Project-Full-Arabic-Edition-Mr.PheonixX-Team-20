import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  ArrowLeft
} from 'lucide-react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

interface ProtectedPDFViewerProps {
  pdfUrl: string;
  title: string;
  titleAr: string;
  series: string;
  volumeNumber?: number;
  onBack?: () => void;
}

const ProtectedPDFViewer: React.FC<ProtectedPDFViewerProps> = ({
  pdfUrl,
  title,
  titleAr,
  series,
  volumeNumber,
  onBack
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
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

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        setLoadProgress(10);
        GlobalWorkerOptions.workerSrc = workerUrl as unknown as string;
        const res = await fetch(`/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`);
        const buf = await res.arrayBuffer();
        setLoadProgress(40);
        const loadingTask = getDocument({ data: buf });
        const doc = await loadingTask.promise;
        if (cancelled) return;
        pdfDocRef.current = doc;
        setTotalPages(doc.numPages);
        setLoadProgress(80);
        await renderPage(currentPage || 1, doc, scale, rotation);
        setLoadProgress(100);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      try { pdfDocRef.current?.destroy?.(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(currentPage || 1, pdfDocRef.current, scale, rotation);
    }
  }, [currentPage, scale, rotation]);

  async function renderPage(pageNum: number, doc: any, scaleVal: number, rotationVal: number) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: scaleVal, rotation: rotationVal });
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
  }

  // حظر التحميل والطباعة والقائمة اليمنى في مساحة العارض
  useEffect(() => {
    const blocker = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const preventContext = (e: MouseEvent) => { e.preventDefault(); };
    window.addEventListener('keydown', blocker, { capture: true });
    const el = containerRef.current;
    el?.addEventListener('contextmenu', preventContext as any);
    return () => {
      window.removeEventListener('keydown', blocker, { capture: true } as any);
      el?.removeEventListener('contextmenu', preventContext as any);
    };
  }, []);

  useEffect(() => {
    // حساب وقت القراءة وإخفاء الأزرار
    const timeInterval = setInterval(() => setReadingTime(prev => prev + 1), 1000);
    const hideControlsTimeout = setTimeout(() => setShowControls(false), 5000);
    return () => { clearInterval(timeInterval); clearTimeout(hideControlsTimeout); };
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setShowControls(true);
      setTimeout(() => { if (Date.now() - lastActivity > 3000) setShowControls(false); }, 3000);
    };
    const events = ['mousedown','mousemove','keypress','scroll','touchstart'];
    events.forEach(ev => document.addEventListener(ev, handleActivity));
    return () => { events.forEach(ev => document.removeEventListener(ev, handleActivity)); };
  }, [lastActivity]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages || 999));
    updateReadProgress();
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    updateReadProgress();
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
    // يمكن إضافة منطق حفظ الإشارة المرجعية هنا
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="w-96 bg-black/40 backdrop-blur-xl border border-cyan-500/30">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <BookOpen className="w-16 h-16 mx-auto text-cyan-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              {titleAr}
            </h3>
            <Progress value={loadProgress} className="mb-4" />
            <p className="text-gray-300 text-sm">
              جاري تحميل ا��محتوى المحمي... {Math.round(loadProgress)}%
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span>تأمين المحتوى...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-black relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      style={{
        fontFamily: 'Noto Sans Arabic, system-ui, sans-serif'
      }}
    >
      {/* شريط العلوي */}
      <div className={`absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-cyan-500/30 z-40 transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-white hover:text-cyan-400"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>
            <div>
              <h1 className="text-lg font-bold text-white">{titleAr}</h1>
              <p className="text-sm text-gray-400">{series} {volumeNumber && `- المجلد ${volumeNumber}`}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              وقت القراءة: {formatTime(readingTime)}
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              التقدم: {Math.round(readProgress)}%
            </Badge>
          </div>
        </div>
        
        {/* شريط التقدم */}
        <div className="px-4 pb-2">
          <Progress value={readProgress} className="h-1" />
        </div>
      </div>

      {/* منطقة عرض PDF */}
      <div className="w-full h-screen pt-20 flex items-center justify-center select-none" ref={containerRef}>
        <canvas ref={canvasRef} className="max-w-full max-h-full" />
      </div>

      {/* أزرار التحكم الس��لية */}
      <div className={`absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-cyan-500/30 z-40 transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center justify-between p-4">
          {/* أزرار التنقل */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="text-white hover:text-cyan-400 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>
            
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
              الصفحة {currentPage}
            </Badge>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNextPage}
              className="text-white hover:text-cyan-400"
            >
              التالي
              <ChevronLeft className="w-4 h-4 mr-2" />
            </Button>
          </div>

          {/* أزرار التحكم في العرض */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="text-white hover:text-cyan-400 disabled:opacity-50"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
              {Math.round(scale * 100)}%
            </Badge>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomIn}
              disabled={scale >= 3.0}
              className="text-white hover:text-cyan-400 disabled:opacity-50"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-gray-600 mx-2" />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRotate}
              className="text-white hover:text-cyan-400"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleBookmark}
              className={`${isBookmarked ? 'text-yellow-400' : 'text-white'} hover:text-yellow-400`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFullscreen}
              className="text-white hover:text-cyan-400"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowControls(!showControls)}
              className="text-white hover:text-cyan-400"
            >
              {showControls ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProtectedPDFViewer;
