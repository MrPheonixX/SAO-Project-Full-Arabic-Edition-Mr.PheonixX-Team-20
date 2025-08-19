import React, { useEffect } from "react";

const DevToolsBlocker: React.FC = () => {
  useEffect(() => {
    // وظيفة لكشف أدوات المطور
    const detectDevTools = () => {
      const devtools = {
        open: false,
        orientation: null,
      };

      // كشف الفرق في الحجم
      const threshold = 160;

      setInterval(() => {
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          if (!devtools.open) {
            devtools.open = true;
            // إخفاء المحتوى فوراً
            document.body.style.display = "none";
            alert("🚫 تم اكتشاف أدوات المطور\nالموقع محمي ضد السرقة");

            // إعادة توجيه لصفحة فارغة
            setTimeout(() => {
              window.location.href = "about:blank";
            }, 1000);
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    };

    // كشف كونسول الطرفية
    const detectConsole = () => {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalInfo = console.info;

      // إعادة تعريف console
      console.log = function () {
        alert("🚫 استخدام الكونسول غير مسموح");
        window.location.href = "about:blank";
      };

      console.error = function () {
        alert("🚫 استخدام الكونسول غير مسموح");
        window.location.href = "about:blank";
      };

      console.warn = function () {
        alert("🚫 استخدام الكونسول غير مسموح");
        window.location.href = "about:blank";
      };

      console.info = function () {
        alert("🚫 استخدام الكونسول غير مسموح");
        window.location.href = "about:blank";
      };
    };

    // كشف Debugger
    const preventDebugger = () => {
      setInterval(() => {
        debugger;
      }, 100);
    };

    // منع فحص العناصر
    const preventInspect = () => {
      document.addEventListener("keydown", (e) => {
        // F12
        if (e.keyCode === 123) {
          e.preventDefault();
          alert("🚫 F12 غير مسموح");
          return false;
        }

        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
          e.preventDefault();
          alert("🚫 فحص العناصر غير مسموح");
          return false;
        }

        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
          e.preventDefault();
          alert("🚫 الكونسول غير مسموح");
          return false;
        }

        // Ctrl+U
        if (e.ctrlKey && e.keyCode === 85) {
          e.preventDefault();
          alert("🚫 عرض مصدر الصفحة غير مسموح");
          return false;
        }

        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
          e.preventDefault();
          alert("🚫 أداة التحديد غير مسموحة");
          return false;
        }

        // Ctrl+S
        if (e.ctrlKey && e.keyCode === 83) {
          e.preventDefault();
          alert("🚫 حفظ الصفحة غير مسموح");
          return false;
        }

        // Ctrl+A
        if (e.ctrlKey && e.keyCode === 65) {
          e.preventDefault();
          alert("🚫 تحديد الكل غير مسموح");
          return false;
        }

        // Ctrl+C
        if (e.ctrlKey && e.keyCode === 67) {
          e.preventDefault();
          alert("🚫 النسخ غير مسموح");
          return false;
        }

        // Ctrl+V
        if (e.ctrlKey && e.keyCode === 86) {
          e.preventDefault();
          alert("🚫 اللصق غير مسموح");
          return false;
        }

        // Ctrl+X
        if (e.ctrlKey && e.keyCode === 88) {
          e.preventDefault();
          alert("🚫 القص غير مسموح");
          return false;
        }

        // Ctrl+P
        if (e.ctrlKey && e.keyCode === 80) {
          e.preventDefault();
          alert("🚫 الطباعة غير مسموحة");
          return false;
        }

        // Print Screen
        if (e.keyCode === 44) {
          e.preventDefault();
          alert("🚫 لقطة الشاشة غير مسموحة");
          return false;
        }
      });
    };

    // كشف النقر الأيمن
    const preventRightClick = () => {
      document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        alert("🚫 النقر الأيمن غير مسموح");
        return false;
      });
    };

    // كشف التحديد
    const preventSelection = () => {
      document.addEventListener("selectstart", (e) => {
        e.preventDefault();
        return false;
      });

      document.onselectstart = () => false;
      document.onmousedown = () => false;
    };

    // كشف السحب والإفلات
    const preventDragDrop = () => {
      document.addEventListener("dragstart", (e) => {
        e.preventDefault();
        return false;
      });

      document.addEventListener("drop", (e) => {
        e.preventDefault();
        return false;
      });
    };

    // منع فتح المصدر في نافذة جديدة
    const blockViewSource = () => {
      // منع window.open
      const originalOpen = window.open;
      window.open = function () {
        alert("🚫 فتح نوافذ جديدة غير مسموح");
        return null;
      };
    };

    // كشف أدوات التطوير عبر العرض
    const detectByRendering = () => {
      let devtools = { open: false };

      setInterval(() => {
        const before = new Date();
        debugger;
        const after = new Date();

        if (after.getTime() - before.getTime() > 100) {
          if (!devtools.open) {
            devtools.open = true;
            document.body.style.display = "none";
            alert("🚫 تم اكتشاف أدوات التطوير");
            window.location.href = "about:blank";
          }
        } else {
          devtools.open = false;
        }
      }, 1000);
    };

    // تجميد الكائنات المهمة
    const freezeImportantObjects = () => {
      // تجميد console
      Object.freeze(console);

      // تجميد document
      Object.freeze(document);

      // منع تعديل prototype
      Object.freeze(Object.prototype);
      Object.freeze(Array.prototype);
      Object.freeze(Function.prototype);
    };

    // إخفاء رموز JavaScript في الذاكرة
    const obfuscateCode = () => {
      // إعادة تعريف setTimeout و setInterval لكشف التلاعب
      const originalSetTimeout = window.setTimeout;
      const originalSetInterval = window.setInterval;

      window.setTimeout = function (fn: Function, delay: number) {
        if (typeof fn === "string") {
          alert("🚫 تشغيل كود نصي غير مسموح");
          return 0;
        }
        return originalSetTimeout(fn, delay);
      };

      window.setInterval = function (fn: Function, delay: number) {
        if (typeof fn === "string") {
          alert("🚫 تشغيل كود نصي غير مسموح");
          return 0;
        }
        return originalSetInterval(fn, delay);
      };
    };

    // منع رسائل التطوير
    const disableDevMessages = () => {
      // إعادة تعريف console.log ليظهر رسالة تحذير بدلاً من المحتوى
      const methods = [
        "log",
        "debug",
        "info",
        "warn",
        "error",
        "table",
        "trace",
        "dir",
        "group",
        "groupCollapsed",
        "groupEnd",
        "clear",
        "count",
        "countReset",
        "time",
        "timeEnd",
        "timeLog",
        "timeStamp",
        "profile",
        "profileEnd",
        "assert",
      ];

      methods.forEach((method) => {
        (console as any)[method] = function () {
          alert(`🚫 استخدام console.${method} غير مسموح`);
          window.location.href = "about:blank";
        };
      });
    };

    // تطبيق جميع الحمايات
    detectDevTools();
    detectConsole();
    preventDebugger();
    preventInspect();
    preventRightClick();
    preventSelection();
    preventDragDrop();
    blockViewSource();
    detectByRendering();
    freezeImportantObjects();
    obfuscateCode();
    disableDevMessages();

    // رسالة تحذير في الكونسول قبل تطبيق الحماية
    console.clear();
    console.log(
      "%c🚫 تحذير أمني",
      "color: red; font-size: 40px; font-weight: bold;",
    );
    console.log(
      "%cهذا الموقع محمي بحقوق الطبع والنشر",
      "color: red; font-size: 20px;",
    );
    console.log(
      "%cأي محاولة لسرقة المحتوى أو الكود ستؤدي لحجب الوصول",
      "color: red; font-size: 16px;",
    );
    console.log(
      "%c© MrPheonixX 2024",
      "color: red; font-size: 16px; font-weight: bold;",
    );
  }, []);

  return null;
};

export default DevToolsBlocker;
