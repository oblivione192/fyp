const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://localhost:3000",
      changeOrigin: true,
      secure: false,       
      timeout: 20000,
      proxyTimeout: 20000,
    })
  );

  app.use(
    "/auth",
    createProxyMiddleware({
      target: "https://localhost:3000",
      changeOrigin: true,
      secure: false,        
      timeout: 20000,
      proxyTimeout: 20000,
    })
  );
};