import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  BookOpen, 
  Scroll, 
  Layers, 
  Volume2, 
  VolumeX,
  Sun,
  Moon,
  Eye,
  ZoomIn,
  ZoomOut,
  Settings
} from "lucide-react";

type ReadingMode = "scroll" | "flipbook" | "slide";
type Theme = "light" | "dark" | "sepia";

export default function BookReader() {
  const { series, volumeId } = useParams();
  const navigate = useNavigate();
  const [readingMode, setReadingMode] = useState<ReadingMode>("scroll");
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState<Theme>("dark");
  const [fontSize, setFontSize] = useState(16);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const readerRef = useRef<HTMLDivElement>(null);

  // Mock book data
  const bookData = {
    title: series === "sao" ? `Sword Art Online Volume ${volumeId}` : `SAO Progressive Volume ${volumeId}`,
    titleArabic: series === "sao" ? `سيف آرت أونلاين المجلد ${volumeId}` : `ساو بروجرسيف المجلد ${volumeId}`,
    totalPages: 250,
    currentProgress: 0,
  };

  // Mock pages with Arabic text
  const mockPages = Array.from({ length: bookData.totalPages }, (_, i) => ({
    id: i + 1,
    content: `
      <div class="page-content" dir="rtl">
        <h2 class="text-2xl font-bold mb-4 text-center">${i === 0 ? bookData.titleArabic : `الصفحة ${i + 1}`}</h2>
        <p class="text-lg leading-relaxed mb-4">
          ${i === 0 ? 
            `مرحباً بكم في ${bookData.titleArabic}. هذا العمل مترجم ومراجع بواسطة فريق MrPheonixX باستخدام DeepL Premium مع المراجعة اليدوية.` :
            `محتوى الصفحة ${i + 1} من ${bookData.titleArabic}. النص العربي المترجم بعناية فائقة لضمان أفضل تجربة قراءة ممكنة للقارئ العربي.`
          }
        </p>
        <p class="text-base leading-relaxed mb-4">
          في هذا المجلد، نتابع مغامرات كيريتو وأسونا في عالم ساو الافتراضي المليء بالتحديات والمخاطر. 
          القصة مليئة بالإثارة والتشويق، وتأخذنا في رحلة عبر طوابق أينكراد المختلفة.
        </p>
        <div class="mt-8 text-center text-sm text-gray-500">
          ترجمة ومراجعة: فريق MrPheonixX | الصفحة ${i + 1} من ${bookData.totalPages}
        </div>
      </div>
    `,
    audioText: i === 0 ? 
      `مرحباً بكم في ${bookData.titleArabic}` :
      `الصفحة ${i + 1} من ${bookData.titleArabic}`
  }));

  useEffect(() => {
    // Load saved progress
    const savedPage = localStorage.getItem(`book-progress-${series}-${volumeId}`);
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }

    // Load preferences
    const savedTheme = localStorage.getItem("reader-theme") as Theme;
    if (savedTheme) setTheme(savedTheme);

    const savedMode = localStorage.getItem("reading-mode") as ReadingMode;
    if (savedMode) setReadingMode(savedMode);
  }, [series, volumeId]);

  useEffect(() => {
    // Save progress
    localStorage.setItem(`book-progress-${series}-${volumeId}`, currentPage.toString());
  }, [currentPage, series, volumeId]);

  const nextPage = () => {
    if (currentPage < mockPages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("reader-theme", newTheme);
  };

  const changeReadingMode = (mode: ReadingMode) => {
    setReadingMode(mode);
    localStorage.setItem("reading-mode", mode);
  };

  const toggleTTS = () => {
    if (isTTSPlaying) {
      speechSynthesis.cancel();
      setIsTTSPlaying(false);
    } else {
      const currentPageData = mockPages[currentPage - 1];
      const utterance = new SpeechSynthesisUtterance(currentPageData.audioText);
      utterance.lang = 'ar-SA';
      utterance.onend = () => setIsTTSPlaying(false);
      speechSynthesis.speak(utterance);
      setIsTTSPlaying(true);
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return "bg-white text-gray-900";
      case "sepia":
        return "bg-amber-50 text-amber-900";
      default:
        return "bg-gray-900 text-white";
    }
  };

  const renderScrollMode = () => (
    <div className="scroll-reader space-y-8">
      {mockPages.slice(0, currentPage).map((page) => (
        <div
          key={page.id}
          className={`page ${getThemeClasses()} p-8 rounded-lg shadow-lg max-w-4xl mx-auto`}
          style={{ fontSize: `${fontSize}px`, zoom: `${zoom}%` }}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ))}
      {currentPage < mockPages.length && (
        <div className="text-center py-8">
          <Button onClick={nextPage} className="bg-blue-600 hover:bg-blue-700">
            تحميل المزيد - Load More
          </Button>
        </div>
      )}
    </div>
  );

  const renderFlipbookMode = () => (
    <div className="page-flip-container flex justify-center">
      <div 
        className={`page-flip ${getThemeClasses()} p-8 rounded-lg shadow-xl max-w-4xl w-full h-[80vh] overflow-y-auto`}
        style={{ fontSize: `${fontSize}px`, zoom: `${zoom}%` }}
      >
        <div dangerouslySetInnerHTML={{ __html: mockPages[currentPage - 1]?.content }} />
      </div>
    </div>
  );

  const renderSlideMode = () => (
    <div className="slide-reader flex justify-center">
      <div 
        className={`page ${getThemeClasses()} p-8 rounded-lg shadow-xl max-w-4xl w-full h-[80vh] overflow-y-auto`}
        style={{ fontSize: `${fontSize}px`, zoom: `${zoom}%` }}
      >
        <div dangerouslySetInnerHTML={{ __html: mockPages[currentPage - 1]?.content }} />
      </div>
    </div>
  );

  const renderReader = () => {
    switch (readingMode) {
      case "scroll":
        return renderScrollMode();
      case "flipbook":
        return renderFlipbookMode();
      case "slide":
        return renderSlideMode();
      default:
        return renderScrollMode();
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} transition-all duration-300`} ref={readerRef}>
      {/* Header Controls */}
      {showControls && (
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Left side - Navigation */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(series === "sao" ? "/sao" : "/progressive")}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  العودة
                </Button>
                <div>
                  <h1 className="text-lg font-bold text-white">{bookData.titleArabic}</h1>
                  <p className="text-sm text-gray-400">
                    الصفحة {currentPage} من {mockPages.length}
                  </p>
                </div>
              </div>

              {/* Center - Reading Mode Controls */}
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
                <Button
                  variant={readingMode === "scroll" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => changeReadingMode("scroll")}
                >
                  <Scroll className="w-4 h-4" />
                  تمرير
                </Button>
                <Button
                  variant={readingMode === "flipbook" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => changeReadingMode("flipbook")}
                >
                  <BookOpen className="w-4 h-4" />
                  كت��ب
                </Button>
                <Button
                  variant={readingMode === "slide" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => changeReadingMode("slide")}
                >
                  <Layers className="w-4 h-4" />
                  شرائح
                </Button>
              </div>

              {/* Right side - Theme and Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTTS}
                  className={isTTSPlaying ? "text-green-400" : "text-gray-400"}
                >
                  {isTTSPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                
                <div className="flex space-x-1">
                  <Button
                    variant={theme === "light" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => changeTheme("light")}
                  >
                    <Sun className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => changeTheme("dark")}
                  >
                    <Moon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={theme === "sepia" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => changeTheme("sepia")}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-400 px-2">{zoom}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Reader Content */}
      <main className="container mx-auto px-4 py-8">
        {renderReader()}
      </main>

      {/* Navigation Controls for non-scroll modes */}
      {readingMode !== "scroll" && showControls && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center space-x-4 bg-black/90 backdrop-blur-sm rounded-full px-6 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="text-white hover:text-blue-400"
            >
              <ChevronRight className="w-5 h-5" />
              السابق
            </Button>
            
            <div className="text-white text-sm font-medium">
              {currentPage} / {mockPages.length}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === mockPages.length}
              className="text-white hover:text-blue-400"
            >
              التالي
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-800 z-40">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300"
          style={{ width: `${(currentPage / mockPages.length) * 100}%` }}
        />
      </div>

      {/* Hide/Show Controls Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowControls(!showControls)}
        className="fixed top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}
