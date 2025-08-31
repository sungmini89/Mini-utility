// 강력한 서비스 워커 및 캐시 제거 스크립트
console.log("Service Worker Clear Script 실행 중...");

// 즉시 실행 함수
(function () {
  // 서비스 워커 제거
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      console.log("등록된 서비스 워커 수:", registrations.length);
      for (let registration of registrations) {
        registration.unregister();
        console.log("Service Worker 제거됨:", registration.scope);
      }
    });
  }

  // 모든 캐시 제거
  if ("caches" in window) {
    caches.keys().then(function (names) {
      console.log("캐시 키들:", names);
      for (let name of names) {
        caches.delete(name);
        console.log("캐시 삭제됨:", name);
      }
    });
  }

  // IndexedDB 제거
  if ("indexedDB" in window) {
    indexedDB.databases().then(function (databases) {
      databases.forEach(function (db) {
        indexedDB.deleteDatabase(db.name);
        console.log("IndexedDB 삭제됨:", db.name);
      });
    });
  }

  // localStorage 및 sessionStorage 클리어
  localStorage.clear();
  sessionStorage.clear();
  console.log("로컬/세션 스토리지 클리어됨");

  // 쿠키 제거 (도메인 내에서)
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  console.log("쿠키 클리어됨");

  console.log("모든 캐시 및 스토리지 정리 완료");
})();
