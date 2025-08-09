// Advanced Security System for SAO Arabic Reader
// MrPheonixX Team - Content Protection & Anti-Piracy

export interface SecurityConfig {
  enableAntiCopy: boolean;
  enableDevToolsDetection: boolean;
  enableAdBlockDetection: boolean;
  enableScreenshotProtection: boolean;
  enableWatermark: boolean;
  strictMode: boolean;
}

export interface SecurityEvent {
  type: 'copy' | 'devtools' | 'screenshot' | 'adblock' | 'suspicious';
  timestamp: Date;
  details: string;
  userAgent: string;
  ip?: string;
}

class SecurityManager {
  private config: SecurityConfig;
  private events: SecurityEvent[] = [];
  private violations: number = 0;
  private isActive: boolean = false;
  private observers: ((event: SecurityEvent) => void)[] = [];

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = {
      enableAntiCopy: true,
      enableDevToolsDetection: true,
      enableAdBlockDetection: true,
      enableScreenshotProtection: true,
      enableWatermark: true,
      strictMode: false,
      ...config,
    };
  }

  // Initialize security system
  initialize(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('🛡️ MrPheonixX Security System - Initializing...');

    if (this.config.enableAntiCopy) {
      this.setupAntiCopy();
    }

    if (this.config.enableDevToolsDetection) {
      this.setupDevToolsDetection();
    }

    if (this.config.enableAdBlockDetection) {
      this.setupAdBlockDetection();
    }

    if (this.config.enableScreenshotProtection) {
      this.setupScreenshotProtection();
    }

    if (this.config.enableWatermark) {
      this.setupWatermark();
    }

    this.setupConsoleWarning();
    console.log('✅ Security system activated');
  }

  // Disable security (for debugging only)
  disable(): void {
    this.isActive = false;
    console.log('🔓 Security system disabled');
  }

  // Add event observer
  onSecurityEvent(callback: (event: SecurityEvent) => void): void {
    this.observers.push(callback);
  }

  // Log security event
  private logEvent(type: SecurityEvent['type'], details: string): void {
    const event: SecurityEvent = {
      type,
      timestamp: new Date(),
      details,
      userAgent: navigator.userAgent,
    };

    this.events.push(event);
    this.violations++;

    // Notify observers
    this.observers.forEach(observer => observer(event));

    // Log to console
    console.warn(`🚨 Security Event: ${type} - ${details}`);

    // Store in localStorage for persistence
    this.storeEvent(event);
  }

  // Store event in localStorage
  private storeEvent(event: SecurityEvent): void {
    try {
      const stored = localStorage.getItem('sao-security-events');
      const events = stored ? JSON.parse(stored) : [];
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('sao-security-events', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to store security event:', error);
    }
  }

  // Anti-copy protection
  private setupAntiCopy(): void {
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.logEvent('copy', 'Right-click attempted');
      this.showSecurityAlert('النقر بالزر الأيمن غير مسموح لحماية المحتوى');
    });

    // Disable keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      const isCopyShortcut = 
        (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 's' || e.key === 'p')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        e.key === 'F12';

      if (isCopyShortcut) {
        e.preventDefault();
        this.logEvent('copy', `Keyboard shortcut attempted: ${e.key}`);
        this.showSecurityAlert('هذا الاختصار غير مسموح لحماية المحتوى');
      }
    });

    // Disable text selection
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      input, textarea, [contenteditable] {
        -webkit-user-select: auto !important;
        -moz-user-select: auto !important;
        -ms-user-select: auto !important;
        user-select: auto !important;
      }
    `;
    document.head.appendChild(style);

    // Disable drag and drop
    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      this.logEvent('copy', 'Drag and drop attempted');
      this.showSecurityAlert('سحب المحتوى غير مسموح');
    });
  }

  // DevTools detection
  private setupDevToolsDetection(): void {
    let devtools = false;
    const threshold = 160;

    const checkDevTools = () => {
      const heightDifference = window.outerHeight - window.innerHeight;
      const widthDifference = window.outerWidth - window.innerWidth;

      if (heightDifference > threshold || widthDifference > threshold) {
        if (!devtools) {
          devtools = true;
          this.logEvent('devtools', 'Developer tools opened');
          this.handleDevToolsDetection();
        }
      } else {
        devtools = false;
      }
    };

    // Check every 500ms
    setInterval(checkDevTools, 500);

    // Additional detection methods
    const devToolsDetector = () => {
      const start = performance.now();
      debugger; // This will pause if devtools are open
      const end = performance.now();
      
      if (end - start > 100) {
        this.logEvent('devtools', 'Debugger pause detected');
        this.handleDevToolsDetection();
      }
    };

    setInterval(devToolsDetector, 5000);
  }

  // Handle DevTools detection
  private handleDevToolsDetection(): void {
    if (this.config.strictMode) {
      // Redirect away from site
      window.location.href = 'about:blank';
    } else {
      // Blur content temporarily
      document.body.style.filter = 'blur(10px)';
      this.showSecurityAlert('تم اكتشاف أدوات المطور. المحتوى محمي من النسخ');
      
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 3000);
    }
  }

  // AdBlock detection
  private setupAdBlockDetection(): void {
    const detectAdBlock = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox ads ad adsbygoogle';
      testAd.style.position = 'absolute';
      testAd.style.left = '-999px';
      testAd.style.top = '-999px';
      testAd.style.width = '1px';
      testAd.style.height = '1px';
      
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        if (testAd.offsetHeight === 0 || getComputedStyle(testAd).display === 'none') {
          this.logEvent('adblock', 'AdBlock detected');
          this.showAdBlockWarning();
        }
        document.body.removeChild(testAd);
      }, 100);
    };

    // Check on load and periodically
    detectAdBlock();
    setInterval(detectAdBlock, 30000); // Check every 30 seconds
  }

  // Show AdBlock warning
  private showAdBlockWarning(): void {
    const warning = document.createElement('div');
    warning.id = 'adblock-warning';
    warning.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: Arial, sans-serif;
        text-align: center;
        backdrop-filter: blur(10px);
      ">
        <div style="max-width: 500px; padding: 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🚫</div>
          <h2 style="color: #ef4444; margin-bottom: 1rem;">مانع الإعلانات مُفعّل</h2>
          <p style="line-height: 1.6; margin-bottom: 2rem;">
            يبدو أنك تستخدم مانع إعلانات. نحن نعتمد على الإعلانات لتوفير المحتوى مجاناً.
            يرجى إلغاء تفعيل مانع الإعلانات أو إضافة موقعنا إلى القائمة البيضاء.
          </p>
          <button onclick="location.reload()" style="
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-size: 16px;
          ">
            🔄 إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(warning);
  }

  // Screenshot protection
  private setupScreenshotProtection(): void {
    // Detect PrintScreen key
    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
        this.logEvent('screenshot', 'PrintScreen key pressed');
        this.handleScreenshotAttempt();
      }
    });

    // Detect window focus/blur (potential screenshot tools)
    let blurCount = 0;
    window.addEventListener('blur', () => {
      blurCount++;
      if (blurCount > 3) {
        this.logEvent('screenshot', 'Multiple window blur events (suspicious)');
      }
    });

    // Detect visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        setTimeout(() => {
          if (!document.hidden) {
            this.logEvent('suspicious', 'Quick visibility change detected');
          }
        }, 100);
      }
    });
  }

  // Handle screenshot attempt
  private handleScreenshotAttempt(): void {
    // Temporarily hide content
    document.body.style.visibility = 'hidden';
    this.showSecurityAlert('لقطات الشاشة غير مسموحة لحماية المحتوى');
    
    setTimeout(() => {
      document.body.style.visibility = 'visible';
    }, 2000);
  }

  // Setup watermark
  private setupWatermark(): void {
    const watermark = document.createElement('div');
    watermark.id = 'security-watermark';
    watermark.innerHTML = 'MrPheonixX Team - Protected Content';
    watermark.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      color: rgba(255, 255, 255, 0.1);
      font-size: 12px;
      font-family: monospace;
      z-index: 999998;
      pointer-events: none;
      user-select: none;
    `;
    
    document.body.appendChild(watermark);
  }

  // Setup console warning
  private setupConsoleWarning(): void {
    console.clear();
    console.log(
      '%c🛡️ MrPheonixX Team - حماية المحتوى نشطة',
      'color: #3b82f6; font-size: 24px; font-weight: bold;'
    );
    console.log(
      '%c⚠️ تحذير: هذا الموقع محمي من النسخ والتحميل',
      'color: #ef4444; font-size: 16px; font-weight: bold;'
    );
    console.log(
      '%c📚 للاستمتاع بالمحتوى، يرجى استخدام واجهة الموقع',
      'color: #10b981; font-size: 14px;'
    );
    console.log(
      '%c💰 إذا كنت تحب المحتوى، ادعمنا عبر Patreon أو YouTube',
      'color: #f59e0b; font-size: 14px;'
    );
  }

  // Show security alert
  private showSecurityAlert(message: string): void {
    // Create floating alert
    const alert = document.createElement('div');
    alert.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(239, 68, 68, 0.95);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #dc2626;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 999999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px;">🛡️</span>
          <span style="font-weight: bold;">تنبيه أمني</span>
        </div>
        <p style="margin: 8px 0 0 0; line-height: 1.4;">${message}</p>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  }

  // Get security statistics
  getStats(): {
    totalViolations: number;
    events: SecurityEvent[];
    isActive: boolean;
  } {
    return {
      totalViolations: this.violations,
      events: [...this.events],
      isActive: this.isActive,
    };
  }

  // Clear event history
  clearEvents(): void {
    this.events = [];
    this.violations = 0;
    localStorage.removeItem('sao-security-events');
  }
}

// Export singleton instance
export const securityManager = new SecurityManager();

// Auto-initialize in production
if (process.env.NODE_ENV === 'production') {
  document.addEventListener('DOMContentLoaded', () => {
    securityManager.initialize();
  });
}

export default securityManager;
