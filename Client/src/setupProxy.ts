const { createProxyMiddleware } = require('http-proxy-middleware');

const API_URL: string = import.meta.env.VITE_API_URL;

module.exports = function (app: any) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: API_URL,
      changeOrigin: true,
    })
  );
};
