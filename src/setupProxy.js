// 注意: 该文件不需要在项目的任何地方被导入, 当启动开发服务器时它会被自动注册
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/v1_0",
    createProxyMiddleware({
      target: process.env.REACT_APP_BASE_URL,
      changeOrigin: true,
    })
  );
};
