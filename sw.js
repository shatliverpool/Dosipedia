const CACHE_NAME = 'dosipedia-v1.0.1';
const urlsToCache = [
  '/',
  '/index.html',
  'https://raw.githubusercontent.com/shatliverpool/Dosipedia/main/logo.png'
];

// 1. ติดตั้ง Service Worker และ Cache ไฟล์
self.addEventListener('install', (event) => {
  // สั่งให้ Service Worker ตัวใหม่ข้ามการรอ และเตรียมทำงานทันที
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// 2. เคลียร์ Cache เวอร์ชันเก่าออกเมื่อมี Service Worker ตัวใหม่อัปเดต
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache); // ลบ Cache เวอร์ชันเก่า
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. ดักรับ Request ดึงไฟล์จาก Cache (ถ้าไม่มีค่อยดึงจาก Network)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// 4. รับคำสั่ง skipWaiting จาก index.html
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});