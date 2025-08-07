import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sword, BookOpen, Users, Star, Shield, Play, ExternalLink } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("sao-theme") || "dark";
    setCurrentTheme(savedTheme);
    document.documentElement.className = savedTheme;

    // Welcome animation
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const changeTheme = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem("sao-theme", theme);
    document.documentElement.className = theme;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-violet-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
      </div>

      {/* Welcome Loading Screen */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <Sword className="w-16 h-16 mx-auto text-blue-400 animate-pulse" />
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"></div>
            </div>
            <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              MrPheonixX Team
            </h1>
            <p className="text-xl mt-2 text-gray-300">Loading Aincrad...</p>
            <div className="w-48 h-1 bg-gray-700 rounded-full mx-auto mt-4">
              <div className="h-full bg-gradient-to-r from-blue-400 to-violet-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-blue-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sword className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  MrPheonixX Team
                </h1>
                <p className="text-sm text-gray-400">Sword Art Online Arabic Edition</p>
              </div>
            </div>
            
            {/* Theme Switcher */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeTheme("light")}
                className={`w-6 h-6 rounded-full border-2 ${currentTheme === "light" ? "border-blue-400" : "border-gray-600"} bg-white`}
              ></button>
              <button
                onClick={() => changeTheme("dark")}
                className={`w-6 h-6 rounded-full border-2 ${currentTheme === "dark" ? "border-blue-400" : "border-gray-600"} bg-gray-900`}
              ></button>
              <button
                onClick={() => changeTheme("sepia")}
                className={`w-6 h-6 rounded-full border-2 ${currentTheme === "sepia" ? "border-blue-400" : "border-gray-600"} bg-amber-100`}
              ></button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Sword Art Online
            </h1>
            <h2 className="text-4xl font-bold mb-4 text-blue-300">
              SAO Progressive - Full Arabic Edition
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              النسخة العربية الحصرية والكاملة من سيف آرت أونلاين وساو بروجرسيف
              <br />
              مترجمة ومراجعة بواسطة فريق MrPheonixX ب��ستخدام DeepL Premium
            </p>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              🔥 حصري - Exclusive Content
            </Badge>
          </div>
        </section>

        {/* Main Books Section */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Sword Art Online */}
          <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400 flex items-center gap-3">
                <Sword className="w-6 h-6" />
                Sword Art Online
              </CardTitle>
              <CardDescription className="text-gray-300">
                28 مجلد - منظور كيريتو الأساسي
                <br />
                28 Volumes - Kirito's Perspective
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                القصة الأصلية لكيريتو وأسونا في عالم ساو الافتراضي. مغامرة ملحمية تمتد عبر عوالم متعددة.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">28 Volumes</Badge>
                <Badge variant="secondary">كيريتو</Badge>
                <Badge variant="secondary">مكتمل</Badge>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 group-hover:scale-105 transition-all"
                onClick={() => navigate("/sao")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                ابدأ القراءة - Start Reading
              </Button>
            </CardContent>
          </Card>

          {/* SAO Progressive */}
          <Card className="bg-black/40 border-violet-500/30 backdrop-blur-sm hover:border-violet-400/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="text-2xl text-violet-400 flex items-center gap-3">
                <Star className="w-6 h-6" />
                SAO Progressive
              </CardTitle>
              <CardDescription className="text-gray-300">
                9 مجلدات - منظور أسونا المفصل
                <br />
                9 Volumes - Asuna's Detailed Perspective
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                نفس أحداث ساو ولكن من منظور أسونا مع تفاصيل أعمق وقصص إضافية لم تُروى من قبل.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">9 Volumes</Badge>
                <Badge variant="secondary">أسونا</Badge>
                <Badge variant="secondary">مستمر</Badge>
              </div>
              <Button className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 group-hover:scale-105 transition-all">
                <BookOpen className="w-4 h-4 mr-2" />
                ابدأ القراءة - Start Reading
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Side Works */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-blue-300">أعمال إضافية - Side Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/30 border-gray-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-300">Welcome to the NHK</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">رواية نفسية عميقة عن الانطوائية والمجتمع الياباني</p>
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  قراءة
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-gray-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-300">No Longer Human</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">عمل أدبي كلاسيكي لدازاي أوسامو</p>
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  قراءة
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Links */}
        <section className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-blue-300">تابعنا - Follow Us</h3>
          <div className="flex justify-center space-x-6">
            <Button 
              variant="outline" 
              className="border-red-500 text-red-400 hover:bg-red-500/10"
              onClick={() => window.open("https://bit.ly/452l2pB", "_blank")}
            >
              <Play className="w-4 h-4 mr-2" />
              YouTube
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              onClick={() => window.open("https://bit.ly/4mvCWHb", "_blank")}
            >
              <Users className="w-4 h-4 mr-2" />
              Discord
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
              onClick={() => window.open("https://bit.ly/MrPheonixX", "_blank")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Patreon
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-black/20 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400">
            © 2024 MrPheonixX Team - All Rights Reserved
            <br />
            المحتوى حصري لفريق MrPheonixX - يُمنع إعادة الإنتاج غير المصرح به
            <br />
            Translated and proofread using DeepL Premium with manual supervision
          </p>
        </div>
      </footer>
    </div>
  );
}
