import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Send, 
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Bookmark,
  Share2
} from "lucide-react";

interface RatingData {
  volumeId: string;
  userRating: number;
  averageRating: number;
  totalRatings: number;
  ratingDistribution: { [key: number]: number };
  userFeedback?: string;
  hasRated: boolean;
}

interface FeedbackItem {
  id: string;
  username: string;
  rating: number;
  comment: string;
  timestamp: string;
  likes: number;
  verified: boolean;
  spoilerWarning: boolean;
}

export default function RatingFeedback({ 
  volumeId, 
  volumeTitle, 
  onRatingSubmit 
}: { 
  volumeId: string; 
  volumeTitle: string; 
  onRatingSubmit?: (rating: number, feedback: string) => void;
}) {
  const [ratingData, setRatingData] = useState<RatingData>({
    volumeId,
    userRating: 0,
    averageRating: 4.7,
    totalRatings: 1250,
    ratingDistribution: { 5: 65, 4: 25, 3: 8, 2: 1, 1: 1 },
    hasRated: false
  });

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [feedbackFilter, setFeedbackFilter] = useState<"all" | "positive" | "negative">("all");
  const [showSpoilers, setShowSpoilers] = useState(false);

  // Mock feedback data
  useEffect(() => {
    setFeedbackList([
      {
        id: "1",
        username: "SAOFan2024",
        rating: 5,
        comment: "ترجمة رائعة! الحوارات طبيعية والأسلوب ممتاز. شكراً لفريق MrPheonixX على الجهد المبذول",
        timestamp: "2024-03-10",
        likes: 15,
        verified: true,
        spoilerWarning: false
      },
      {
        id: "2",
        username: "AsunaLover",
        rating: 5,
        comment: "أخيراً ترجمة عربية احترافية لساو! جودة الترجمة عالية جداً والتنسيق مثالي",
        timestamp: "2024-03-09",
        likes: 12,
        verified: false,
        spoilerWarning: false
      },
      {
        id: "3",
        username: "KiritoSwordsman",
        rating: 4,
        comment: "مجلد ممتاز! هناك بعض المصطلحات التقنية يمكن تحسينها ولكن بشكل عام العمل رائع",
        timestamp: "2024-03-08",
        likes: 8,
        verified: true,
        spoilerWarning: true
      }
    ]);

    // Load user's previous rating
    const savedRating = localStorage.getItem(`rating-${volumeId}`);
    if (savedRating) {
      const rating = JSON.parse(savedRating);
      setRatingData(prev => ({
        ...prev,
        userRating: rating.rating,
        hasRated: true
      }));
      setSelectedRating(rating.rating);
      setFeedback(rating.feedback || "");
    }
  }, [volumeId]);

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    if (!showFeedbackForm) {
      setShowFeedbackForm(true);
    }
  };

  const handleRatingSubmit = () => {
    if (selectedRating === 0) return;

    const ratingSubmission = {
      volumeId,
      rating: selectedRating,
      feedback: feedback.trim(),
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem(`rating-${volumeId}`, JSON.stringify(ratingSubmission));

    // Update state
    setRatingData(prev => ({
      ...prev,
      userRating: selectedRating,
      hasRated: true
    }));

    // Callback
    if (onRatingSubmit) {
      onRatingSubmit(selectedRating, feedback);
    }

    // Show success message
    alert(`شكراً لك! تم تسجيل تقييمك: ${selectedRating} نجوم`);
    setShowFeedbackForm(false);
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "ضعيف جداً 😞";
      case 2: return "ضعيف 😕";
      case 3: return "متوسط 😐";
      case 4: return "جيد 😊";
      case 5: return "ممتاز! 🤩";
      default: return "اختر تقييمك";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-400";
    if (rating >= 3.5) return "text-yellow-400";
    if (rating >= 2.5) return "text-orange-400";
    return "text-red-400";
  };

  const filteredFeedback = feedbackList.filter(item => {
    if (feedbackFilter === "positive") return item.rating >= 4;
    if (feedbackFilter === "negative") return item.rating <= 2;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card className="bg-black/40 border-blue-500/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-400">
            <Star className="w-6 h-6" />
            تقييم المجلد
          </CardTitle>
          <CardDescription>
            قيم هذا المجلد وساعد القراء الآخرين
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Average Rating Display */}
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getRatingColor(ratingData.averageRating)}`}>
                {ratingData.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mt-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(ratingData.averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {ratingData.totalRatings.toLocaleString()} تقييم
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 max-w-xs ml-8">
              {[5, 4, 3, 2, 1].map(stars => (
                <div key={stars} className="flex items-center gap-2 mb-1">
                  <span className="text-sm w-6">{stars}</span>
                  <Star className="w-3 h-3 text-yellow-400" />
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ratingData.ratingDistribution[stars]}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 w-8">
                    {ratingData.ratingDistribution[stars]}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Rating Section */}
          {!ratingData.hasRated ? (
            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-lg font-semibold text-blue-300 mb-4">
                ما رأيك في هذا المجلد؟
              </h4>
              
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleRatingSelect(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-all duration-200 hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        i < (hoverRating || selectedRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-blue-400 font-medium">
                  {getRatingText(hoverRating || selectedRating)}
                </span>
              </div>

              {/* Feedback Form */}
              {showFeedbackForm && (
                <div className="space-y-4 bg-gray-800/50 p-4 rounded-lg">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="شاركنا رأيك في الترجمة والمحتوى... (اختياري)"
                    className="w-full p-3 bg-black/40 border border-gray-500/30 rounded-md text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none resize-none"
                    rows={3}
                    dir="rtl"
                  />
                  
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleRatingSubmit}
                      disabled={selectedRating === 0}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      إرسال التقييم
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowFeedbackForm(false)}
                      className="border-gray-500 text-gray-300"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">
                    شكراً لك! لقد قيمت هذا المجلد بـ {ratingData.userRating} نجوم
                  </p>
                  {feedback && (
                    <p className="text-gray-300 text-sm mt-1">
                      تعليقك: "{feedback}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Community Feedback */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-purple-400">
              <MessageSquare className="w-6 h-6" />
              آراء المجتمع
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <select
                value={feedbackFilter}
                onChange={(e) => setFeedbackFilter(e.target.value as any)}
                className="px-3 py-1 bg-black/40 border border-gray-500/30 rounded text-white text-sm"
              >
                <option value="all">كل التقييمات</option>
                <option value="positive">إيجابية</option>
                <option value="negative">سلبية</option>
              </select>
            </div>
          </div>
          <CardDescription>
            اقرأ آراء القراء الآخرين حول هذا المجلد
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Spoiler Warning Toggle */}
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm flex-1">
              قد تحتوي التعليقات على حرق للأحداث
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSpoilers(!showSpoilers)}
              className="border-yellow-500 text-yellow-400 text-xs"
            >
              {showSpoilers ? "إخفاء" : "عرض"} المحتوى
            </Button>
          </div>

          {/* Feedback List */}
          {showSpoilers && (
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <Card key={item.id} className="bg-gray-800/50 border-gray-600/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {item.username[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{item.username}</span>
                            {item.verified && (
                              <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                موثق
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < item.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(item.timestamp).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-3 leading-relaxed" dir="rtl">
                      {item.comment}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                        <Heart className="w-4 h-4" />
                        إعجاب
                      </button>
                      
                      <button className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                        مشاركة
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredFeedback.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد تقييمات في هذه الفئة</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" className="border-blue-500 text-blue-400">
          <Bookmark className="w-4 h-4 mr-2" />
          حفظ المجلد
        </Button>
        
        <Button variant="outline" className="border-purple-500 text-purple-400">
          <Share2 className="w-4 h-4 mr-2" />
          مشاركة
        </Button>
        
        <Button variant="outline" className="border-green-500 text-green-400">
          <Award className="w-4 h-4 mr-2" />
          إضافة للمفضلة
        </Button>
      </div>
    </div>
  );
}

// Quick Rating Component for volume cards
export function QuickRating({ 
  volumeId, 
  currentRating = 0,
  onRate
}: { 
  volumeId: string; 
  currentRating?: number;
  onRate?: (rating: number) => void;
}) {
  const [rating, setRating] = useState(currentRating);
  const [hover, setHover] = useState(0);

  const handleRate = (newRating: number) => {
    setRating(newRating);
    localStorage.setItem(`quick-rating-${volumeId}`, newRating.toString());
    if (onRate) onRate(newRating);
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          onClick={() => handleRate(i + 1)}
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          className="transition-all duration-200"
        >
          <Star
            className={`w-4 h-4 ${
              i < (hover || rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-400"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
