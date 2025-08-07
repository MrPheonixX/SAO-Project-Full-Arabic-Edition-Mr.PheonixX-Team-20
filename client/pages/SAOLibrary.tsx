import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for SAO volumes
const saoVolumes = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  title: `Sword Art Online Volume ${i + 1}`,
  titleArabic: `سيف آرت أونلاين المجلد ${i + 1}`,
  description: `The ${i + 1}th volume of the original SAO series featuring Kirito's adventures.`,
  descriptionArabic: `المجلد ${i + 1} من سلسلة ساو الأصلية يتضمن مغامرات كيريتو.`,
  coverImage: `/placeholder.svg`,
  pages: Math.floor(Math.random() * 100) + 150,
  readProgress: Math.floor(Math.random() * 100),
  rating: Math.floor(Math.random() * 5) + 1,
  status: i < 25 ? 'available' : 'coming-soon'
}));

export default function SAOLibrary() {
  const navigate = useNavigate();
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("number");
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);

  const filteredVolumes = saoVolumes
    .filter(volume => 
      volume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volume.titleArabic.includes(searchQuery)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating": return b.rating - a.rating;
        case "progress": return b.readProgress - a.readProgress;
        default: return a.id - b.id;
      }
    });

  const handleVolumeSelect = (volumeId: number) => {
    setSelectedVolume(volumeId);
    // Navigate to reader with volume ID
    navigate(`/reader/sao/${volumeId}`);
  };

  const toggleTTS = () => {
    setIsTTSEnabled(!isTTSEnabled);
    if (!isTTSEnabled) {
      // Start TTS
      const utterance = new SpeechSynthesisUtterance("تم تفعيل القراءة الصوتية");
      utterance.lang = 'ar-SA';
      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 text-white">
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-blue-400 hover:text-blue-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للرئيسية
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-blue-400">Sword Art Online</h1>
                <p className="text-sm text-gray-400">28 مجلد - Original Series</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTTS}
                className={`${isTTSEnabled ? 'bg-blue-600 text-white' : ''}`}
              >
                {isTTSEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                TTS
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="البحث في المجلدات... Search volumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-black/40 border border-blue-500/30 rounded-md text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-black/40 border border-blue-500/30 rounded-md text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="number">ترتيب حسب الرقم</option>
              <option value="rating">ترتيب حسب التقييم</option>
              <option value="progress">ترتيب حسب التقدم</option>
            </select>
          </div>
        </div>

        {/* Volume Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVolumes.map((volume) => (
            <Card 
              key={volume.id}
              className="bg-black/40 border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300 cursor-pointer group"
              onClick={() => volume.status === 'available' ? handleVolumeSelect(volume.id) : null}
            >
              <CardHeader className="p-4">
                <div className="aspect-[3/4] bg-gradient-to-b from-blue-600 to-violet-600 rounded-md mb-3 flex items-center justify-center relative overflow-hidden">
                  <BookOpen className="w-12 h-12 text-white/80" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  {volume.status === 'coming-soon' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="secondary">قريباً</Badge>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg text-blue-400 line-clamp-2">
                  {volume.titleArabic}
                </CardTitle>
                <CardDescription className="text-gray-300 text-sm line-clamp-2">
                  {volume.descriptionArabic}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  {/* Progress Bar */}
                  {volume.readProgress > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>التقدم</span>
                        <span>{volume.readProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-violet-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${volume.readProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {volume.pages} صفحة
                      </Badge>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`text-xs ${i < volume.rating ? 'opacity-100' : 'opacity-30'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {volume.status === 'available' ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 group-hover:scale-105 transition-all"
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {volume.readProgress > 0 ? 'متابعة القراءة' : 'ابدأ القراءة'}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled size="sm">
                      قريباً
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resume Reading Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-blue-300 mb-6">متابعة القراءة - Continue Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saoVolumes
              .filter(v => v.readProgress > 0 && v.readProgress < 100)
              .slice(0, 3)
              .map((volume) => (
                <Card 
                  key={`resume-${volume.id}`}
                  className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border-blue-400/50 backdrop-blur-sm cursor-pointer hover:from-blue-600/30 hover:to-violet-600/30 transition-all"
                  onClick={() => handleVolumeSelect(volume.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-20 bg-gradient-to-b from-blue-600 to-violet-600 rounded flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-300">{volume.titleArabic}</h3>
                        <p className="text-sm text-gray-400 mb-2">التقدم: {volume.readProgress}%</p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-violet-400 h-2 rounded-full"
                            style={{ width: `${volume.readProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
