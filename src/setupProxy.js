const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/subway",
        createProxyMiddleware({
            target: "https://app.map.kakao.com/",
            changeOrigin: true,
            pathRewrite: {
                "^/subway": "/subway",
            },
        })
    );
};
