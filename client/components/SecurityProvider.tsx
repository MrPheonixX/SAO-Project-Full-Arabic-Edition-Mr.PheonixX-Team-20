import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimatedNotifications } from "./AnimatedNotifications";

interface SecurityContextType {
  isSecurityActive: boolean;
  adBlockDetected: boolean;
  devToolsDetected: boolean;
  copyAttempts: number;
  screenshotAttempts: number;
  triggerSecurityAlert: (type: string, message: string) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurityContext must be used within SecurityProvider");
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
  enableSecurity?: boolean;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
  enableSecurity = true,
}) => {
  // Check localStorage for admin security settings
  const getSecuritySetting = () => {
    try {
      const savedSetting = localStorage.getItem('admin-security-enabled');
      if (savedSetting !== null) {
        return savedSetting === 'true';
      }
      return enableSecurity;
    } catch {
      return enableSecurity;
    }
  };

  const [isSecurityActive, setIsSecurityActive] = useState(getSecuritySetting());
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const [copyAttempts, setCopyAttempts] = useState(0);
  const [screenshotAttempts, setScreenshotAttempts] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const triggerSecurityAlert = (type: string, message: string) => {
    const notification = {
      id: Date.now().toString(),
      type: type as any,
      title: "تنبيه أمني",
      message,
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, notification]);
  };

  // Toggle security function for admin control
  const toggleSecurity = (enabled: boolean) => {
    setIsSecurityActive(enabled);
    localStorage.setItem('admin-security-enabled', enabled.toString());

    if (enabled) {
      triggerSecurityAlert("success", "تم تفعيل نظام الحماية بنجاح");
    } else {
      triggerSecurityAlert("warning", "تم إيقاف نظام الحماية مؤقتاً");
    }
  };

  // AdBlock Detection
  useEffect(() => {
    if (!isSecurityActive) return;

    const detectAdBlock = () => {
      const testAd = document.createElement("div");
      testAd.innerHTML = "&nbsp;";
      testAd.className = "adsbox";
      testAd.style.position = "absolute";
      testAd.style.left = "-999px";
      testAd.style.top = "-999px";
      
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setAdBlockDetected(true);
          triggerSecurityAlert("adblock", "تم اكتشاف مانع الإعلانات. يرجى إلغاء تفعيله لدعم المنصة.");
        }
        document.body.removeChild(testAd);
      }, 100);
    };

    detectAdBlock();
  }, [isSecurityActive]);

  // DevTools Detection
  useEffect(() => {
    if (!isSecurityActive) return;

    let devtools = false;
    const threshold = 160;

    const checkDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools) {
          devtools = true;
          setDevToolsDetected(true);
          triggerSecurityAlert("security", "تم اكتشاف أدوات المطور. المحتوى محمي من النسخ.");
          document.body.style.filter = "blur(5px)";
          
          setTimeout(() => {
            document.body.style.filter = "none";
            devtools = false;
            setDevToolsDetected(false);
          }, 3000);
        }
      }
    };

    const interval = setInterval(checkDevTools, 500);
    return () => clearInterval(interval);
  }, [isSecurityActive]);

  // Disable Right Click and Copy
  useEffect(() => {
    if (!isSecurityActive) return;

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      setCopyAttempts(prev => prev + 1);
      triggerSecurityAlert("security", "النقر بالزر الأيمن غير مسموح لحماية المحتوى.");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common copy/save shortcuts
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "a" || e.key === "s" || e.key === "p")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        setCopyAttempts(prev => prev + 1);
        triggerSecurityAlert("security", "هذا الاختصار غير مسموح لحماية المحتوى.");
      }
    };

    const handlePrintScreen = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        setScreenshotAttempts(prev => prev + 1);
        triggerSecurityAlert("security", "لقطات الشاشة غير مسموحة لحماية المحتوى.");
        
        // Temporarily hide content
        document.body.style.visibility = "hidden";
        setTimeout(() => {
          document.body.style.visibility = "visible";
        }, 1000);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handlePrintScreen);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handlePrintScreen);
    };
  }, [isSecurityActive]);

  // Disable Text Selection
  useEffect(() => {
    if (!isSecurityActive) return;

    const style = document.createElement("style");
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      input, textarea {
        -webkit-user-select: auto !important;
        -moz-user-select: auto !important;
        -ms-user-select: auto !important;
        user-select: auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isSecurityActive]);

  // Disable Drag and Drop
  useEffect(() => {
    if (!isSecurityActive) return;

    const handleDragStart = (e: Event) => {
      e.preventDefault();
      triggerSecurityAlert("security", "سحب المحتوى غير مسموح.");
    };

    document.addEventListener("dragstart", handleDragStart);
    return () => document.removeEventListener("dragstart", handleDragStart);
  }, [isSecurityActive]);

  // Console Warning
  useEffect(() => {
    if (!isSecurityActive) return;

    console.clear();
    console.log(
      "%c🛡️ MrPheonixX Team - حماية المحتوى نشطة",
      "color: #3b82f6; font-size: 24px; font-weight: bold;"
    );
    console.log(
      "%c⚠️ تحذير: هذا الموقع محم�� من النسخ والتحميل",
      "color: #ef4444; font-size: 16px; font-weight: bold;"
    );
    console.log(
      "%c📚 للاستمتاع بالمحتوى، يرجى استخدام واجهة الموقع",
      "color: #10b981; font-size: 14px;"
    );
  }, [isSecurityActive]);

  const contextValue: SecurityContextType = {
    isSecurityActive,
    adBlockDetected,
    devToolsDetected,
    copyAttempts,
    screenshotAttempts,
    triggerSecurityAlert,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
      <AnimatedNotifications notifications={notifications} />
    </SecurityContext.Provider>
  );
};

export default SecurityProvider;
