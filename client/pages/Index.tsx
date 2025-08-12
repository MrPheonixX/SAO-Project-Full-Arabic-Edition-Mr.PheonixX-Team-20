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
  TrendingUp,
} from "lucide-react";
import { InteractiveButton, InteractiveCard, VisualEffectsComponent, InteractiveExperience } from "@/components/InteractiveElements";

export default function Index() {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [showWelcome, setShowWelcome] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    translationQuality: 100,
    readers: 10000,
    translatedVolumes: 33,
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

    // تشغيل الأنمي ايموجي عند التفاعل
    const handlePageInteraction = () => {
      if (Math.random() < 0.15) {
        // 15% احتمال
        window.dispatchEvent(new CustomEvent("trigger-anime-emoji"));
      }
    };

    // استمع للنقرات والتمرير
    document.addEventListener("click", handlePageInteraction);
    document.addEventListener("scroll", handlePageInteraction);

    window.addEventListener("mousemove", handleMouseMove);

    // Animate stats
    const animateStats = () => {
      const interval = setInterval(() => {
        setStats((prev) => ({
          translationQuality: prev.translationQuality,
          readers: prev.readers + Math.floor(Math.random() * 3),
          translatedVolumes: prev.translatedVolumes,
        }));
      }, 5000);

      return () => clearInterval(interval);
    };

    const cleanup = animateStats();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handlePageInteraction);
      document.removeEventListener("scroll", handlePageInteraction);
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

        {/* Enhanced Quantum Particle Field */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: [
                "#3b82f6",
                "#8b5cf6",
                "#06b6d4",
                "#f59e0b",
                "#10b981",
              ][i % 5],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${10 + Math.random() * 20}px currentColor`,
              animation: `
                quantumFloat ${3 + Math.random() * 4}s ease-in-out infinite,
                quantumGlow ${2 + Math.random() * 2}s ease-in-out infinite alternate
              `,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}

        {/* Interconnected Quantum Lines */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`line-${i}`}
            className="absolute bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
            style={{
              width: `${100 + Math.random() * 200}px`,
              height: "1px",
              top: `${20 + Math.random() * 60}%`,
              left: `${Math.random() * 70}%`,
              transform: `rotate(${Math.random() * 45}deg)`,
              animation: `quantumPulse ${4 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
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

      {/* Visual Effects Component */}
      <VisualEffectsComponent />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className="text-6xl animate-bounce">⚔️</div>
              <div className="relative">
                {/* Holographic Energy Field Background */}
                <div className="absolute inset-0 -m-8">
                  {/* Rotating Energy Rings */}
                  <div
                    className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-blue-400/30 rounded-full"
                    style={{
                      transform: "translate(-50%, -50%)",
                      animation: "spin 8s linear infinite",
                    }}
                  ></div>
                  <div
                    className="absolute top-1/2 left-1/2 w-40 h-40 border border-purple-400/20 rounded-full"
                    style={{
                      transform: "translate(-50%, -50%)",
                      animation: "spin 12s linear infinite reverse",
                    }}
                  ></div>
                  <div
                    className="absolute top-1/2 left-1/2 w-48 h-48 border border-violet-400/15 rounded-full"
                    style={{
                      transform: "translate(-50%, -50%)",
                      animation: "spin 16s linear infinite",
                    }}
                  ></div>

                  {/* Holographic Scanning Lines */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
                    style={{
                      animation: "hologramScan 4s ease-in-out infinite",
                    }}
                  ></div>
                </div>

                {/* Background glow effect - Reduced */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 blur-3xl opacity-20 animate-pulse scale-150"></div>

                {/* Animated gradient background - Reduced */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-violet-500 blur-2xl opacity-15 animate-ping"></div>

                {/* Hexagonal Tech Pattern Overlay - Hidden */}
                <div className="absolute inset-0 opacity-0">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
                        radial-gradient(circle at 75% 75%, #8b5cf6 0.5px, transparent 0.5px),
                        radial-gradient(circle at 50% 50%, #06b6d4 0.5px, transparent 0.5px)
                      `,
                      backgroundSize: "60px 60px, 40px 40px, 80px 80px",
                      animation: "techPattern 8s ease-in-out infinite",
                    }}
                  ></div>
                </div>

                {/* Main animated title */}
                <h1 className="relative text-7xl font-bold leading-tight">
                  {/* Glitch Effect Shadow */}
                  <span
                    className="absolute inset-0 text-red-500 opacity-30"
                    style={{
                      animation:
                        "glitchRed 0.3s infinite linear alternate-reverse",
                      textShadow: "2px 0 #ff0000",
                    }}
                  >
                    SAO
                  </span>
                  <span
                    className="absolute inset-0 text-cyan-400 opacity-30"
                    style={{
                      animation: "glitchBlue 0.3s infinite linear alternate",
                      textShadow: "-2px 0 #00ffff",
                    }}
                  >
                    SAO
                  </span>

                  {/* Animated gradient text with multiple effects */}
                  <span
                    className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 bg-clip-text text-transparent inline-block"
                    style={{
                      backgroundSize: "300% 300%",
                      animation:
                        "gradientShift 3s ease-in-out infinite, textGlow 2s ease-in-out infinite alternate, float 4s ease-in-out infinite, letterSpacing 3s ease-in-out infinite",
                    }}
                  >
                    SAO
                  </span>

                  {/* Enhanced Sparkle effects with more variety */}
                  <div className="absolute -top-4 -right-4 text-yellow-400 animate-ping text-2xl">
                    ✨
                  </div>
                  <div className="absolute -bottom-4 -left-4 text-blue-400 animate-ping delay-500 text-xl">
                    ⭐
                  </div>
                  <div className="absolute top-1/2 -right-6 text-purple-400 animate-bounce delay-1000 text-lg">
                    ���
                  </div>
                  <div className="absolute top-0 left-0 text-cyan-400 animate-pulse delay-200 text-sm">
                    🌟
                  </div>
                  <div className="absolute bottom-0 right-0 text-violet-400 animate-bounce delay-800 text-sm">
                    ⚡
                  </div>

                  {/* Floating Energy Orbs */}
                  <div
                    className="absolute top-1/4 -left-8 w-3 h-3 bg-blue-400 rounded-full opacity-70"
                    style={{
                      animation: "energyOrb 4s ease-in-out infinite",
                      boxShadow: "0 0 20px #3b82f6",
                    }}
                  ></div>
                  <div
                    className="absolute bottom-1/4 -right-8 w-2 h-2 bg-purple-400 rounded-full opacity-60"
                    style={{
                      animation: "energyOrb 3s ease-in-out infinite reverse",
                      animationDelay: "1s",
                      boxShadow: "0 0 15px #8b5cf6",
                    }}
                  ></div>
                </h1>

                {/* Enhanced Animated underline with pulse effect */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                  <div
                    className="absolute top-0 left-0 w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"
                    style={{
                      animation: "scanLine 2s ease-in-out infinite",
                    }}
                  ></div>
                </div>

                {/* Data Stream Effect */}
                <div className="absolute -top-8 -bottom-8 -left-12 -right-12 pointer-events-none">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute text-xs text-blue-400/40 font-mono"
                      style={{
                        left: `${i * 12 + 5}%`,
                        animation: `dataStream ${3 + i * 0.5}s linear infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    >
                      {["01", "10", "11", "01", "00", "10"][i % 6]}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-6xl animate-bounce delay-300">⚔️</div>
            </div>

            <h2 className="text-4xl font-bold mb-6 text-white relative">
              {/* Holographic scan effect for subtitle */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -skew-x-12"
                style={{
                  animation: "hologramScan 6s ease-in-out infinite",
                  animationDelay: "2s",
                }}
              ></div>

              {/* Main subtitle text */}
              <span
                className="relative bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
                style={{
                  backgroundSize: "200% 200%",
                  animation:
                    "gradientShift 5s ease-in-out infinite, textGlow 3s ease-in-out infinite alternate",
                }}
              >
                الطبعة العربية الكاملة
              </span>

              {/* Glitch shadow effect for subtitle */}
              <div
                className="absolute inset-0 text-white opacity-20 animate-pulse"
                style={{
                  animation:
                    "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, glitchRed 0.1s infinite linear alternate-reverse",
                }}
              >
                الطبعة العربية الكاملة
              </div>

              {/* Tech accent lines */}
              <div className="absolute -left-4 top-1/2 w-2 h-0.5 bg-blue-400 opacity-60 animate-pulse"></div>
              <div className="absolute -right-4 top-1/2 w-2 h-0.5 bg-purple-400 opacity-60 animate-pulse delay-300"></div>

              {/* Floating tech particles around subtitle */}
              <div
                className="absolute -top-2 left-1/4 w-1 h-1 bg-cyan-400 rounded-full opacity-70"
                style={{
                  animation: "energyOrb 5s ease-in-out infinite",
                  animationDelay: "1s",
                  boxShadow: "0 0 10px #06b6d4",
                }}
              ></div>
              <div
                className="absolute -bottom-2 right-1/4 w-1 h-1 bg-violet-400 rounded-full opacity-70"
                style={{
                  animation: "energyOrb 4s ease-in-out infinite reverse",
                  animationDelay: "2s",
                  boxShadow: "0 0 8px #8b5cf6",
                }}
              ></div>
            </h2>

            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed animate-pulse">
              أول منصة رسمية لقراءة Sword Art Online بالعربية
              <br />
              <span
                className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                style={{
                  backgroundSize: "200% 200%",
                  animation: "gradientShift 4s ease-in-out infinite",
                }}
              >
                ترجمة Mr.PheonixX Team × DeepL Premium
              </span>
            </p>

            <div className="flex justify-center space-x-6 mb-8">
              <InteractiveButton
                variant="energy"
                size="lg"
                onClick={() => navigate("/sao")}
              >
                <Zap className="w-5 h-5 mr-2" />
                استكشف السيرفرات
              </InteractiveButton>

              <InteractiveButton
                variant="crystal"
                size="lg"
                onClick={() => navigate("/progressive")}
              >
                <Download className="w-5 h-5 mr-2" />
                دخول للمكتبة
              </InteractiveButton>
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
              <p className="text-gray-400">��رجمة احترافية</p>
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
          <InteractiveCard className="bg-gradient-to-br from-blue-900/20 to-blue-600/20 border-blue-500/30 backdrop-blur-xl hover:border-blue-400/50 transition-all duration-500 group relative overflow-hidden">
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
                <span className="text-blue-400">
                  28 Volumes - Kirito's Perspective
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <p className="text-gray-300 mb-6 leading-relaxed">
                القصة الأصلية لكير��تو وأسونا في عالم ساو الافتراضي. مغامرة
                ملحمية تمتد عبر عوالم متعددة مع ترجمة دقيقة ومراجعة احترافية.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  28 مجلد
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300"
                >
                  <Users className="w-3 h-3 mr-1" />
                  كيريتو
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-300"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  مكتمل
                </Badge>
              </div>

              <InteractiveButton
                variant="magic"
                size="lg"
                onClick={() => navigate("/sao")}
                className="w-full group-hover:scale-105 transition-all duration-300 text-lg py-6"
              >
                <Play className="w-5 h-5 mr-2" />
                ابدأ القراءة الآن
              </InteractiveButton>
            </CardContent>
          </InteractiveCard>

          {/* SAO Progressive */}
          <InteractiveCard className="bg-gradient-to-br from-purple-900/20 to-violet-600/20 border-purple-500/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-500 group relative overflow-hidden">
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
                <span className="text-purple-400">
                  9 Volumes - Asuna's Detailed Perspective
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <p className="text-gray-300 mb-6 leading-relaxed">
                نفس أحداث ساو ولكن من منظور أسونا مع تفاصيل أعمق وقصص إضافية ��م
                تُروى من قبل. كل طابق يُحكى بتفاصيل مذهلة.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300"
                >
                  <BookOpen className="w-3 h-3 mr-1" />9 مجلدات
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-pink-500/20 text-pink-300"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  أسونا
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-orange-500/20 text-orange-300"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  مستمر
                </Badge>
              </div>

              <InteractiveButton
                variant="ice"
                size="lg"
                onClick={() => navigate("/progressive")}
                className="w-full group-hover:scale-105 transition-all duration-300 text-lg py-6"
              >
                <Play className="w-5 h-5 mr-2" />
                ابدأ القراءة الآن
              </InteractiveButton>
            </CardContent>
          </InteractiveCard>
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
                <p className="text-gray-400 mb-4">
                  رواية نفسية عميقة عن الانطوائية والمجتمع ��لياباني
                </p>
                <Button
                  variant="outline"
                  className="w-full border-gray-500 text-gray-300 hover:bg-gray-500/10"
                  onClick={() => navigate("/sideworks")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  استكشف
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
                <p className="text-gray-400 mb-4">
                  عمل أدبي كلاسيكي لدازاي أوسامو
                </p>
                <Button
                  variant="outline"
                  className="w-full border-gray-500 text-gray-300 hover:bg-gray-500/10"
                  onClick={() => navigate("/sideworks")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  استكشف
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive Experience Section */}
        <section className="mb-16 max-w-7xl mx-auto">
          <InteractiveExperience />
        </section>

        {/* Advanced Features Section */}
        <section className="mb-20 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold mb-6 relative">
              <span
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 bg-clip-text text-transparent"
                style={{
                  backgroundSize: "200% 200%",
                  animation: "gradientShift 4s ease-in-out infinite",
                }}
              >
                ✨ خصائص المنصة المتقدمة ✨
              </span>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-bounce">
                ⭐
              </div>
              <div className="absolute -top-6 right-1/4 text-blue-400 animate-ping">
                💫
              </div>
              <div className="absolute -top-3 left-1/4 text-purple-400 animate-pulse">
                ✨
              </div>
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              تجربة فريدة في عالم ساو أونلاين مع أحدث التقنيات وأفضل الخدمات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Reading Modes */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-green-900/20 to-emerald-600/20 border-green-500/30 hover:border-green-400/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-green-400 text-xl">
                  تحويل لغة فوري
                </CardTitle>
                <CardDescription className="text-gray-300">
                  أسرع الخوارزميات للترجمة الفورية
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Security Protection */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-violet-600/20 border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center animate-pulse">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-purple-400 text-xl">
                  حماية مطلقة
                </CardTitle>
                <CardDescription className="text-gray-300">
                  منع ال��سخ و القراءة الآمنة 100%
                </CardDescription>
              </CardHeader>
            </Card>

            {/* 3D Flipbook */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-900/20 to-cyan-600/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-blue-400 text-xl">
                  قراءة ثلاثية الأبعاد
                </CardTitle>
                <CardDescription className="text-gray-300">
                  3D Flipbook، Slide، و Scroll
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Arabic TTS */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-orange-900/20 to-amber-600/20 border-orange-500/30 hover:border-orange-400/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center animate-pulse">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-orange-400 text-xl">
                  مجموع نطقي
                </CardTitle>
                <CardDescription className="text-gray-300">
                  قراءة الأصوات العربية بتق��يات متطورة
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Premium Translation */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-red-900/20 to-rose-600/20 border-red-500/30 hover:border-red-400/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center animate-pulse">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-red-400 text-xl">
                  ترجمة مصرية
                </CardTitle>
                <CardDescription className="text-gray-300">
                  MrPheonixX Team × DeepL Premium
                </CardDescription>
              </CardHeader>
            </Card>

            {/* PWA Support */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-teal-900/20 to-cyan-600/20 border-teal-500/30 hover:border-teal-400/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-teal-400 text-xl">
                  تطبيق كامل
                </CardTitle>
                <CardDescription className="text-gray-300">
                  PWA + قراءة بدون إنترنت
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Feature Series Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-12">
            {/* Available Series */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400 text-center flex items-center justify-center gap-3">
                  <BookOpen className="w-6 h-6 animate-bounce" />
                  السلاسل المتاحة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <span className="text-blue-300">Sword Art Online</span>
                  <Badge className="bg-blue-500 text-white">26 مجلد</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <span className="text-purple-300">SAO Progressive</span>
                  <Badge className="bg-purple-500 text-white">8 مجلدات</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
                  <span className="text-gray-300">No Longer Human</span>
                  <Badge className="bg-gray-500 text-white">مجلد واحد</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-400 text-center flex items-center justify-center gap-3">
                  <TrendingUp className="w-6 h-6 animate-bounce" />
                  إحصائيات في الوقت الفعلي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2 animate-pulse">
                    {stats.readers.toLocaleString()}+
                  </div>
                  <p className="text-gray-300">قارئ نشط</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2 animate-pulse">
                    100,000+
                  </div>
                  <p className="text-gray-300">صفحة مترجمة</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2 animate-pulse">
                    99.9%
                  </div>
                  <p className="text-gray-300">دقة الترجمة</p>
                </div>
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
              Translated and proofread using DeepL Premium with manual
              supervision
              <br />
              <span className="text-blue-400">
                Built with ❤️ for the Arabic SAO Community
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
