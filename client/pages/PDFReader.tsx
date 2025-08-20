import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, BookOpen, Download, Share2, ArrowLeft } from 'lucide-react';
import ProtectedPDFViewer from '@/components/ProtectedPDFViewer';
import { getWorkById, PDFWork } from '@/data/pdfWorks';

const PDFReader: React.FC = () => {
  const { workId } = useParams<{ workId: string }>();
  const navigate = useNavigate();
  const [work, setWork] = useState<PDFWork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    if (workId) {
      const foundWork = getWorkById(workId);
      if (foundWork) {
        setWork(foundWork);
        setIsLoading(false);
      } else {
        setError('العمل المطلوب غير موجود');
        setIsLoading(false);
      }
    } else {
      setError('معرف العمل مطلوب');
      setIsLoading(false);
    }
  }, [workId]);

  const handleStartReading = () => {
    setShowViewer(true);
  };

  const handleBackToInfo = () => {
    setShowViewer(false);
  };

  const handleBackToLibrary = () => {
    navigate('/all-works');
  };

  // منع محاولات التحميل
  const handleDownloadAttempt = () => {
    alert('🚫 التحميل غير مسموح - المحتوى محمي بحقوق الطبع والنشر');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="w-96 bg-black/40 backdrop-blur-xl border border-cyan-500/30">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-cyan-400 animate-spin mb-4" />
            <p className="text-white">جاري تحميل معلومات العمل...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="w-96 bg-black/40 backdrop-blur-xl border border-red-500/30">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">خطأ في التحميل</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <Button onClick={handleBackToLibrary} className="bg-cyan-600 hover:bg-cyan-700">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للمكتبة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showViewer) {
    return (
      <ProtectedPDFViewer
        pdfUrl={work.pdfUrlRaw}
        title={work.titleEn}
        titleAr={work.titleAr}
        series={work.series}
        volumeNumber={work.volumeNumber}
        onBack={handleBackToInfo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToLibrary}
            className="text-white hover:text-cyan-400 mb-4"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للمكتبة
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* معلومات العمل */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 backdrop-blur-xl border border-cyan-500/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {work.titleAr}
                    </CardTitle>
                    <p className="text-gray-400 text-lg mb-4">{work.titleEn}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        {work.series}
                      </Badge>
                      {work.volumeNumber && (
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          المجلد {work.volumeNumber}
                        </Badge>
                      )}
                      {work.arc && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          {work.arc}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        ⭐ {work.rating}/10
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {work.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">وصف العمل</h3>
                    <p className="text-gray-300 leading-relaxed">{work.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">سنة النشر</p>
                    <p className="text-white font-semibold">{work.publishYear || 'غير محدد'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">عدد الصفحات</p>
                    <p className="text-white font-semibold">{work.pages || 'غير محدد'} صفحة</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">الحالة</p>
                    <p className="text-white font-semibold">
                      {work.status === 'available' ? 'متاح للقراءة' : 
                       work.status === 'reading' ? 'قيد القراءة' : 'قريباً'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">التقدم</p>
                    <p className="text-white font-semibold">{work.readProgress || 0}%</p>
                  </div>
                </div>

                {work.tags && work.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">التصنيفات</h3>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="border-gray-500/30 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* أزرار التحكم */}
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={handleStartReading}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                  >
                    <BookOpen className="w-4 h-4 ml-2" />
                    بدء القراءة
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadAttempt}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تحميل (محظور)
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                  >
                    <Share2 className="w-4 h-4 ml-2" />
                    مشاركة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* معلومات إضافية */}
          <div className="space-y-6">
            {/* إحصائيات القراءة */}
            <Card className="bg-black/40 backdrop-blur-xl border border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-white">إحصائيات القراءة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">الصفحة الحالية</span>
                    <span className="text-white font-semibold">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">وقت القراءة المقدر</span>
                    <span className="text-white font-semibold">
                      {work.pages ? Math.round(work.pages / 2) : 0} دقيقة
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">آخر قراءة</span>
                    <span className="text-white font-semibold">
                      {work.lastRead || 'لم تبدأ بعد'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* تحذير أمني */}
            <Card className="bg-red-900/20 border border-red-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  تنبيه أمني
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-red-300">
                  <p>🚫 التحميل محظور</p>
                  <p>🚫 النسخ ممنوع</p>
                  <p>🚫 لقطات الشاشة محجوبة</p>
                  <p>📜 المحتوى محمي بحقوق الطبع والنشر</p>
                </div>
              </CardContent>
            </Card>

            {/* معلومات المترجم */}
            <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-purple-400">معلومات الترجمة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">المترجم:</p>
                  <p className="text-white font-semibold">MrPheonixX Team</p>
                  <p className="text-gray-400">جودة الترجمة:</p>
                  <p className="text-white font-semibold">عالية الجودة ⭐⭐⭐⭐⭐</p>
                  <p className="text-gray-400">حالة الترجمة:</p>
                  <p className="text-green-400 font-semibold">مكتملة ✅</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;
