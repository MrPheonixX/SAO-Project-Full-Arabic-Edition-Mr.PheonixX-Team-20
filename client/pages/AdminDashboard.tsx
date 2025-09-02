import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSecurityContext } from "@/components/SecurityProvider";
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
  Shield,
  Users,
  BookOpen,
  Upload,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Edit,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Lock,
  Unlock,
  Globe,
  Image,
  FileText,
  Database,
  Activity,
  UserCheck,
  UserX,
  ArrowLeft,
  Save,
} from "lucide-react";
// Security functions will be added later
// import { disableSecurity, enableSecurity } from "@/lib/security";

interface VolumeData {
  id: string;
  title: string;
  titleArabic: string;
  series: "sao" | "progressive" | "sidework";
  pages: number;
  status: "draft" | "published" | "hidden";
  uploadDate: string;
  views: number;
  rating: number;
  fileSize: string;
}

interface UserStat {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  lastActive: string;
  pagesRead: number;
  status: "active" | "inactive" | "banned";
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const security = useSecurityContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);

  // Mock data
  const [volumes, setVolumes] = useState<VolumeData[]>([
    {
      id: "sao_1",
      title: "SAO Volume 1",
      titleArabic: "ساو المجلد 1",
      series: "sao",
      pages: 250,
      status: "published",
      uploadDate: "2024-01-15",
      views: 1250,
      rating: 4.8,
      fileSize: "15.2 MB",
    },
    {
      id: "prog_1",
      title: "SAO Progressive Volume 1",
      titleArabic: "ساو بروجرسيف المجلد 1",
      series: "progressive",
      pages: 280,
      status: "published",
      uploadDate: "2024-01-20",
      views: 980,
      rating: 4.9,
      fileSize: "18.5 MB",
    },
    {
      id: "nhk_1",
      title: "Welcome to the NHK",
      titleArabic: "مرحباً بكم في NHK",
      series: "sidework",
      pages: 320,
      status: "draft",
      uploadDate: "2024-02-01",
      views: 0,
      rating: 0,
      fileSize: "22.1 MB",
    },
  ]);

  const [users, setUsers] = useState<UserStat[]>([
    {
      id: "1",
      username: "SAOFan2024",
      email: "user1@example.com",
      joinDate: "2024-01-15",
      lastActive: "2024-03-10",
      pagesRead: 1250,
      status: "active",
    },
    {
      id: "2",
      username: "AsunaLover",
      email: "user2@example.com",
      joinDate: "2024-02-01",
      lastActive: "2024-03-09",
      pagesRead: 850,
      status: "active",
    },
  ]);

  const handleAdminLogin = () => {
    if (adminPassword === "332004696") {
      setIsAuthenticated(true);
      // disableSecurity("MrPheonixX-Admin-2024");
    } else {
      alert("كلمة مرور خاطئة");
    }
  };

  const toggleSecurity = () => {
    // Toggle the actual security system
    security.toggleSecurity(!security.isSecurityActive);
  };

  const handleVolumeStatusChange = (
    volumeId: string,
    newStatus: "draft" | "published" | "hidden",
  ) => {
    setVolumes((prev) =>
      prev.map((vol) =>
        vol.id === volumeId ? { ...vol, status: newStatus } : vol,
      ),
    );
  };

  const handleUserStatusChange = (
    userId: string,
    newStatus: "active" | "inactive" | "banned",
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
      case "active":
        return "text-green-400 bg-green-500/20 border-green-500/50";
      case "draft":
      case "inactive":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
      case "hidden":
      case "banned":
        return "text-red-400 bg-red-500/20 border-red-500/50";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50";
    }
  };

  const stats = {
    totalVolumes: volumes.length,
    publishedVolumes: volumes.filter((v) => v.status === "published").length,
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    totalViews: volumes.reduce((sum, vol) => sum + vol.views, 0),
    averageRating:
      volumes
        .filter((v) => v.rating > 0)
        .reduce((sum, vol) => sum + vol.rating, 0) /
      volumes.filter((v) => v.rating > 0).length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 text-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/40 border-red-500/30 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-400">
              لوحة تحكم المدير
            </CardTitle>
            <CardDescription className="text-gray-300">
              🔐 منطقة محظورة - Admin Only
              <br />
              <span className="text-sm text-blue-400">
                Username: AhmedRehab3324@gmail.com
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  كلمة مرور المدير
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/40 border border-red-500/30 rounded-md text-white placeholder-gray-400 focus:border-red-400 focus:outline-none"
                    placeholder="Enter admin password"
                    onKeyPress={(e) => e.key === "Enter" && handleAdminLogin()}
                  />
                </div>
              </div>
              <Button
                onClick={handleAdminLogin}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
              >
                <Shield className="w-4 h-4 mr-2" />
                دخول لوحة التحكم
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full border-gray-500 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-purple-400">
                  لوحة تحكم المدير
                </h1>
                <p className="text-sm text-gray-400">
                  MrPheonixX Team Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSecurity}
                className={
                  security.isSecurityActive
                    ? "border-red-500 text-red-400"
                    : "border-green-500 text-green-400"
                }
              >
                {security.isSecurityActive ? (
                  <Lock className="w-4 h-4 mr-2" />
                ) : (
                  <Unlock className="w-4 h-4 mr-2" />
                )}
                {security.isSecurityActive ? "تعطيل الحماية" : "تفعيل الحماية"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="border-gray-500 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للموقع
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-black/30 p-2 rounded-lg">
            {[
              { id: "overview", label: "نظرة عامة", icon: BarChart3 },
              { id: "volumes", label: "إدارة المجلدات", icon: BookOpen },
              { id: "users", label: "إدارة المستخدمين", icon: Users },
              { id: "analytics", label: "التحليلات", icon: Activity },
              { id: "settings", label: "الإعدادات", icon: Settings },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-blue-300">
                    {stats.totalVolumes}
                  </h3>
                  <p className="text-gray-300">إجمالي ��لمجلدات</p>
                  <Badge className="mt-2 bg-blue-500/20">
                    {stats.publishedVolumes} منشور
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-purple-300">
                    {stats.totalUsers}
                  </h3>
                  <p className="text-gray-300">إجمالي المستخدمين</p>
                  <Badge className="mt-2 bg-purple-500/20">
                    {stats.activeUsers} نشط
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <Eye className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-green-300">
                    {stats.totalViews.toLocaleString()}
                  </h3>
                  <p className="text-gray-300">إجمالي المشاهدات</p>
                  <Badge className="mt-2 bg-green-500/20">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-500/30">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-yellow-300">
                    {stats.averageRating.toFixed(1)}
                  </h3>
                  <p className="text-gray-300">متوسط التقييم</p>
                  <Badge className="mt-2 bg-yellow-500/20">ممتاز</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-purple-400">النشاط الأخير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white">تم نشر مجلد ساو بروجرسيف 2</p>
                      <p className="text-sm text-gray-400">منذ ساعتين</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white">انضم 5 مستخدمين جدد</p>
                      <p className="text-sm text-gray-400">اليوم</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white">تحديث نظام الحماية</p>
                      <p className="text-sm text-gray-400">أمس</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Volumes Management Tab */}
        {activeTab === "volumes" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-purple-400">
                إدارة المجلدات
              </h2>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                رفع مجلد جديد
              </Button>
            </div>

            <div className="grid gap-4">
              {volumes.map((volume) => (
                <Card
                  key={volume.id}
                  className="bg-black/40 border-purple-500/30 backdrop-blur-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-white">
                            {volume.titleArabic}
                          </h3>
                          <Badge className={getStatusColor(volume.status)}>
                            {volume.status === "published"
                              ? "منشور"
                              : volume.status === "draft"
                                ? "مسودة"
                                : "مخفي"}
                          </Badge>
                        </div>

                        <p className="text-gray-400 mb-2">{volume.title}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{volume.pages} صفحة</span>
                          <span>{volume.fileSize}</span>
                          <span>{volume.views} مشاهدة</span>
                          <span>{volume.rating || "لا يوجد"}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={volume.status}
                          onChange={(e) =>
                            handleVolumeStatusChange(
                              volume.id,
                              e.target.value as any,
                            )
                          }
                          className="px-3 py-1 bg-black/40 border border-gray-500/30 rounded text-white text-sm"
                        >
                          <option value="draft">مسودة</option>
                          <option value="published">منشور</option>
                          <option value="hidden">مخفي</option>
                        </select>

                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400">
              إدارة المستخدمين
            </h2>

            <div className="grid gap-4">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="bg-black/40 border-purple-500/30 backdrop-blur-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-white">
                            {user.username}
                          </h3>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status === "active"
                              ? "نشط"
                              : user.status === "inactive"
                                ? "غير نشط"
                                : "محظور"}
                          </Badge>
                        </div>

                        <p className="text-gray-400 mb-2">{user.email}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>
                            انضم:{" "}
                            {new Date(user.joinDate).toLocaleDateString(
                              "ar-SA",
                            )}
                          </span>
                          <span>
                            آخر نشاط:{" "}
                            {new Date(user.lastActive).toLocaleDateString(
                              "ar-SA",
                            )}
                          </span>
                          <span>{user.pagesRead} صفحة مقروءة</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={user.status}
                          onChange={(e) =>
                            handleUserStatusChange(
                              user.id,
                              e.target.value as any,
                            )
                          }
                          className="px-3 py-1 bg-black/40 border border-gray-500/30 rounded text-white text-sm"
                        >
                          <option value="active">نشط</option>
                          <option value="inactive">غير نشط</option>
                          <option value="banned">محظور</option>
                        </select>

                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400">
              تحليلات الموقع
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-purple-400">
                    أكثر المجلدات مشاهدة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {volumes
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((vol, index) => (
                        <div
                          key={vol.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant="outline"
                              className="w-6 h-6 rounded-full p-0 flex items-center justify-center"
                            >
                              {index + 1}
                            </Badge>
                            <span className="text-white">
                              {vol.titleArabic}
                            </span>
                          </div>
                          <span className="text-gray-400">{vol.views}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-purple-400">
                    إحصائيات شهرية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">مستخدمين جدد</span>
                      <span className="text-green-400">+15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">مجلدات منشورة</span>
                      <span className="text-blue-400">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">إجمالي المشاهدات</span>
                      <span className="text-purple-400">2,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">معدل التفاعل</span>
                      <span className="text-yellow-400">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400">
              إعدادات النظام
            </h2>

            <div className="grid gap-6">
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-purple-400">
                    إعدادات الحماية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">نظام الحماية المتقدم</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleSecurity}
                      className={
                        security.isSecurityActive
                          ? "border-red-500 text-red-400"
                          : "border-green-500 text-green-400"
                      }
                    >
                      {security.isSecurityActive ? "مفعل" : "معطل"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white">كشف مانع الإعلانات</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-400"
                    >
                      مفعل
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white">حماية ضد النسخ</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-400"
                    >
                      مفعل
                    </Button>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-white font-medium mb-3">
                      🎭 تحكم الأنمي ايموجي
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.dispatchEvent(
                            new CustomEvent("trigger-anime-emoji"),
                          )
                        }
                        className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                      >
                        ✨ ايموجي طائر
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.dispatchEvent(
                            new CustomEvent("trigger-random-anime"),
                          )
                        }
                        className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                      >
                        🎌 إشعار عشوائي
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.dispatchEvent(
                            new CustomEvent("trigger-adblock-anime"),
                          )
                        }
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        😢 تحذير مانع الإعلانات
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.dispatchEvent(
                            new CustomEvent("trigger-devtools-anime"),
                          )
                        }
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        ⚠️ تحذير أدوات المطور
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-purple-400">
                    إعدادات الموقع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      اسم الموقع
                    </label>
                    <input
                      type="text"
                      defaultValue="MrPheonixX Team - SAO Arabic Edition"
                      className="w-full px-3 py-2 bg-black/40 border border-gray-500/30 rounded-md text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      وصف الموقع
                    </label>
                    <textarea
                      defaultValue="منصة قراءة ساو العربية الحصرية"
                      rows={3}
                      className="w-full px-3 py-2 bg-black/40 border border-gray-500/30 rounded-md text-white"
                    />
                  </div>

                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <Save className="w-4 h-4 mr-2" />
                    حفظ الإعدادات
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
