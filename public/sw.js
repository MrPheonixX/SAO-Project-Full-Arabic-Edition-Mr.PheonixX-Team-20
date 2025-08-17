// Service Worker for SAO Arabic Reader PWA
// MrPheonixX Team - Advanced Offline Reading Support

const CACHE_NAME = "sao-arabic-reader-v1.0.0";
const STATIC_CACHE = "sao-static-v1";
const DYNAMIC_CACHE = "sao-dynamic-v1";
const READING_CACHE = "sao-reading-v1";

// Files to cache immediately
const STATIC_FILES = [
  "/",
  "/manifest.json",
  "/offline.html",
  // Add critical CSS and JS files
  "/static/css/main.css",
  "/static/js/main.js",
  // Essential images
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/placeholder.svg",
];

// Routes to cache dynamically
const DYNAMIC_ROUTES = [
  "/sao",
  "/progressive",
  "/sideworks",
  "/login",
  "/profile",
];

// Install event - cache static files and PDFs from manifest
self.addEventListener("install", (event) => {
  console.log("🛡️ MrPheonixX SAO Reader - Service Worker Installing...");

  event.waitUntil(
    (async () => {
      try {
        await Promise.all([
          // Cache static files
          caches.open(STATIC_CACHE).then((cache) => {
            console.log("📦 Caching static files...");
            return cache.addAll(STATIC_FILES);
          }),
          // Cache shell for offline reading
          caches.open(READING_CACHE).then((cache) => {
            console.log("📚 Preparing offline reading cache...");
            return cache.addAll(["/offline.html", "/reader-offline.html"]);
          }),
        ]);

        // Pre-cache PDFs from local manifest if available
        try {
          const res = await fetch("/works-manifest.json", {
            cache: "no-cache",
          });
          if (res.ok) {
            const manifest = await res.json();
            const pdfUrls = (Array.isArray(manifest) ? manifest : [])
              .map((item) => item.pdfUrlRaw)
              .filter((u) => typeof u === "string" && u.startsWith("http"));
            if (pdfUrls.length) {
              const cache = await caches.open(READING_CACHE);
              await Promise.allSettled(
                pdfUrls.map((u) => cache.add(u).catch(() => undefined)),
              );
              console.log(`📚 Pre-cached ${pdfUrls.length} PDFs from manifest`);
            }
          }
        } catch (e) {
          console.warn("⚠️ Could not pre-cache PDFs from manifest", e);
        }

        console.log("✅ Installation complete");
        await self.skipWaiting();
      } catch (error) {
        console.error("❌ Installation failed:", error);
      }
    })(),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("🔄 Service Worker Activating...");

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith("sao-") &&
                !Object.values({
                  STATIC_CACHE,
                  DYNAMIC_CACHE,
                  READING_CACHE,
                }).includes(cacheName),
            )
            .map((cacheName) => {
              console.log("🗑️ Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }),
        );
      }),

      // Claim all clients
      self.clients.claim(),
    ]).then(() => {
      console.log("✅ Activation complete");

      // Send update notification to clients
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "SW_UPDATED",
            message: "تم تحديث التطبيق للإصدار الأحدث",
          });
        });
      });
    }),
  );
});

// Fetch event - handle all network requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith("/api/")) {
    // API requests - network first, cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith("/reader/")) {
    // Reading content - cache first for offline reading
    event.respondWith(handleReaderRequest(request));
  } else if (
    (request.destination === "document" && url.pathname.endsWith(".pdf")) ||
    request.url.endsWith(".pdf")
  ) {
    // PDF files (external or local) - cache first in READING_CACHE
    event.respondWith(handlePdfRequest(request));
  } else if (
    STATIC_FILES.includes(url.pathname) ||
    url.pathname.includes("/static/")
  ) {
    // Static files - cache first
    event.respondWith(handleStaticRequest(request));
  } else {
    // Dynamic pages - stale while revalidate
    event.respondWith(handleDynamicRequest(request));
  }
});

// Handle API requests (network first)
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("📡 Network failed, trying cache for API request");

    // Fallback to cache
    const cacheResponse = await caches.match(request);
    if (cacheResponse) {
      return cacheResponse;
    }

    // Return offline response for API
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "هذه البيانات غير متاحة في وضع عدم الاتصال",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Handle PDF requests (cache first)
async function handlePdfRequest(request) {
  try {
    const cache = await caches.open(READING_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    const networkResponse = await fetch(request, { mode: "cors" });
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (e) {
    console.warn("⚠️ PDF fetch failed", e);
    return new Response("PDF unavailable offline", { status: 503 });
  }
}

// Handle reader requests (cache first for offline reading)
async function handleReaderRequest(request) {
  try {
    // Check cache first for reading content
    const cacheResponse = await caches.match(request);
    if (cacheResponse) {
      console.log("📖 Serving reading content from cache");
      return cacheResponse;
    }

    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(READING_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("📱 Network failed for reader, serving offline version");

    // Serve offline reading page
    const offlineResponse = await caches.match("/reader-offline.html");
    return (
      offlineResponse ||
      new Response(createOfflineReaderHTML(), {
        headers: { "Content-Type": "text/html" },
      })
    );
  }
}

// Handle static requests (cache first)
async function handleStaticRequest(request) {
  const cacheResponse = await caches.match(request);
  if (cacheResponse) {
    return cacheResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("📦 Failed to load static resource:", request.url);
    return new Response("Resource not available offline", { status: 404 });
  }
}

// Handle dynamic requests (stale while revalidate)
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cacheResponse = await caches.match(request);

  // Serve from cache if available
  if (cacheResponse) {
    // Update cache in background
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
      })
      .catch(() => {
        // Network failed, cache remains valid
      });

    return cacheResponse;
  }

  // No cache, try network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Network failed, serve offline page
    console.log("🌐 Network failed, serving offline page");
    const offlineResponse = await caches.match("/offline.html");
    return (
      offlineResponse ||
      new Response(createOfflineHTML(), {
        headers: { "Content-Type": "text/html" },
      })
    );
  }
}

// Background sync for reading progress
self.addEventListener("sync", (event) => {
  console.log("🔄 Background sync triggered:", event.tag);

  if (event.tag === "reading-progress-sync") {
    event.waitUntil(syncReadingProgress());
  } else if (event.tag === "user-preferences-sync") {
    event.waitUntil(syncUserPreferences());
  }
});

// Sync reading progress when online
async function syncReadingProgress() {
  try {
    // Get stored reading progress from IndexedDB
    const progressData = await getStoredReadingProgress();

    if (progressData && progressData.length > 0) {
      // Send to server
      const response = await fetch("/api/sync-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progressData),
      });

      if (response.ok) {
        await clearStoredReadingProgress();
        console.log("✅ Reading progress synced");
      }
    }
  } catch (error) {
    console.error("❌ Failed to sync reading progress:", error);
  }
}

// Sync user preferences
async function syncUserPreferences() {
  try {
    const preferences = await getStoredPreferences();

    if (preferences) {
      const response = await fetch("/api/sync-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        console.log("✅ User preferences synced");
      }
    }
  } catch (error) {
    console.error("❌ Failed to sync preferences:", error);
  }
}

// Push notifications for new content
self.addEventListener("push", (event) => {
  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || "محتوى جديد متاح في مكتبة ساو العربية",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    image: data.image,
    data: {
      url: data.url || "/",
      id: data.id || Date.now(),
    },
    actions: [
      {
        action: "view",
        title: "عرض",
        icon: "/icons/view-action.png",
      },
      {
        action: "dismiss",
        title: "إغلاق",
        icon: "/icons/dismiss-action.png",
      },
    ],
    tag: "sao-content-update",
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
    dir: "rtl",
    lang: "ar",
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "MrPheonixX Team",
      options,
    ),
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    const urlToOpen = event.notification.data.url || "/";

    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }

        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
    );
  }
});

// Message handling for communication with app
self.addEventListener("message", (event) => {
  console.log("📨 SW received message:", event.data);

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;

      case "CACHE_VOLUME":
        event.waitUntil(cacheVolume(event.data.volumeData));
        break;

      case "CLEAR_CACHE":
        event.waitUntil(clearAllCaches());
        break;

      case "GET_CACHE_SIZE":
        event.waitUntil(
          getCacheSize().then((size) => {
            event.ports[0].postMessage({ type: "CACHE_SIZE", size });
          }),
        );
        break;
    }
  }
});

// Cache specific volume for offline reading
async function cacheVolume(volumeData) {
  try {
    const cache = await caches.open(READING_CACHE);
    const promises = volumeData.pages.map((page) => {
      return cache.add(page.url);
    });

    await Promise.all(promises);
    console.log(`📚 Cached volume: ${volumeData.title}`);

    // Notify app of successful caching
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "VOLUME_CACHED",
        volumeId: volumeData.id,
        title: volumeData.title,
      });
    });
  } catch (error) {
    console.error("❌ Failed to cache volume:", error);
  }
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name.startsWith("sao-"))
      .map((name) => caches.delete(name)),
  );
  console.log("🗑️ All caches cleared");
}

// Get total cache size
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;

  for (const cacheName of cacheNames) {
    if (cacheName.startsWith("sao-")) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
  }

  return totalSize;
}

// Helper functions for IndexedDB operations
async function getStoredReadingProgress() {
  // Implement IndexedDB reading progress retrieval
  return [];
}

async function clearStoredReadingProgress() {
  // Implement IndexedDB cleanup
}

async function getStoredPreferences() {
  // Implement IndexedDB preferences retrieval
  return null;
}

// Create offline HTML pages
function createOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>غير متصل - MrPheonixX Team</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #1e293b, #3730a3);
          color: white;
          margin: 0;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          text-align: center;
          max-width: 400px;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          color: #60a5fa;
          margin-bottom: 1rem;
        }
        p {
          color: #d1d5db;
          line-height: 1.6;
        }
        .retry-btn {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🌐</div>
        <h1>غير متصل بالإنترنت</h1>
        <p>يبدو أنك غير متصل بالإنترنت. تأكد من اتصالك وأعد المحاولة.</p>
        <button class="retry-btn" onclick="location.reload()">إعادة المحاولة</button>
      </div>
    </body>
    </html>
  `;
}

function createOfflineReaderHTML() {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>قارئ غير متصل - MrPheonixX Team</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #1e293b, #3730a3);
          color: white;
          margin: 0;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          text-align: center;
          max-width: 500px;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          color: #60a5fa;
          margin-bottom: 1rem;
        }
        p {
          color: #d1d5db;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .feature-list {
          text-align: right;
          margin: 1.5rem 0;
          color: #9ca3af;
        }
        .feature-list li {
          margin: 0.5rem 0;
        }
        .btn {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          margin: 0.5rem;
          text-decoration: none;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📚</div>
        <h1>وضع القراءة غير المتصل</h1>
        <p>المحتوى المطلوب غير متاح في وضع عدم الاتصال.</p>
        
        <div class="feature-list">
          <p><strong>للاستمتاع بالقراءة غير المتصلة:</strong></p>
          <ul>
            <li>قم بزيارة المجلدات أثناء الاتصال بالإنترنت</li>
            <li>سيتم حفظها تلقائياً للقراءة لاحقاً</li>
            <li>استخدم زر "حفظ للقراءة غير المتصلة" في كل مجلد</li>
          </ul>
        </div>
        
        <a href="/" class="btn">العودة للرئيسية</a>
        <button class="btn" onclick="location.reload()">إعادة المحاولة</button>
      </div>
    </body>
    </html>
  `;
}

console.log("🛡️ MrPheonixX SAO Arabic Reader - Service Worker Loaded");
