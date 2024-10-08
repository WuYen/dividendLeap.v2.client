// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const { title, message } = data;

  const options = {
    body: message,
    icon: '/icon.png', // 可以自訂通知的圖示
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://joyful-bienenstitch-1e0438.netlify.app/my') // 點擊通知後打開的網頁
  );
});
