import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, Pause, Volume2, VolumeX, Star, Download, Heart, Eye, Calendar, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InteractiveButton, InteractiveCard } from "@/components/InteractiveElements";

// بيانات مجلدات SAO الحقيقية
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
    subtitle: "آين��راد",
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
  },
  {
    id: 3,
    title: "Sword Art Online Volume 3: Fairy Dance",
    titleArabic: "سيف آرت أونلاين المجلد 3: رقصة الجنيات",
    subtitle: "رقصة الجنيات",
    description: "كيريتو يدخل عالم ALfheim Online للبحث عن أسونا المختطفة. عالم جديد مليء بالجنيات والسحر.",
    descriptionArabic: "كيريتو يدخل عالم ALfheim Online للبحث عن أسونا المختطفة. عالم جديد مليء بالجنيات والسحر.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080",
    pages: 265,
    chapters: 9,
    readProgress: 95,
    rating: 9.2,
    status: 'available',
    releaseDate: "2009-12-10",
    translator: "MrPheonixX Team",
    genre: ["إيسيكاي", "أكشن", "رومانسي", "فانتازي"],
    summary: "بعد الهروب من SAO، كيريتو يكتشف أن أسونا محتجزة في لعبة جديدة. مهمة إنقاذ في عالم الجنيات السحري.",
    keyCharacters: ["كيريتو", "أسونا", "ليفا", "ريكون", "سوغو"]
  },
  {
    id: 4,
    title: "Sword Art Online Volume 4: Fairy Dance",
    titleArabic: "سيف آرت أونلاين المجلد 4: رقصة الجنيات",
    subtitle: "رقصة الجنيات",
    description: "خاتمة مثيرة لقوس رقصة الجنيات مع معركة نهائية من أجل حرية أسونا وكشف الحقيقة المظلمة.",
    descriptionArabic: "خاتمة مثيرة لقوس رقصة الجنيات مع معركة نهائية من أجل حرية أسونا وكشف الحقيقة المظلمة.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080",
    pages: 251,
    chapters: 8,
    readProgress: 90,
    rating: 9.3,
    status: 'available',
    releaseDate: "2010-04-10",
    translator: "MrPheonixX Team",
    genre: ["إيسيكاي", "أكشن", "رومانسي", "فانتازي"],
    summary: "المواجهة النهائية في ALfheim Online. كيريتو يواجه سوغو في معركة مصيرية لإنقاذ أسونا وكشف مؤامرته الشريرة.",
    keyCharacters: ["كيريتو", "أسونا", "ليفا", "سوغو", "كايابا"]
  },
  {
    id: 5,
    title: "Sword Art Online Volume 5: Phantom Bullet",
    titleArabic: "سيف آرت أونلاين المجلد 5: الرصاصة الوهمية",
    subtitle: "الرصاصة الوهمية",
    description: "كيريتو يدخل عالم Gun Gale Online للتحقيق في جرائم قتل غامضة مرتبطة باللعبة.",
    descriptionArabic: "كيريتو يدخل عالم Gun Gale Online للتحقيق في جرائم قتل غامضة مرتبطة باللعبة.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080",
    pages: 287,
    chapters: 10,
    readProgress: 85,
    rating: 9.1,
    status: 'available',
    releaseDate: "2010-08-10",
    translator: "MrPheonixX Team",
    genre: ["إيسيكاي", "أكشن", "إثارة", "خيال علمي"],
    summary: "في عالم GGO المليء بالأسلحة، كيريتو يحقق في ظاهرة Death Gun الغامضة التي تقتل اللاعبين في الواقع.",
    keyCharacters: ["كيريتو", "سينون", "Death Gun", "كيريتو (GGO)"]
  },
  {
    id: 6,
    title: "Sword Art Online Volume 6: Phantom Bullet",
    titleArabic: "سيف آرت أونلاين المجلد 6: الرصاصة الوهمية",
    subtitle: "الرصاصة الوهمية",
    description: "تصاعد التشويق في GGO مع كشف هوية Death Gun والمواجهة النهائية في البطولة.",
    descriptionArabic: "تصاعد التشويق في GGO مع كشف هوية Death Gun والمواجهة النهائية في البطولة.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080",
    pages: 294,
    chapters: 11,
    readProgress: 80,
    rating: 9.0,
    status: 'available',
    releaseDate: "2010-12-10",
    translator: "MrPheonixX Team",
    genre: ["إيسيكاي", "أكشن", "إثارة", "خيال علمي"],
    summary: "الكشف المثير عن حقيقة Death Gun وماضيه المرتبط بـ SAO. مواجهة نهائية مصيرية في بطولة Bullet of Bullets.",
    keyCharacters: ["كيريتو", "سينون", "Death Gun", "أسونا"]
  },
  {
    id: 7,
    title: "Sword Art Online Volume 7: Mother's Rosary",
    titleArabic: "سيف آرت أونلاين المجلد 7: مسبحة الأم",
    subtitle: "مسبحة الأم",
    description: "قصة مؤثرة عن أسونا ولقائها مع يوكي، المبارزة الأقوى في ALfheim Online.",
    descriptionArabic: "قصة مؤثرة عن أسونا ولقائها مع يوكي، المبارزة الأقوى في ALfheim Online.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080",
    pages: 276,
    chapters: 9,
    readProgress: 75,
    rating: 9.7,
    status: 'available',
    releaseDate: "2011-04-10",
    translator: "MrPheonixX Team",
    genre: ["إيسيكاي", "دراما", "رومانسي", "مؤثر"],
    summary: "أسونا تلتقي بيوكي، لاعبة مريضة بالسرطان تبحث عن تحقيق حلمها الأخير في ALfheim Online. قصة عن الصداقة والأمل.",
    keyCharacters: ["أسونا", "يوكي", "كيريتو", "Sleeping Knights"]
  },
  {
    id: 8,
    title: "Sword Art Online Volume 8: Early and Late",
    titleArabic: "سيف آرت أونلاين المجلد 8: مبكر ومتأخر",
    subtitle: "مبكر ومتأخر",
    description: "مجموعة من القصص القصيرة التي تملأ الفجوات في السلسلة وتكشف المزيد عن الشخصيات.",
    descriptionArabic: "مجموعة من القصص القصيرة التي تملأ الفجوات في السلسلة وتكشف المزيد عن الشخصيات.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080",
    pages: 263,
    chapters: 12,
    readProgress: 70,
    rating: 8.9,
    status: 'available',
    releaseDate: "2011-08-10",
    translator: "MrPheonixX Team",
    genre: ["إيسيكاي", "قصص قصيرة", "متنوع"],
    summary: "مجموعة من القصص القصيرة المتنوعة التي تغطي فترات مختلفة من رحلة كيريتو وأصدقائه عبر العوالم الافتراضية.",
    keyCharacters: ["كيريتو", "أسونا", "شخصيات متنوعة"]
  },
  {
    id: 9,
    title: "Sword Art Online Volume 9: Alicization Beginning",
    titleArabic: "سيف آرت أونلاين المجلد 9: بداية الأليسزايشن",
    subtitle: "أليسزايشن: البداية",
    description: "بداية قوس أليسزايشن الملحمي حيث يجد كيريتو نفسه في عالم جديد بقوانين مختلفة تمامًا.",
    descriptionArabic: "بداية قوس أليسزايشن الملحمي حيث يجد كيريتو نفسه في عالم جديد بقوانين مختلفة تمامًا.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080",
    pages: 312,
    chapters: 12,
    readProgress: 65,
    rating: 9.2,
    status: 'available',
    releaseDate: "2012-10-10",
    translator: "MrPheonixX Team",
    genre: ["إيسيكاي", "أكشن", "فانتازي", "خارق"],
    summary: "كيريتو يستيقظ في عالم غير معروف بقواعد صارمة وسيوف مقدسة وذكاء اصطناعي متطور.",
    keyCharacters: ["كيريتو", "يوجينيو", "أليس", "أسونا"]
  },
  {
    id: 10,
    title: "Sword Art Online Volume 10: Alicization Running",
    titleArabic: "سيف آرت أونلاين المجلد 10: الأليسزايشن الجارية",
    subtitle: "أليسزايشن: الجارية",
    description: "تستمر رحلة كيريتو ويوجينيو عبر العوالم الداخلية لاكتشاف حقيقة هذا العالم الغامض.",
    descriptionArabic: "تستمر رحلة كيريتو ويوجينيو عبر العوالم الداخلية لاكتشاف حقيقة هذا العالم الغامض.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080",
    pages: 298,
    chapters: 11,
    readProgress: 60,
    rating: 9.1,
    status: 'available',
    releaseDate: "2013-03-10",
    translator: "MrPheonixX Team",
    genre: ["إيسيكاي", "أكشن", "فانتازي", "مغامرة"],
    summary: "تقدم كبير في عالم الأليسزايشن مع تحديات جديدة وصراعات مصيرية.",
    keyCharacters: ["كيريتو", "يوجينيو", "أليس", "المدير الإداري"]
  }
];

const saoPdfUrls: Record<number, string> = {
  1: "https://cdn.builder.io/o/assets%2F15999d2412c04cefb5e665795b57bb74%2Fbd45621c6c894855b5650b06f7f5105b?alt=media&token=dd638303-cc9f-45f8-9f02-1df9c881714a&apiKey=15999d2412c04cefb5e665795b57bb74",
  2: "https://cdn.builder.io/o/assets%2F15999d2412c04cefb5e665795b57bb74%2Fec55798c95bc435ea71f06ac938cefc4?alt=media&token=90805070-1ea6-4fae-8abd-e6663b494759&apiKey=15999d2412c04cefb5e665795b57bb74",
  3: "https://cdn.builder.io/o/assets%2F15999d2412c04cefb5e665795b57bb74%2F090576a5a73347e5b4b2f4b00f406ec9?alt=media&token=f13aa44f-85b2-488f-bf4c-69f75737e67c&apiKey=15999d2412c04cefb5e665795b57bb74",
  4: "https://cdn.builder.io/o/assets%2F15999d2412c04cefb5e665795b57bb74%2F50468fa300ac4c9cae98579c0c479ed3?alt=media&token=0453971b-ce93-4f9b-8372-20b89de110fb&apiKey=15999d2412c04cefb5e665795b57bb74",
  5: "https://cdn.builder.io/o/assets%2F15999d2412c04cefb5e665795b57bb74%2F1ec43481ca804e5085b0ce0fa936f783?alt=media&token=921df5c1-4219-4e8c-9526-13dba57ccfb5&apiKey=15999d2412c04cefb5e665795b57bb74",
  6: "https://cdn.builder.io/o/assets%2F15999d2412c04cefb5e665795b57bb74%2Fed1797f4171a43f68f1918285e6ad895?alt=media&token=59bf4efa-3482-4254-a14c-f052e8bb616e&apiKey=15999d2412c04cefb5e665795b57bb74",
  7: "https://cdn.builder.io/o/assets%2F15999d2412c04cefb5e665795b57bb74%2F8bd4a9b5e2244df08b597c653952d406?alt=media&token=c93c02a3-7ae0-4cb7-b822-7fe859c16de4&apiKey=15999d2412c04cefb5e665795b57bb74",
  8: "https://cdn.builder.io/o/assets%2F15999d2412c04cefb5e665795b57bb74%2F8931eeaf1b1740ffba9f0689193d1d9b?alt=media&token=279c2321-40cc-49de-89e4-03d388edf7ce&apiKey=15999d2412c04cefb5e665795b57bb74",
  9: "https://cdn.builder.io/o/assets%2F15999d2412c04cefb5e665795b57bb74%2Fe205e51930914ab3b6dd4ba5b58f016a?alt=media&token=b819ef33-3efd-455f-ae69-5b33c69a3ec3&apiKey=15999d2412c04cefb5e665795b57bb74",
  10: "https://cdn.builder.io/o/assets%2F15999d2412c04cefb5e665795b57bb74%2F0c344b8b6c4a48a080dbd588d466864c?alt=media&token=9715fa1e-828e-4460-9535-46c9475fe7eb&apiKey=15999d2412c04cefb5e665795b57bb74"
};

export default function SAOLibrary() {
  const navigate = useNavigate();
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("number");
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredVolumes = saoVolumes
    .filter(volume => 
      volume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volume.titleArabic.includes(searchQuery) ||
      volume.subtitle.includes(searchQuery)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating": return b.rating - a.rating;
        case "progress": return b.readProgress - a.readProgress;
        case "release": return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
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
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
        
        {/* جسيمات SAO */}
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: ['#3b82f6', '#6366f1', '#8b5cf6', '#06b6d4'][i % 4],
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
        <header className="border-b border-blue-500/20 bg-black/40 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <InteractiveButton
                  variant="magic"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  الع��دة
                </InteractiveButton>
                
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ⚔️ مكتبة ساو الأصلية
                  </h1>
                  <p className="text-gray-400">سلسلة Sword Art Online الكاملة - 28 مجلد</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={toggleTTS}
                  className={`border-purple-500 ${isTTSEnabled ? 'bg-purple-500/20 text-purple-300' : 'text-purple-400'}`}
                >
                  {isTTSEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                  {isTTSEnabled ? 'تشغيل الصوت' : 'إيقاف الصوت'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* أدوات البحث والتصفية */}
          <div className="mb-8 space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="ابحث في مجلدات SAO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex justify-center items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-semibold">ترتيب حسب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-900/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="number">رقم المجلد</option>
                  <option value="rating">التقييم</option>
                  <option value="progress">التقدم</option>
                  <option value="release">تاريخ الإصدار</option>
                </select>
              </div>
            </div>
          </div>

          {/* إحصائيات المجموعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{filteredVolumes.length}</div>
              <div className="text-gray-400 text-sm">مجلد متاح</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {filteredVolumes.reduce((sum, vol) => sum + vol.pages, 0)}
              </div>
              <div className="text-gray-400 text-sm">صفحة</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {(filteredVolumes.reduce((sum, vol) => sum + vol.rating, 0) / filteredVolumes.length).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">متوسط التقييم</div>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(filteredVolumes.reduce((sum, vol) => sum + vol.readProgress, 0) / filteredVolumes.length)}%
              </div>
              <div className="text-gray-400 text-sm">متوسط التقدم</div>
            </div>
          </div>

          {/* قائمة المجلدات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredVolumes.map((volume) => (
              <InteractiveCard
                key={volume.id}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-blue-500/30 backdrop-blur-xl hover:border-blue-400/50 transition-all duration-500 cursor-pointer"
                onClick={() => handleVolumeSelect(volume.id)}
              >
                {/* صورة الخلفية */}
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    backgroundImage: `url(${volume.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                
                {/* تدرج للنص */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                      المجلد {volume.id}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{volume.rating}</span>
                    </div>
                  </div>

                  <CardTitle className="text-lg text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">
                    {volume.titleArabic}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-300 text-sm">
                    {volume.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                    {volume.description}
                  </p>

                  {/* معلومات المجلد */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileText className="w-3 h-3" />
                      <span>{volume.pages} صفحة</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <BookOpen className="w-3 h-3" />
                      <span>{volume.chapters} فصل</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(volume.releaseDate).getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <User className="w-3 h-3" />
                      <span>{volume.translator}</span>
                    </div>
                  </div>

                  {/* الأنواع */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {volume.genre.map((g) => (
                      <Badge
                        key={g}
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs"
                      >
                        {g}
                      </Badge>
                    ))}
                  </div>

                  {/* شريط التقدم */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>التقدم</span>
                      <span>{volume.readProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${volume.readProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* أزرار التفاعل */}
                  <div className="space-y-2">
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
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                        onClick={(e) => { e.stopPropagation(); const url = saoPdfUrls[volume.id]; if (url) window.open(url, '_blank'); }}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        تحميل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-500/50 text-red-300 hover:bg-red-500/10"
                        onClick={(e) => { e.stopPropagation(); const url = saoPdfUrls[volume.id]; if (url) window.open(url, '_blank'); }}
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        إعجاب
                      </Button>
                    </div>
                  </div>

                  {/* الشخصيات الرئيسية */}
                  <div className="mt-4 pt-4 border-t border-gray-600/50">
                    <p className="text-xs text-gray-400 mb-2">الشخصيات الرئيسية:</p>
                    <div className="flex flex-wrap gap-1">
                      {volume.keyCharacters.map((character) => (
                        <span
                          key={character}
                          className="bg-indigo-500/10 text-indigo-300 text-xs px-2 py-1 rounded"
                        >
                          {character}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>

                {/* تأثير التحويم */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </InteractiveCard>
            ))}
          </div>

          {/* رسالة عدم وجود نتائج */}
          {filteredVolumes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">جرب البحث بكلمات مختلفة</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
