const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // مسیری که می‌خواهید پروکسی کنید
    createProxyMiddleware({
      target: 'https://demo.hashmatict.com', // آدرس سرور اصلی
      changeOrigin: true,
      secure: false, // اگر سرور از HTTPS استفاده می‌کند، این گزینه را فعال کنید
    })
  );
};