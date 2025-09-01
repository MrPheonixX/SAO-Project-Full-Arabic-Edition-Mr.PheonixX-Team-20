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
import ReadingEnhancementSystem from "@/components/ReadingEnhancementSystem";
import PersonalizationEngine from "@/components/PersonalizationEngine";
import ReadingAnalytics from "@/components/ReadingAnalytics";
import SocialReadingHub from "@/components/SocialReadingHub";
import AdvancedPerformanceOptimizer from "@/components/AdvancedPerformanceOptimizer";
import {
  User,
  Settings,
  BookOpen,
  Award,
  Clock,
  Star,
  Target,
  TrendingUp,
  Calendar,
  Crown,
  Heart,
  Zap,
  Shield,
  Trophy,
  ArrowLeft,
  Edit,
  Save,
  Sword,
  Palette,
  BarChart,
  Brain,
  Users,
} from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  joinDate: string;
  avatar: string;
  badge: string;
  readingStreak: number;
  totalPagesRead: number;
  favoriteCharacter: string;
  readingPreferences: {
    theme: string;
    fontSize: number;
    readingMode: string;
  };
}

interface Achievement {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: "first_page",
      title: "First Step",
      titleArabic: "الخطوة الأولى",
      description: "Read your first page",
      descriptionArabic: "اقرأ صفحتك الأولى",
      icon: "📖",
      unlocked: true,
      unlockedDate: "2024-01-15",
      progress: 1,
      maxProgress: 1,
      rarity: "common",
    },
    {
      id: "page_master",
      title: "Page Master",
      titleArabic: "سيد الصفحات",
      description: "Read 1000 pages",
      descriptionArabic: "اقرأ 1000 صفحة",
      icon: "📚",
      unlocked: true,
      unlockedDate: "2024-02-20",
      progress: 1250,
      maxProgress: 1000,
      rarity: "rare",
    },
    {
      id: "week_streak",
      title: "Weekly Warrior",
      titleArabic: "محارب الأسبوع",
      description: "Maintain a 7-day reading streak",
      descriptionArabic: "حافظ على سلسلة قراءة لمدة 7 أيام",
      icon: "🔥",
      unlocked: true,
      unlockedDate: "2024-03-01",
      progress: 7,
      maxProgress: 7,
      rarity: "epic",
    },
    {
      id: "sao_expert",
      title: "SAO Expert",
      titleArabic: "خبير ساو",
      description: "Complete all SAO volumes",
      descriptionArabic: "أكمل جميع مجلدات ساو",
      icon: "⚔️",
      unlocked: false,
      progress: 15,
      maxProgress: 28,
      rarity: "legendary",
    },
  ];

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem("user-profile");
    if (savedProfile) {
      try {
        setUser(JSON.parse(savedProfile));
      } catch {
        localStorage.removeItem("user-profile");
        navigate("/login");
        return;
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSaveProfile = () => {
    if (user) {
      localStorage.setItem("user-profile", JSON.stringify(user));
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user-profile");
    localStorage.removeItem("auth-token");
    navigate("/");
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-400 border-gray-400";
      case "rare":
        return "text-blue-400 border-blue-400";
      case "epic":
        return "text-purple-400 border-purple-400";
      case "legendary":
        return "text-yellow-400 border-yellow-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const calculateLevelProgress = (xp: number) => {
    const currentLevelXp = (user?.level || 1) * 100;
    const nextLevelXp = ((user?.level || 1) + 1) * 100;
    const progress =
      ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 text-white">
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة للرئيسية
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                تسجيل خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-black/40 border-blue-500/30 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-4xl">
                    {user.avatar}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {user.level}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={user.username}
                        onChange={(e) =>
                          setUser({ ...user, username: e.target.value })
                        }
                        className="text-2xl font-bold bg-transparent border-b border-blue-400 text-blue-400 focus:outline-none"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-blue-400">
                        {user.username}
                      </h1>
                    )}

                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <Crown className="w-3 h-3 mr-1" />
                      {user.badge}
                    </Badge>
                  </div>

                  <p className="text-gray-300 mb-3">
                    عضو منذ{" "}
                    {new Date(user.joinDate).toLocaleDateString("ar-SA")}
                  </p>

                  {/* Level Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>المستوى {user.level}</span>
                      <span>{user.xp} XP</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateLevelProgress(user.xp)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={
                        isEditing ? handleSaveProfile : () => setIsEditing(true)
                      }
                      className={
                        isEditing ? "bg-green-600 hover:bg-green-700" : ""
                      }
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          حفظ
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          تعديل
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-black/30 p-2 rounded-lg overflow-x-auto">
            {[
              { id: "overview", label: "نظرة عامة", icon: User },
              { id: "achievements", label: "الإنجازات", icon: Award },
              { id: "statistics", label: "الإحصائيات", icon: TrendingUp },
              { id: "analytics", label: "التحليلات الذكية", icon: BarChart },
              { id: "social", label: "التفاعل الاجتماعي", icon: Users },
              { id: "performance", label: "محسن الأداء", icon: Zap },
              { id: "personalization", label: "التخصيص", icon: Palette },
              { id: "reading", label: "نظام القراءة", icon: Brain },
              { id: "settings", label: "الإعدادات", icon: Settings },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 min-w-fit"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-blue-300">
                  {user.totalPagesRead}
                </h3>
                <p className="text-gray-300">صفحة مقروءة</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-purple-300">
                  {user.readingStreak}
                </h3>
                <p className="text-gray-300">أيام متتالية</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-green-300">
                  {achievements.filter((a) => a.unlocked).length}
                </h3>
                <p className="text-gray-300">إنجاز مفتوح</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-500/30">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-yellow-300">
                  {user.level}
                </h3>
                <p className="text-gray-300">المستوى</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`bg-black/40 backdrop-blur-xl transition-all duration-300 ${
                  achievement.unlocked
                    ? `border-${getRarityColor(achievement.rarity).split(" ")[0].split("-")[1]}-500/50`
                    : "border-gray-600/30"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`text-4xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}
                    >
                      {achievement.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3
                          className={`font-bold ${achievement.unlocked ? getRarityColor(achievement.rarity) : "text-gray-500"}`}
                        >
                          {achievement.titleArabic}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getRarityColor(achievement.rarity)}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>

                      <p className="text-gray-400 text-sm mb-3">
                        {achievement.descriptionArabic}
                      </p>

                      {achievement.unlocked ? (
                        <Badge className="bg-green-600">
                          مفتوح في{" "}
                          {new Date(
                            achievement.unlockedDate!,
                          ).toLocaleDateString("ar-SA")}
                        </Badge>
                      ) : (
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>التقدم</span>
                            <span>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                              style={{
                                width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "statistics" && (
          <div className="space-y-6">
            <Card className="bg-black/40 border-blue-500/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-blue-400">
                  إحصائيات القراءة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="text-lg font-semibold text-blue-300">
                      وقت القراءة
                    </h4>
                    <p className="text-2xl font-bold text-white">127 ساعة</p>
                  </div>

                  <div className="text-center">
                    <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="text-lg font-semibold text-purple-300">
                      معدل القراءة
                    </h4>
                    <p className="text-2xl font-bold text-white">45 صفحة/يوم</p>
                  </div>

                  <div className="text-center">
                    <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <h4 className="text-lg font-semibold text-red-300">
                      الشخصية المفضلة
                    </h4>
                    <p className="text-2xl font-bold text-white">
                      {user.favoriteCharacter}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <ReadingAnalytics />
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-6">
            <SocialReadingHub />
          </div>
        )}

        {activeTab === "performance" && (
          <div className="space-y-6">
            <AdvancedPerformanceOptimizer />
          </div>
        )}

        {activeTab === "personalization" && (
          <div className="space-y-6">
            <PersonalizationEngine />
          </div>
        )}

        {activeTab === "reading" && (
          <div className="space-y-6">
            <ReadingEnhancementSystem
              content="هذا نموذج لنظام القراءة المتقدم. يمكنك تجربة جميع الخصائص المتاحة من خلال الشريط العلوي."
              onSettingsChange={(settings) => {
                console.log('إعدادات القراءة محدثة:', settings);
              }}
            />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card className="bg-black/40 border-blue-500/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-blue-400">تفضيلات القراءة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    المظهر المفضل
                  </label>
                  <select
                    value={user.readingPreferences.theme}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        readingPreferences: {
                          ...user.readingPreferences,
                          theme: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-black/40 border border-gray-500/30 rounded-md text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="dark">مظلم</option>
                    <option value="light">فاتح</option>
                    <option value="sepia">عين دافئة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    حجم الخط: {user.readingPreferences.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={user.readingPreferences.fontSize}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        readingPreferences: {
                          ...user.readingPreferences,
                          fontSize: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    نمط القراءة المفضل
                  </label>
                  <select
                    value={user.readingPreferences.readingMode}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        readingPreferences: {
                          ...user.readingPreferences,
                          readingMode: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-black/40 border border-gray-500/30 rounded-md text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="scroll">تمرير</option>
                    <option value="flipbook">كتاب مقلب</option>
                    <option value="slide">شرائح</option>
                  </select>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                >
                  <Save className="w-4 h-4 mr-2" />
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
