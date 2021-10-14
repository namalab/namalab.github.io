//キャッシュ名
var CACHE_NAME = "PWA-DEMO1_v0";

//キャッシュするファイル名
var urlsToCache = [
  "index.html",
  "cocos2d-js-v3.13.js",
  "project.json",
  "manifest.json",
  "main.js",
  "icon.png",
  "src/resource.js",
  "src/scene/ColorLayer.js",
  "src/scene/GameScene.js",
  "src/scene/StarLayer.js",
  "src/scene/TitleScene.js",
  "res/firework1.png",
  "res/galaga-enemy1.png",
  "res/galaga-enemy2.png",
  "res/galaga-fighter1.png",
  "res/galaga-fighter2.png",
  "res/bgm/galaga_bgm1.mp3",
  "res/se/galaga_se_firework1.mp3",
  "res/font/x8y12pxTheStrongGamer.ttf"
];

self.addEventListener('install', function (e) {
  console.log('install');
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function (e) {
  console.log('activate');
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (e) => {
  console.log('fetch');
  e.respondWith(
    caches.match(e.request).then((r) => {
      console.log('[Service Worker] Fetching resource: ' + e.request.url);
      return r || fetch(e.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          console.log('[Service Worker] Caching new resource: ' + e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
