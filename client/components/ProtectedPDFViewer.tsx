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
  Bookmark,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

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

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());

  // منع التحميل والنسخ - تأمين إضافي
  const securedPdfUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`;

  useEffect(() => {
    // محاكاة تحميل PDF
    const loadingInterval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setIsLoading(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // حساب وقت القراءة
    const timeInterval = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);

    // إخفاء الأزرار تلقائياً
    const hideControlsTimeout = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => {
      clearInterval(loadingInterval);
      clearInterval(timeInterval);
      clearTimeout(hideControlsTimeout);
    };
  }, []);

  useEffect(() => {
    // مراقبة النشاط للتحكم في إظهار الأزرار
    const handleActivity = () => {
      setLastActivity(Date.now());
      setShowControls(true);
      
      setTimeout(() => {
        if (Date.now() - lastActivity > 3000) {
          setShowControls(false);
        }
      }, 3000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [lastActivity]);

  // حماية إضافية ضد التحميل
  useEffect(() => {
    const preventDownload = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // إضافة حماية للإطار
            iframeDoc.addEventListener('contextmenu', preventDownload);
            iframeDoc.addEventListener('selectstart', preventDownload);
            iframeDoc.addEventListener('dragstart', preventDownload);
            
            // إخفاء أشرطة PDF الافتراضية
            const style = iframeDoc.createElement('style');
            style.textContent = `
              * { 
                -webkit-user-select: none !important; 
                -moz-user-select: none !important; 
                user-select: none !important;
                -webkit-user-drag: none !important;
                user-drag: none !important;
              }
              embed, object { pointer-events: none !important; }
              .toolbar { display: none !important; }
              .download { display: none !important; }
              .print { display: none !important; }
            `;
            iframeDoc.head?.appendChild(style);
          }
        } catch (error) {
          console.log('Cross-origin iframe security applied');
        }
      });
    }
  }, []);

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
              جاري تحميل المحتوى المحمي... {Math.round(loadProgress)}%
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
        fontFamily: 'Noto Sans Arabic, system-ui, sans-serif',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none'
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
      <div className="w-full h-screen pt-20">
        <iframe
          ref={iframeRef}
          src={securedPdfUrl}
          className="w-full h-full border-0"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            userSelect: 'none',
            pointerEvents: 'auto'
          }}
          sandbox="allow-same-origin allow-scripts"
          // منع التحميل والطباعة
          onLoad={() => {
            const iframe = iframeRef.current;
            if (iframe && iframe.contentWindow) {
              // منع اختصارات لوحة المفاتيح
              iframe.contentWindow.addEventListener('keydown', (e) => {
                if (
                  e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'S' || e.key === 'P') ||
                  e.key === 'PrintScreen'
                ) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              });
            }
          }}
        />
      </div>

      {/* أزرار التحكم السفلية */}
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

      {/* علامة مائية أمنية */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 text-8xl font-bold text-white/5 select-none">
          MrPheonixX
        </div>
        <div className="absolute top-1/4 right-1/4 transform rotate-12 text-6xl font-bold text-cyan-400/5 select-none">
          محمي
        </div>
        <div className="absolute bottom-1/4 left-1/4 transform -rotate-12 text-6xl font-bold text-purple-400/5 select-none">
          © 2024
        </div>
      </div>

      {/* رسالة تحذيرية للحماية */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-red-900/20 border-red-500/30 backdrop-blur-sm">
          <CardContent className="p-3">
            <p className="text-xs text-red-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              محتوى محمي - التحميل ممنوع
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProtectedPDFViewer;
