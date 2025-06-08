const CACHE_NAME = "version-9";
const urlsToCache = ["/","./index.html","./manifest.json","./pandadoctor.avif","./homeimage.jpg"];
const self = this;

const DB_NAME = "ClinicSystem";
const STORE_NAME = "Appointments";
const TOKEN_STORE = "Auth";

// Open IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = (event) => reject(event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'AppointmentId' });
      }
      if (!db.objectStoreNames.contains(TOKEN_STORE)) {
        db.createObjectStore(TOKEN_STORE); // key-value store for token
      }
    };
  });
}

// Save appointment data
function saveAppointments(data) {
  return openIndexedDB().then((db) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    data.forEach(item => store.put(item));
    return tx.complete || tx.done;
  });
}

// Get appointments
function getAppointments() {
  return openIndexedDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  });
}

// Get auth token from IndexedDB
function getAuthToken() {
  return openIndexedDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TOKEN_STORE, 'readonly');
      const store = tx.objectStore(TOKEN_STORE);
      const request = store.get("auth-token");
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  });
}

// Service Worker Installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Event Handling
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Handle /api/appointments
  if (request.method === 'GET' && request.url.includes('/api/appointments')) {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          const clone = response.clone();
          const data = await clone.json();
          await saveAppointments(data);
          return response;
        })
        .catch(async () => {
          const offlineData = await getAppointments();
          return new Response(JSON.stringify(offlineData), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          });
        })
    );
    return;
  }

  // Handle checkTokenExpiry
  if (request.method === 'GET' && request.url.includes('checkTokenExpiry')) { 
    console.log(request.url);
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(async () => {
          const token = await getAuthToken();
          if (token) {
            return new Response(JSON.stringify({ status: "Valid" }), {
              headers: { 'Content-Type': 'application/json' },
              status: 200
            });
          }

          return new Response(JSON.stringify({ status: "Invalid or Missing" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 401
          });
        })
    );
    return;
  }

  // General Cache Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            if (request.method === "GET" && !request.url.startsWith("chrome-extension")) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return caches.match("index.html");
          }
        });
    })
  );
});

// Activation
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
