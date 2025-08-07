import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for SAO Progressive volumes
const progressiveVolumes = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: `SAO Progressive Volume ${i + 1}`,
  titleArabic: `ساو بروجرسيف المجلد ${i + 1}`,
  description: `Volume ${i + 1} of SAO Progressive series from Asuna's perspective with deeper storytelling.`,
  descriptionArabic: `المجلد ${i + 1} من سلسلة ساو بروجرسيف من منظور أسونا مع قصص أعمق.`,
  coverImage: `/placeholder.svg`,
  pages: Math.floor(Math.random() * 80) + 180,
  readProgress: Math.floor(Math.random() * 100),
  rating: Math.floor(Math.random() * 5) + 1,
  status: i < 7 ? 'available' : 'coming-soon',
  floorLevel: i + 1,
  asunaFocus: true,
  newContent: Math.random() > 0.5
}));

export default function SAOProgressiveLibrary() {
  const navigate = useNavigate();
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  const filteredVolumes = progressiveVolumes
    .filter(volume => {
      const matchesSearch = volume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           volume.titleArabic.includes(searchQuery);
      const matchesFilter = filterBy === "all" || 
                           (filterBy === "new" && volume.newContent) ||
                           (filterBy === "completed" && volume.readProgress === 100) ||
                           (filterBy === "reading" && volume.readProgress > 0 && volume.readProgress < 100);
      return matchesSearch && matchesFilter;
    });

  const handleVolumeSelect = (volumeId: number) => {
    setSelectedVolume(volumeId);
    navigate(`/reader/progressive/${volumeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-pink-900 text-white">
      {/* Header */}
      <header className="border-b border-violet-500/20 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-violet-400 hover:text-violet-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للرئيسية
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-violet-400 flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  SAO Progressive
                </h1>
                <p className="text-sm text-gray-400">9 مجلدات - Asuna's Perspective</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-pink-400 text-pink-400">
                <Heart className="w-3 h-3 mr-1" />
                قصة أسونا
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progressive Info Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/30 rounded-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-violet-300 mb-3">
            ساو بروجرسيف - منظور أسونا المفصل
          </h2>
          <p className="text-gray-300 leading-relaxed">
            تروي سلسلة ساو بروجرسيف نفس أحداث السلسلة الأصلية ولكن من منظور أسونا، مع إضافة تفاصيل أعمق وقصص جانبية لم تُروى من قبل. 
            كل مجلد يغطي طابق واحد من أينكراد بعمق أكبر، مما يكشف عن جوانب جديدة من الشخصيات والعالم.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">أسونا الشخصية الرئيسية</Badge>
            <Badge variant="secondary">تفاصيل أعمق</Badge>
            <Badge variant="secondary">قصص إضافية</Badge>
            <Badge variant="secondary">كل طابق بالتفصيل</Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="البحث في المجلدات... Search volumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-black/40 border border-violet-500/30 rounded-md text-white placeholder-gray-400 focus:border-violet-400 focus:outline-none"
            />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 bg-black/40 border border-violet-500/30 rounded-md text-white focus:border-violet-400 focus:outline-none"
            >
              <option value="all">كل المجلدات</option>
              <option value="new">محتوى جديد</option>
              <option value="reading">قيد القراءة</option>
              <option value="completed">مكتملة</option>
            </select>
          </div>
        </div>

        {/* Volume Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVolumes.map((volume) => (
            <Card 
              key={volume.id}
              className="bg-black/40 border-violet-500/30 backdrop-blur-sm hover:border-violet-400/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              onClick={() => volume.status === 'available' ? handleVolumeSelect(volume.id) : null}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-pink-600/10 group-hover:from-violet-600/20 group-hover:to-pink-600/20 transition-all"></div>
              
              <CardHeader className="p-4 relative z-10">
                <div className="aspect-[3/4] bg-gradient-to-b from-violet-600 to-pink-600 rounded-md mb-3 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <Star className="w-12 h-12 text-white/80 mb-2" />
                    <div className="text-white/90 font-bold text-lg">Floor {volume.floorLevel}</div>
                    <div className="text-white/70 text-sm">الطابق {volume.floorLevel}</div>
                  </div>
                  
                  {volume.newContent && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
                      جديد
                    </Badge>
                  )}
                  
                  {volume.status === 'coming-soon' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="secondary">قريباً</Badge>
                    </div>
                  )}
                </div>
                
                <CardTitle className="text-lg text-violet-400 line-clamp-2">
                  {volume.titleArabic}
                </CardTitle>
                <CardDescription className="text-gray-300 text-sm line-clamp-3">
                  {volume.descriptionArabic}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 pt-0 relative z-10">
                <div className="space-y-3">
                  {/* Floor Info */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-violet-400 text-violet-400">
                      Floor {volume.floorLevel} - الطابق {volume.floorLevel}
                    </Badge>
                    <div className="flex text-pink-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`text-xs ${i < volume.rating ? 'opacity-100' : 'opacity-30'}`}>
                          ❤️
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {volume.readProgress > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>التقدم</span>
                        <span>{volume.readProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-violet-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${volume.readProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{volume.pages} صفحة</span>
                    <span>منظور أسونا</span>
                  </div>

                  {/* Special Features */}
                  <div className="flex flex-wrap gap-1">
                    {volume.asunaFocus && (
                      <Badge variant="outline" size="sm" className="border-pink-400 text-pink-400 text-xs">
                        أسونا
                      </Badge>
                    )}
                    {volume.newContent && (
                      <Badge variant="outline" size="sm" className="border-yellow-400 text-yellow-400 text-xs">
                        قصص جديدة
                      </Badge>
                    )}
                  </div>

                  {/* Action Button */}
                  {volume.status === 'available' ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 group-hover:scale-105 transition-all"
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {volume.readProgress > 0 ? 'متابعة القراءة' : 'ابدأ القراءة'}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full border-violet-400 text-violet-400" disabled size="sm">
                      قريباً
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reading Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-violet-400/50">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-violet-300">
                {progressiveVolumes.filter(v => v.readProgress === 100).length}
              </h3>
              <p className="text-gray-300">مجلدات مكتملة</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-pink-400/50">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-pink-300">
                {progressiveVolumes.filter(v => v.readProgress > 0 && v.readProgress < 100).length}
              </h3>
              <p className="text-gray-300">قيد القراءة</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 border-purple-400/50">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-purple-300">
                {Math.round(progressiveVolumes.reduce((acc, v) => acc + v.readProgress, 0) / progressiveVolumes.length)}%
              </h3>
              <p className="text-gray-300">إجمالي التقدم</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
