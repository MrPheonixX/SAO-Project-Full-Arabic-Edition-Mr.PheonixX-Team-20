import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sword, 
  BookOpen, 
  Users, 
  Star, 
  Shield, 
  Play, 
  ExternalLink, 
  Download,
  Zap,
  Crown,
  Heart,
  Sparkles,
  Globe,
  TrendingUp
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [showWelcome, setShowWelcome] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    translationQuality: 100,
    readers: 10000,
    translatedVolumes: 33
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("sao-theme") || "dark";
    setCurrentTheme(savedTheme);
    document.documentElement.className = savedTheme;

    const timer = setTimeout(() => setShowWelcome(false), 4000);
    
    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animate stats
    const animateStats = () => {
      const interval = setInterval(() => {
        setStats(prev => ({
          translationQuality: prev.translationQuality,
          readers: prev.readers + Math.floor(Math.random() * 3),
          translatedVolumes: prev.translatedVolumes
        }));
      }, 5000);
      
      return () => clearInterval(interval);
    };
    
    const cleanup = animateStats();
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      cleanup();
    };
  }, []);

  const changeTheme = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem("sao-theme", theme);
    document.documentElement.className = theme;
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-violet-900/20"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
        
        {/* Interactive mouse follow effect */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-blue-500/5 to-transparent rounded-full pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
      </div>

      {/* Welcome Loading Screen */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-full">
                <Sword className="w-16 h-16 text-white animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 bg-clip-text text-transparent animate-pulse">
              MrPheonixX Team
            </h1>
            <p className="text-2xl mb-4 text-gray-300">Loading Aincrad...</p>
            <p className="text-lg text-blue-400 mb-6">تحميل النظام...</p>
            <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-blue-500/20 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-50"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                  <Sword className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MrPheonixX Team
                </h1>
                <p className="text-sm text-gray-400">منصة القراءة الحصرية</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                onClick={() => navigate("/login")}
              >
                تسجيل دخول
              </Button>
              
              {/* Theme Switcher */}
              <div className="flex items-center space-x-2 bg-gray-800/50 p-2 rounded-lg">
                <button
                  onClick={() => changeTheme("light")}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${currentTheme === "light" ? "border-blue-400 scale-110" : "border-gray-600"} bg-white`}
                ></button>
                <button
                  onClick={() => changeTheme("dark")}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${currentTheme === "dark" ? "border-blue-400 scale-110" : "border-gray-600"} bg-gray-900`}
                ></button>
                <button
                  onClick={() => changeTheme("sepia")}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${currentTheme === "sepia" ? "border-blue-400 scale-110" : "border-gray-600"} bg-amber-100`}
                ></button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className="text-6xl">⚔️</div>
              <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 bg-clip-text text-transparent leading-tight">
                SAO
              </h1>
              <div className="text-6xl">⚔️</div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 text-white">
              الطبعة العربية الكاملة
            </h2>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              أول منصة رسمية لقراءة Sword Art Online بالعربية
              <br />
              <span className="text-blue-400 font-semibold">
                ترجمة Mr.PheonixX Team × DeepL Premium
              </span>
            </p>
            
            <div className="flex justify-center space-x-6 mb-8">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-4 text-lg font-semibold"
                onClick={() => navigate("/sao")}
              >
                <Zap className="w-5 h-5 mr-2" />
                استكشف السيرفرات
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-4 text-lg"
                onClick={() => navigate("/progressive")}
              >
                <Download className="w-5 h-5 mr-2" />
                دخول للمكتبة
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-400 mb-2">
                {stats.translationQuality}%
              </div>
              <p className="text-gray-400">ترجمة احترافية</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-400 mb-2">
                +{stats.readers.toLocaleString()}
              </div>
              <p className="text-gray-400">قارئ نشط</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-violet-400 mb-2">
                +{stats.translatedVolumes}
              </div>
              <p className="text-gray-400">مجلد مترجم</p>
            </div>
          </div>
        </section>

        {/* Main Series Section */}
        <section className="grid md:grid-cols-2 gap-12 mb-20 max-w-6xl mx-auto">
          {/* Sword Art Online */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-600/20 border-blue-500/30 backdrop-blur-xl hover:border-blue-400/50 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-3xl text-blue-400 flex items-center gap-3">
                  <Sword className="w-8 h-8" />
                  Sword Art Online
                </CardTitle>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/50">
                  <Crown className="w-3 h-3 mr-1" />
                  الأصلي
                </Badge>
              </div>
              <CardDescription className="text-gray-300 text-lg">
                28 مجلد - منظور كيريتو الأساسي
                <br />
                <span className="text-blue-400">28 Volumes - Kirito's Perspective</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <p className="text-gray-300 mb-6 leading-relaxed">
                القصة الأصلية لكيريتو وأسونا في عالم ساو الافتراضي. مغامرة ملحمية تمتد عبر عوالم متعددة
                مع ترجمة دقيقة ومراجعة احترافية.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  <BookOpen className="w-3 h-3 mr-1" />
                  28 مجلد
                </Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  <Users className="w-3 h-3 mr-1" />
                  كيريتو
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  <Sparkles className="w-3 h-3 mr-1" />
                  مكتمل
                </Badge>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 group-hover:scale-105 transition-all duration-300 text-lg py-6"
                onClick={() => navigate("/sao")}
              >
                <Play className="w-5 h-5 mr-2" />
                ابدأ القراءة الآن
              </Button>
            </CardContent>
          </Card>

          {/* SAO Progressive */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-violet-600/20 border-purple-500/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-3xl text-purple-400 flex items-center gap-3">
                  <Star className="w-8 h-8" />
                  SAO Progressive
                </CardTitle>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/50">
                  <Heart className="w-3 h-3 mr-1" />
                  مميز
                </Badge>
              </div>
              <CardDescription className="text-gray-300 text-lg">
                9 مجلدات - منظور أسونا المفصل
                <br />
                <span className="text-purple-400">9 Volumes - Asuna's Detailed Perspective</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <p className="text-gray-300 mb-6 leading-relaxed">
                نفس أحداث ساو ولكن من منظور أسونا مع تفاصيل أعمق وقصص إضافية لم تُروى من قبل.
                كل طابق يُحكى بتفاصيل مذهلة.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  <BookOpen className="w-3 h-3 mr-1" />
                  9 مجلدات
                </Badge>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
                  <Heart className="w-3 h-3 mr-1" />
                  أسونا
                </Badge>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  مستمر
                </Badge>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 group-hover:scale-105 transition-all duration-300 text-lg py-6"
                onClick={() => navigate("/progressive")}
              >
                <Play className="w-5 h-5 mr-2" />
                ابدأ القراءة الآن
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Side Works Preview */}
        <section className="mb-20">
          <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            أعمال إضافية مميزة
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-500/30 backdrop-blur-xl hover:border-gray-400/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-300 flex items-center gap-3">
                  <Globe className="w-6 h-6" />
                  Welcome to the NHK
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">رواية نفسية عميقة عن الانطوائية والمجتمع الياباني</p>
                <Button variant="outline" className="w-full border-gray-500 text-gray-300 hover:bg-gray-500/10">
                  <BookOpen className="w-4 h-4 mr-2" />
                  قريباً
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-500/30 backdrop-blur-xl hover:border-gray-400/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-300 flex items-center gap-3">
                  <Globe className="w-6 h-6" />
                  No Longer Human
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">عمل أدبي كلاسيكي لدازاي أوسامو</p>
                <Button variant="outline" className="w-full border-gray-500 text-gray-300 hover:bg-gray-500/10">
                  <BookOpen className="w-4 h-4 mr-2" />
                  قريباً
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Links */}
        <section className="text-center mb-20">
          <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            تابعنا على منصاتنا
          </h3>
          <div className="flex justify-center space-x-8">
            <Button 
              size="lg"
              variant="outline" 
              className="border-red-500 text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
              onClick={() => window.open("https://bit.ly/452l2pB", "_blank")}
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              YouTube
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-all duration-300 group"
              onClick={() => window.open("https://bit.ly/4mvCWHb", "_blank")}
            >
              <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Discord
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline" 
              className="border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-all duration-300 group"
              onClick={() => window.open("https://bit.ly/MrPheonixX", "_blank")}
            >
              <Shield className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Patreon
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-black/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="mb-6">
            <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              MrPheonixX Team
            </h4>
            <p className="text-gray-400">
              المحتوى حصري لفريق MrPheonixX - يُمنع إعادة الإنتاج غير المصرح به
            </p>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-sm">
              © 2024 MrPheonixX Team - All Rights Reserved
              <br />
              Translated and proofread using DeepL Premium with manual supervision
              <br />
              <span className="text-blue-400">Built with ❤️ for the Arabic SAO Community</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
