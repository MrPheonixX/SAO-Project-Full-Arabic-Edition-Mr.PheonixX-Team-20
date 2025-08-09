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
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sword,
  Star,
  Crown,
  ArrowLeft,
  Shield,
  BookOpen,
  Award,
  Zap,
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

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data for demo
  const mockUser: UserProfile = {
    id: "user123",
    username: "SAOFan2024",
    email: "user@example.com",
    level: 15,
    xp: 2450,
    joinDate: "2024-01-15",
    avatar: "⚔️",
    badge: "Knight of Aincrad",
    readingStreak: 7,
    totalPagesRead: 1250,
    favoriteCharacter: "Asuna",
    readingPreferences: {
      theme: "dark",
      fontSize: 16,
      readingMode: "scroll",
    },
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "اسم المستخدم مطلوب";
    } else if (formData.username.length < 3) {
      newErrors.username = "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
    }

    if (!isLogin && !formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock successful login/register
    localStorage.setItem("user-profile", JSON.stringify(mockUser));
    localStorage.setItem("auth-token", "mock-jwt-token");

    setIsLoading(false);
    navigate("/profile");
  };

  const handleGuestLogin = () => {
    const guestUser = {
      ...mockUser,
      username: "ضيف_" + Math.floor(Math.random() * 1000),
      level: 1,
      xp: 0,
      badge: "Guest Reader",
      readingStreak: 0,
      totalPagesRead: 0,
    };

    localStorage.setItem("user-profile", JSON.stringify(guestUser));
    localStorage.setItem("auth-token", "guest-token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating particles */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

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

            <div className="flex items-center space-x-3">
              <Sword className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold text-blue-400">
                MrPheonixX Team
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-md relative z-10">
          {/* Login/Register Card */}
          <Card className="bg-black/40 border-blue-500/30 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>

              <CardTitle className="text-2xl text-blue-400">
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {isLogin
                  ? "ادخل إلى مكتبة ساو العربية الحصرية"
                  : "انضم إلى مجتمع قراء ساو العربي"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    اسم المستخدم
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-500/30 rounded-md text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                      placeholder="اختر اسم المستخدم"
                      dir="rtl"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email (Register only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-500/30 rounded-md text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                        placeholder="البريد الإلكتروني"
                        dir="ltr"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ��لمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="w-full pl-10 pr-10 py-2 bg-black/40 border border-gray-500/30 rounded-md text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                      placeholder="كلمة المرور"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password (Register only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-500/30 rounded-md text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                        placeholder="تأكيد كلمة المرور"
                        dir="ltr"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 text-lg font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>جاري المعالجة...</span>
                    </div>
                  ) : isLogin ? (
                    "تسجيل الدخول"
                  ) : (
                    "إنشاء الحساب"
                  )}
                </Button>

                {/* Switch between Login/Register */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {isLogin
                      ? "ليس لديك حساب؟ أنشئ حساباً جديداً"
                      : "لديك حساب بالفعل؟ سجل دخولك"}
                  </button>
                </div>

                {/* Guest Login */}
                <div className="border-t border-gray-600 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGuestLogin}
                    className="w-full border-gray-500 text-gray-300 hover:bg-gray-500/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    دخول كضيف
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Card className="bg-black/30 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-blue-300">
                  حماية متقدمة
                </h4>
                <p className="text-xs text-gray-400">محتوى محمي ومشفر</p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-purple-300">
                  مكتبة ضخمة
                </h4>
                <p className="text-xs text-gray-400">37+ مجلد مترجم</p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-green-500/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-green-300">
                  نظام إنجازات
                </h4>
                <p className="text-xs text-gray-400">اكسب نقاط ومكافآت</p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-yellow-500/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-yellow-300">
                  قراءة متقدمة
                </h4>
                <p className="text-xs text-gray-400">3 أنماط قراءة مختلفة</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
