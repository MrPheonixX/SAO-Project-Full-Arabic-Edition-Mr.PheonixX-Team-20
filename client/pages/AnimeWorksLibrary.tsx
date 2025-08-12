import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Star,
  Play,
  Download,
  Users,
  Heart,
  Sparkles,
  Clock,
  Award,
  TrendingUp,
  Filter,
  Search,
  Zap,
  Crown,
  Globe,
  FileText,
} from "lucide-react";
import { InteractiveButton, InteractiveCard } from "@/components/InteractiveElements";

const animeWorks = [
  {
    id: 1,
    title: "Death Note",
    arabicTitle: "مذكرة الموت",
    author: "Tsugumi Ohba",
    translator: "MrPheonixX Team",
    volumes: 12,
    status: "مكتمل",
    rating: 9.8,
    genre: ["إثارة", "نفسي", "خارق للطبيعة"],
    description: "قصة طالب عبقري يحصل على دفتر غامض له القدرة على قتل أي شخص يُكتب اسمه فيه. معركة عقول بين الخير والشر.",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    readTime: "8 ساعات",
    chapters: 108,
    language: "عربي",
    type: "مانجا"
  },
  {
    id: 2,
    title: "Attack on Titan",
    arabicTitle: "هجوم العمالقة",
    author: "Hajime Isayama",
    translator: "MrPheonixX Team",
    volumes: 34,
    status: "مكتمل",
    rating: 9.5,
    genre: ["أكشن", "دراما", "خيال"],
    description: "البشرية محاصرة خلف جدران عملاقة من العمالقة المرعبين. إيرين ييغر يقود المعركة من أجل الحرية والانتقام.",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    readTime: "25 ساعة",
    chapters: 139,
    language: "عربي",
    type: "مانجا"
  },
  {
    id: 3,
    title: "Your Name",
    arabicTitle: "اسمك",
    author: "Makoto Shinkai",
    translator: "MrPheonixX Team",
    volumes: 3,
    status: "مكتمل",
    rating: 9.2,
    genre: ["رومانسي", "خيال", "دراما"],
    description: "قصة حب عابرة للزمن بين شابين يتبادلان الأجساد في الأحلام. رحلة عاطفية مؤثرة عن القدر والحب.",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    readTime: "4 ساعات",
    chapters: 9,
    language: "عربي",
    type: "رواية مصورة"
  },
  {
    id: 4,
    title: "One Piece",
    arabicTitle: "قطعة واحدة",
    author: "Eiichiro Oda",
    translator: "MrPheonixX Team",
    volumes: 107,
    status: "مستمر",
    rating: 9.7,
    genre: ["مغامرة", "أكشن", "كوميدي"],
    description: "مونكي دي لوفي وطاقمه يبحثون عن الكنز الأسطوري 'وان بيس' في عالم مليء بالقراصنة والمغامرات اللانهائية.",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    readTime: "200+ ساعة",
    chapters: 1100,
    language: "عربي",
    type: "مانجا"
  },
  {
    id: 5,
    title: "Demon Slayer",
    arabicTitle: "قاتل الشياطين",
    author: "Koyoharu Gotouge",
    translator: "MrPheonixX Team",
    volumes: 23,
    status: "مكتمل",
    rating: 9.4,
    genre: ["أكشن", "خارق للطبيعة", "تاريخي"],
    description: "تانجيرو كامادو يسعى لإنقاذ أخته المتحولة إلى شيطان وثأر لعائلته. قصة مليئة بالعواطف والمعارك الملحمية.",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    readTime: "18 ساعة",
    chapters: 205,
    language: "عربي",
    type: "مانجا"
  },
  {
    id: 6,
    title: "Spirited Away",
    arabicTitle: "المخطوفة",
    author: "Hayao Miyazaki",
    translator: "MrPheonixX Team",
    volumes: 5,
    status: "مكتمل",
    rating: 9.6,
    genre: ["خيال", "مغامرة", "عائلي"],
    description: "تشيهيرو تدخل عالماً سحرياً مليئاً بالأرواح والوحوش. رحلة نضج وشجاعة في عالم استوديو جيبلي الساحر.",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    readTime: "6 ساعات",
    chapters: 15,
    language: "عربي",
    type: "رواية مصورة"
  }
];

export default function AnimeWorksLibrary() {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filteredWorks, setFilteredWorks] = useState(animeWorks);

  // استخراج جميع الأنواع
  const allGenres = Array.from(new Set(animeWorks.flatMap(work => work.genre)));

  // تصفية الأعمال
  useEffect(() => {
    let filtered = animeWorks;

    // تصفية حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(work => 
        work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.arabicTitle.includes(searchTerm) ||
        work.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // تصفية حسب النوع
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(work => 
        selectedGenres.some(genre => work.genre.includes(genre))
      );
    }

    // ترتيب النتائج
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "title":
          return a.title.localeCompare(b.title);
        case "volumes":
          return b.volumes - a.volumes;
        case "readTime":
          return a.readTime.localeCompare(b.readTime);
        default:
          return 0;
      }
    });

    setFilteredWorks(filtered);
  }, [searchTerm, selectedGenres, sortBy]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-orange-900/20 to-yellow-900/20"></div>
        
        {/* جسيمات عائمة */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: ['#ff6b35', '#f7931e', '#ffd23f', '#06ffa5'][i % 4],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-orange-500/20 bg-black/40 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                  🌸 أعمال الأنمي والمانجا
                </h1>
                <p className="text-gray-400">مجموعة منتقاة من أفضل الأعمال اليابانية المترجمة</p>
              </div>
              
              <InteractiveButton
                variant="fire"
                onClick={() => navigate("/")}
              >
                العودة للرئيسية
              </InteractiveButton>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* شريط البحث والتصفية */}
          <div className="mb-8 space-y-6">
            {/* البحث */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث في الأعمال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* فلاتر الأنواع */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-orange-400 font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4" />
                الأنواع:
              </span>
              {allGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedGenres.includes(genre)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* خيارات الترتيب */}
            <div className="flex justify-center items-center gap-4">
              <span className="text-orange-400 font-semibold">ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-400"
              >
                <option value="rating">التقييم</option>
                <option value="title">الاسم</option>
                <option value="volumes">عدد المجلدات</option>
                <option value="readTime">وقت القراءة</option>
              </select>
            </div>
          </div>

          {/* إحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{filteredWorks.length}</div>
              <div className="text-gray-400 text-sm">عمل متاح</div>
            </div>
            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">
                {filteredWorks.reduce((sum, work) => sum + work.volumes, 0)}
              </div>
              <div className="text-gray-400 text-sm">مجلد</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {(filteredWorks.reduce((sum, work) => sum + work.rating, 0) / filteredWorks.length).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">متوسط التقييم</div>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {filteredWorks.filter(work => work.status === "مكتمل").length}
              </div>
              <div className="text-gray-400 text-sm">عمل مكتمل</div>
            </div>
          </div>

          {/* قائمة الأعمال */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorks.map((work) => (
              <InteractiveCard
                key={work.id}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-orange-500/30 backdrop-blur-xl hover:border-orange-400/50 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-orange-400 mb-2 group-hover:text-orange-300 transition-colors">
                        {work.arabicTitle}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-sm">
                        {work.title} • {work.author}
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-bold">{work.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {work.genre.slice(0, 3).map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="bg-orange-500/20 text-orange-300 border-orange-500/50"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                    {work.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      <span>{work.volumes} مجلد</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{work.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span>{work.chapters} فصل</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Globe className="w-4 h-4" />
                      <span>{work.language}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      className={`${
                        work.status === "مكتمل" 
                          ? "bg-green-500/20 text-green-300 border-green-500/50"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/50"
                      }`}
                    >
                      {work.status}
                    </Badge>
                    
                    <Badge variant="outline" className="border-orange-500/50 text-orange-300">
                      {work.type}
                    </Badge>
                  </div>

                  <div className="mt-6 space-y-3">
                    <InteractiveButton
                      variant="fire"
                      className="w-full group-hover:scale-105 transition-all duration-300"
                      onClick={() => navigate(`/reader/anime/${work.id}`)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      ابدأ القراءة
                    </InteractiveButton>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-orange-500/50 text-orange-300 hover:bg-orange-500/10"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        تحميل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-500/50 text-red-300 hover:bg-red-500/10"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        إعجاب
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </InteractiveCard>
            ))}
          </div>

          {/* رسالة عدم وجود نتائج */}
          {filteredWorks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">جرب البحث بكلمات مختلفة أو قم بتغيير المرشحات</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
