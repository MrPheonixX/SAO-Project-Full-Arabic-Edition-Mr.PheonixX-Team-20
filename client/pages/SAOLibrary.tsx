import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, Pause, Volume2, VolumeX, Star, Download, Heart, Eye, Calendar, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InteractiveButton, InteractiveCard } from "@/components/InteractiveElements";

// بيانات مجلدات SAO الحقيقية مع نصوص عربية صحيحة
const saoVolumes = [
  {
    id: 1,
    title: "Sword Art Online Volume 1: Aincrad",
    titleArabic: "سيف آرت أونلاين المجلد 1: آينكراد",
    subtitle: "آينكراد",
    description: "البداية الحقيقية لمغامرة كيريتو في عالم ساو الافتراضي الخطير. عندما يصبح اللعب مسألة حياة أو موت.",
    descriptionArabic: "البداية الحقيقية لمغامرة كيريتو في عالم ساو الافتراضي الخطير. عندما يصبح اللعب مسألة حياة أو موت.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080",
    pages: 258,
    chapters: 8,
    readProgress: 100,
    rating: 9.6,
    status: 'available',
    releaseDate: "2009-04-10",
    translator: "MrPheonixX Team",
    genre: ["إيسيكاي", "أكشن", "رومانسي"],
    summary: "كيريتو محاصر في لعبة الواقع الافتراضي SAO مع 10,000 لاعب آخر. الموت في اللعبة يعني الموت في الواقع. الطريقة الوحيدة للخروج هي إكمال جميع الطوابق المئة.",
    keyCharacters: ["كيريتو", "أسونا", "كلاين", "إيغيل"]
  },
  {
    id: 2,
    title: "Sword Art Online Volume 2: Aincrad",
    titleArabic: "سيف آرت أونلاين المجلد 2: آينكراد",
    subtitle: "آينكراد",
    description: "مواصلة مغامرة كيريتو في آينكراد مع قصص جانبية مؤثرة ولقاءات جديدة تشكل مستقبله.",
    descriptionArabic: "مواصلة مغامرة كيريتو في آينكراد مع قصص جانبية مؤثرة ولقاءات جديدة تشكل مستقبله.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080",
    pages: 242,
    chapters: 7,
    readProgress: 100,
    rating: 9.4,
    status: 'available',
    releaseDate: "2009-08-10",
    translator: "MrPheonixX Team",
    genre: ["إيسيكاي", "أكشن", "رومانسي"],
    summary: "قصص جانبية من آينكراد تكشف المزيد عن العلاقات والصداقات التي تكونت في هذا العالم الخطير.",
    keyCharacters: ["كيريتو", "أسونا", "ليزبيث", "سيلكا"]
  }
];

export default function SAOLibrary() {
  const navigate = useNavigate();
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("order");
  const [filterBy, setFilterBy] = useState("all");

  const handleVolumeSelect = (volumeId: number) => {
    setSelectedVolume(volumeId);
    // Navigate to reader with volume data
    navigate(`/reader/sao/${volumeId}`);
  };

  const filteredVolumes = saoVolumes.filter(volume => {
    const matchesSearch = volume.titleArabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volume.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === "completed") return volume.readProgress === 100;
    if (filterBy === "reading") return volume.readProgress > 0 && volume.readProgress < 100;
    if (filterBy === "unread") return volume.readProgress === 0;
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 text-white">
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <InteractiveButton
                variant="crystal"
                onClick={() => navigate("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                العودة
              </InteractiveButton>
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                مكتبة ساو الأصلية
              </h1>
              <p className="text-blue-300 mt-2">سلسلة Sword Art Online الكاملة</p>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/50">
                {saoVolumes.length} مجلد
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="ابحث في المجلدات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-black/40 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 bg-black/40 border border-blue-500/30 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="all">جميع المجلدات</option>
              <option value="completed">مكتمل</option>
              <option value="reading">قيد القراءة</option>
              <option value="unread">غير مقروء</option>
            </select>
          </div>
        </div>

        {/* Volumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVolumes.map((volume) => (
            <InteractiveCard
              key={volume.id}
              className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-blue-500/30 backdrop-blur-xl hover:border-blue-400/50 transition-all duration-500 cursor-pointer"
              onClick={() => handleVolumeSelect(volume.id)}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundImage: `url(${volume.backgroundImage})` }}
              />
              
              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Volume Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/50 mb-2">
                      المجلد {volume.id}
                    </Badge>
                    <h3 className="text-xl font-bold text-blue-400 mb-1">
                      {volume.titleArabic}
                    </h3>
                    <p className="text-gray-300 text-sm">{volume.subtitle}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400 text-sm">{volume.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {volume.descriptionArabic}
                </p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {volume.genre.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center text-sm mb-4">
                  <div>
                    <div className="text-blue-400 font-semibold">{volume.pages}</div>
                    <div className="text-gray-400">صفحة</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-semibold">{volume.chapters}</div>
                    <div className="text-gray-400">فصل</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-semibold">{volume.readProgress}%</div>
                    <div className="text-gray-400">مقروء</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${volume.readProgress}%` }}
                  />
                </div>

                {/* Action Button */}
                <InteractiveButton
                  variant="magic"
                  className="w-full group-hover:scale-105 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVolumeSelect(volume.id);
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {volume.readProgress > 0 ? 'متابعة القراءة' : 'ابدأ القراءة'}
                </InteractiveButton>
              </div>
            </InteractiveCard>
          ))}
        </div>

        {/* Empty State */}
        {filteredVolumes.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">لا توجد مجلدات</h3>
            <p className="text-gray-500">حاول تغيير معايير البحث أو التصفية</p>
          </div>
        )}
      </main>
    </div>
  );
}
