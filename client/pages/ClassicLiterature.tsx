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
  Crown,
  Sparkles,
  Clock,
  Award,
  TrendingUp,
  Filter,
  Search,
  Zap,
  Globe,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { InteractiveButton, InteractiveCard } from "@/components/InteractiveElements";

const classicWorks = [
  {
    id: 1,
    title: "الأسود يليق بك",
    originalTitle: "Kokoro",
    author: "ناتسومه سوسيكي",
    translator: "MrPheonixX Team",
    year: 1914,
    country: "اليابان",
    pages: 245,
    status: "مكتمل",
    rating: 9.3,
    genre: ["أدب كلاسيكي", "نفسي", "فلسفي"],
    description: "رواية يابانية كلاسيكية تستكشف الطبيعة البشرية والصداقة والخيانة. قصة عميقة عن الذنب والندم في اليابان الحديثة المبكرة.",
    readTime: "6 ساعات",
    language: "عربي",
    difficulty: "متوسط",
    themes: ["الصداقة", "الخيانة", "الذنب", "الحداثة"]
  },
  {
    id: 2,
    title: "لم أعد إنساناً",
    originalTitle: "No Longer Human",
    author: "دازاي أوسامو",
    translator: "MrPheonixX Team",
    year: 1948,
    country: "اليابان",
    pages: 180,
    status: "مكتمل",
    rating: 9.1,
    genre: ["أدب كلاسيكي", "نفسي", "سيرة ذاتية"],
    description: "عمل أدبي ياباني مؤثر يحكي قصة رجل يشعر بالاغتراب التام عن المجتمع. تحفة أدبية عن الاكتئاب والعزلة النفسية.",
    readTime: "4 ساعات",
    language: "عربي",
    difficulty: "متقدم",
    themes: ["الاغتراب", "الاكتئاب", "الهوية", "المجتمع"]
  },
  {
    id: 3,
    title: "ثلج البلد",
    originalTitle: "Snow Country",
    author: "كاوباتا ياسوناري",
    translator: "MrPheonixX Team",
    year: 1948,
    country: "اليابان",
    pages: 200,
    status: "مكتمل",
    rating: 9.4,
    genre: ["أدب كلاسيكي", "رومانسي", "شاعري"],
    description: "رواية شاعرية جميلة عن الحب والفراق في منطقة جبلية مغطاة بالثلوج. فاز المؤلف بجائزة نوبل للآداب.",
    readTime: "5 ساعات",
    language: "عربي",
    difficulty: "متوسط",
    themes: ["الحب", "الطبيعة", "الجمال", "الزوال"]
  },
  {
    id: 4,
    title: "أهلاً بالـ NHK",
    originalTitle: "Welcome to the NHK",
    author: "تاتسوهيكو تاكيموتو",
    translator: "MrPheonixX Team",
    year: 2002,
    country: "اليابان",
    pages: 320,
    status: "مكتمل",
    rating: 8.9,
    genre: ["أدب معاصر", "نفسي", "كوميدي سوداء"],
    description: "رواية مظلمة وكوميدية عن شاب انطوائي يعاني من جنون العظمة. نظرة صادقة على ثقافة الـ otaku والعزلة الاجتماعية.",
    readTime: "8 ساعات",
    language: "عربي",
    difficulty: "متوسط",
    themes: ["العزلة", "جنون العظمة", "ثقافة الأوتاكو", "المجتمع الياباني"]
  },
  {
    id: 5,
    title: "الغابة النرويجية",
    originalTitle: "Norwegian Wood",
    author: "موراكامي هاروكي",
    translator: "MrPheonixX Team",
    year: 1987,
    country: "اليابان",
    pages: 290,
    status: "مكتمل",
    rating: 9.0,
    genre: ["أدب معاصر", "رومانسي", "درامي"],
    description: "قصة حب معقدة في اليابان في الستينات. رواية عن الشباب والحب والفقدان مع أجواء موراكامي المميزة.",
    readTime: "7 ساعات",
    language: "عربي",
    difficulty: "سهل",
    themes: ["الحب", "الشباب", "الفقدان", "الذكريات"]
  },
  {
    id: 6,
    title: "كافكا على الشاطئ",
    originalTitle: "Kafka on the Shore",
    author: "موراكامي هاروكي",
    translator: "MrPheonixX Team",
    year: 2002,
    country: "اليابان",
    pages: 480,
    status: "مكتمل",
    rating: 9.2,
    genre: ["أدب معاصر", "خيال سحري", "فلسفي"],
    description: "رواية سحرية وفلسفية تجمع بين الواقع والخيال. قصة فتى يهرب من المنزل ورجل يبحث عن قطة مفقودة.",
    readTime: "12 ساعة",
    language: "عربي",
    difficulty: "متقدم",
    themes: ["الهوية", "القدر", "الذاكرة", "السحر"]
  },
  {
    id: 7,
    title: "معركة الحب",
    originalTitle: "The Tale of Genji",
    author: "موراساكي شيكيبو",
    translator: "MrPheonixX Team",
    year: 1010,
    country: "اليابان",
    pages: 1200,
    status: "مكتمل",
    rating: 9.5,
    genre: ["أدب كلاسيكي", "تاريخي", "رومانسي"],
    description: "أقدم رواية في العالم، تحكي قصة الأمير جينجي في البلاط الياباني القد��م. تحفة أدبية خالدة عن الحب والجمال.",
    readTime: "30 ساعة",
    language: "عربي",
    difficulty: "متقدم جداً",
    themes: ["الحب", "البلاط", "الجمال", "التاريخ الياباني"]
  },
  {
    id: 8,
    title: "صوت الجبل",
    originalTitle: "The Sound of the Mountain",
    author: "كاوباتا ياسوناري",
    translator: "MrPheonixX Team",
    year: 1954,
    country: "اليابان",
    pages: 270,
    status: "مكتمل",
    rating: 8.8,
    genre: ["أدب كلاسيكي", "عائلي", "نفسي"],
    description: "رواية حساسة عن رجل مسن يواجه الشيخوخة وتعقيدات العلاقات العائلية. أسلوب شاعري مميز يصور الثقافة اليابانية.",
    readTime: "6 ساعات",
    language: "عربي",
    difficulty: "متوسط",
    themes: ["الشيخوخة", "العائلة", "التقاليد", "الزمن"]
  }
];

export default function ClassicLiterature() {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filteredWorks, setFilteredWorks] = useState(classicWorks);

  // استخراج جميع الأنواع والصعوبات
  const allGenres = Array.from(new Set(classicWorks.flatMap(work => work.genre)));
  const allDifficulties = Array.from(new Set(classicWorks.map(work => work.difficulty)));

  // تصفية الأعمال
  useEffect(() => {
    let filtered = classicWorks;

    // تصفية حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(work => 
        work.title.includes(searchTerm) ||
        work.originalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.author.includes(searchTerm)
      );
    }

    // تصفية حسب النوع
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(work => 
        selectedGenres.some(genre => work.genre.includes(genre))
      );
    }

    // تصفية حسب الصعوبة
    if (selectedDifficulty) {
      filtered = filtered.filter(work => work.difficulty === selectedDifficulty);
    }

    // ترتيب النتائج
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return b.year - a.year;
        case "pages":
          return b.pages - a.pages;
        default:
          return 0;
      }
    });

    setFilteredWorks(filtered);
  }, [searchTerm, selectedGenres, selectedDifficulty, sortBy]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "سهل": return "text-green-400 border-green-500/50";
      case "متوسط": return "text-yellow-400 border-yellow-500/50";
      case "متقدم": return "text-orange-400 border-orange-500/50";
      case "متقدم جداً": return "text-red-400 border-red-500/50";
      default: return "text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20"></div>
        
        {/* جسيمات عائمة */}
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4'][i % 4],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  📚 الأدب الكلاسيكي الياباني
                </h1>
                <p className="text-gray-400">كنوز الأدب الياباني العريق والمعاصر</p>
              </div>
              
              <InteractiveButton
                variant="magic"
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
                placeholder="ابحث في الأعمال الأدبية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900/50 border border-purple-500/30 rounded-lg px-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* فلاتر الأنواع */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-purple-400 font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4" />
                الأنواع:
              </span>
              {allGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedGenres.includes(genre)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* فلتر الصعوبة */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-blue-400 font-semibold">مستوى الصعوبة:</span>
              {allDifficulties.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? "" : difficulty)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedDifficulty === difficulty
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>

            {/* خيارات الترتيب */}
            <div className="flex justify-center items-center gap-4">
              <span className="text-purple-400 font-semibold">ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="rating">التقييم</option>
                <option value="title">الاسم</option>
                <option value="year">سنة النشر</option>
                <option value="pages">عدد الصفحات</option>
              </select>
            </div>
          </div>

          {/* إحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{filteredWorks.length}</div>
              <div className="text-gray-400 text-sm">عمل أدبي</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(filteredWorks.reduce((sum, work) => sum + work.pages, 0) / 1000)}K
              </div>
              <div className="text-gray-400 text-sm">صفحة</div>
            </div>
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-400">
                {(filteredWorks.reduce((sum, work) => sum + work.rating, 0) / filteredWorks.length).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">متوسط التقييم</div>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.min(...filteredWorks.map(work => work.year))}
              </div>
              <div className="text-gray-400 text-sm">أقدم عمل</div>
            </div>
          </div>

          {/* قائمة الأعمال */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorks.map((work) => (
              <InteractiveCard
                key={work.id}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-purple-500/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">
                        {work.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-sm">
                        {work.originalTitle} • {work.author}
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
                    {work.genre.slice(0, 2).map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-300 border-purple-500/50"
                      >
                        {genre}
                      </Badge>
                    ))}
                    <Badge
                      variant="outline"
                      className={`${getDifficultyColor(work.difficulty)}`}
                    >
                      {work.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                    {work.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{work.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span>{work.pages} صفحة</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{work.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Globe className="w-4 h-4" />
                      <span>{work.country}</span>
                    </div>
                  </div>

                  {/* المواضيع */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">المواضيع الرئيسية:</p>
                    <div className="flex flex-wrap gap-1">
                      {work.themes.slice(0, 3).map((theme) => (
                        <span
                          key={theme}
                          className="bg-indigo-500/10 text-indigo-300 text-xs px-2 py-1 rounded"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <InteractiveButton
                      variant="magic"
                      className="w-full group-hover:scale-105 transition-all duration-300"
                      onClick={() => navigate(`/reader/classic/${work.id}`)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      ابدأ القراءة
                    </InteractiveButton>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        تحميل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                      >
                        <Award className="w-4 h-4 mr-1" />
                        تقييم
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
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">جرب البحث بكلمات مختلفة أو قم بتغيير المرشحات</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
