import React, { useEffect, useRef } from "react";

// منع النسخ والتحميل والتصوير
const AntiCopyProtection: React.FC = () => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // التحقق من وضع المطور
    const isDeveloperMode = () => {
      return (
        (window as any).__DEVELOPER_MODE__ ||
        (window as any).__SECURITY_BYPASS__ ||
        localStorage.getItem("developer_mode") === "true" ||
        localStorage.getItem("legitimate_developer") === "true" ||
        process.env.NODE_ENV === "development" ||
        window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("builder.io") ||
        window.location.hostname.includes("127.0.0.1") ||
        window.location.search.includes("dev=true")
      );
    };

    // إذا كان وضع المطور نشط، لا نطبق حماية النسخ
    if (isDeveloperMode()) {
      console.log(
        "🔧 Developer mode active - Anti-copy protection disabled for development",
      );
      return;
    }

    // منع النقر الأيمن (للمستخدمين العاديين فقط)
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // منع لوحة المفاتيح للمطورين
    const preventDevTools = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && (e.key === "u" || e.key === "U")) ||
        (e.ctrlKey && (e.key === "s" || e.key === "S")) ||
        (e.ctrlKey && (e.key === "a" || e.key === "A")) ||
        (e.ctrlKey && (e.key === "c" || e.key === "C")) ||
        (e.ctrlKey && (e.key === "v" || e.key === "V")) ||
        (e.ctrlKey && (e.key === "x" || e.key === "X")) ||
        (e.ctrlKey && (e.key === "p" || e.key === "P")) ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // منع السحب والإفلات
    const preventDragDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // منع التحديد
    const preventSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // منع النسخ من القائمة السياقية
    const preventContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // كشف محاولة فتح أدوات المطور
    const detectDevTools = () => {
      const threshold = 160;

      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        // إعادة توجيه أو إخفاء المحتوى
        document.body.style.display = "none";
        alert("تم اكتشاف محاولة غير مسموحة للوصول إلى المحتوى");
        window.location.href = "about:blank";
      }
    };

    // كشف التقاط الشاشة
    const detectScreenshot = () => {
      // كشف الضغط على Print Screen
      document.addEventListener("keydown", (e) => {
        if (e.key === "PrintScreen") {
          e.preventDefault();
          alert("التقاط الشاشة غير مسموح");
        }
      });

      // كشف فقدان التركيز (قد يشير لفتح أدوات التقاط)
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          // المستخدم غادر النافذة - قد يكون يستخدم أداة تقاط
          setTimeout(() => {
            if (!document.hidden) {
              // عاد للنافذة
              alert("تم اكتشاف نشاط مشبوه");
            }
          }, 1000);
        }
      });
    };

    // إضافة طبقة حماية شفافة
    const createProtectionOverlay = () => {
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        pointer-events: none;
        background: transparent;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      `;
      document.body.appendChild(overlay);

      // منع النقر الأيمن على الطبقة
      overlay.addEventListener("contextmenu", preventContextMenu);

      return overlay;
    };

    // إضافة CSS لمنع التحديد والسحب
    const addProtectionCSS = () => {
      const style = document.createElement("style");
      style.textContent = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
          -khtml-user-drag: none !important;
          -moz-user-drag: none !important;
          -o-user-drag: none !important;
          user-drag: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        img, video, canvas, svg {
          pointer-events: none !important;
          -webkit-user-drag: none !important;
          user-drag: none !important;
        }
        
        /* منع طباعة الصفحة */
        @media print {
          * { display: none !important; }
        }
        
        /* إخفاء المحتوى عند محاولة طباعة أو تصوير */
        @media screen and (max-device-width: 0px) {
          * { display: none !important; }
        }
      `;
      document.head.appendChild(style);
    };

    // منع التصوير عبر الهاتف أو الكاميرا الخارجية
    const preventExternalCapture = () => {
      // إضافة علامة مائية متحركة
      const watermark = document.createElement("div");
      watermark.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 6rem;
        color: rgba(255, 255, 255, 0.1);
        z-index: 999998;
        pointer-events: none;
        user-select: none;
        font-weight: bold;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        animation: float 6s ease-in-out infinite;
      `;
      watermark.textContent = "MrPheonixX © محمي";

      // إضافة CSS للحركة
      const animationStyle = document.createElement("style");
      animationStyle.textContent = `
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) rotate(-45deg) scale(1); }
          50% { transform: translate(-50%, -50%) rotate(-45deg) scale(1.1); }
        }
      `;
      document.head.appendChild(animationStyle);
      document.body.appendChild(watermark);
    };

    // كشف أدوات الشبكة والتطو��ر
    const detectNetworkTools = () => {
      // كشف فتح نافذة جديدة لعرض المصدر
      const originalOpen = window.open;
      window.open = function (...args) {
        alert("فتح النوافذ الجديدة غير مسموح");
        return null;
      };

      // منع طباعة الصفحة
      window.addEventListener("beforeprint", (e) => {
        e.preventDefault();
        alert("طباعة الصفحة غير مسموحة");
        return false;
      });

      // منع حفظ الصفحة
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "s") {
          e.preventDefault();
          alert("حفظ الصفحة غير مسموح");
        }
      });
    };

    // تطبيق جميع الحمايات
    addProtectionCSS();
    createProtectionOverlay();
    preventExternalCapture();
    detectScreenshot();
    detectNetworkTools();

    // ��ضافة المستمعين
    document.addEventListener("contextmenu", preventRightClick);
    document.addEventListener("keydown", preventDevTools);
    document.addEventListener("selectstart", preventSelection);
    document.addEventListener("dragstart", preventDragDrop);
    document.addEventListener("drop", preventDragDrop);

    // كشف أدوات المطور كل ثانية
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // إزالة المستمعين عند إلغاء التحميل
    return () => {
      document.removeEventListener("contextmenu", preventRightClick);
      document.removeEventListener("keydown", preventDevTools);
      document.removeEventListener("selectstart", preventSelection);
      document.removeEventListener("dragstart", preventDragDrop);
      document.removeEventListener("drop", preventDragDrop);
      clearInterval(devToolsInterval);
    };
  }, []);

  return (
    <div ref={overlayRef} className="pointer-events-none">
      {/* طبقة حماية إضافية */}
      <div className="fixed inset-0 pointer-events-none select-none z-50">
        <div className="absolute inset-0 bg-transparent" />
      </div>
    </div>
  );
};

export default AntiCopyProtection;
