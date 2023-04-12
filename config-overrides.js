const { aliasWebpack } = require("react-app-alias");
const rewireHtmlWebpackPlugin = require("react-app-rewire-html-webpack-plugin");
module.exports = function override(config, env) {
  // config是现有的配置，返回新的配置aliasWebpack()(config)
  // webpack会应用新的配置，识别路径别名
  // 因为我们把配置写到了tsconfig里，所以webpack会识别到
  const aliasConfig = aliasWebpack()(config);
  const htmlWebpackPluginConfig = rewireHtmlWebpackPlugin(config, env, {
    cdn: {
      js: [
        "https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js",
        "https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
        "https://cdn.bootcdn.net/ajax/libs/redux/4.2.0/redux.min.js",
        "https://cdn.bootcdn.net/ajax/libs/react-redux/8.0.4/react-redux.min.js",
        "https://unpkg.com/redux-thunk@2.4.2/dist/redux-thunk.min.js",
        "https://unpkg.com/redux-persist@5.10.0/dist/redux-persist.min.js",
        "https://unpkg.com/history@4.10.1/umd/history.min.js",
        "https://unpkg.com/react-router@5.3.4/umd/react-router.min.js",
        "https://unpkg.com/react-router-dom@5.3.4/umd/react-router-dom.min.js",
        "https://unpkg.com/axios@1.1.3/dist/axios.min.js",
        "https://cdn.bootcdn.net/ajax/libs/classnames/2.3.2/index.min.js",
      ],
      css: [
        "https://www.unpkg.com/bulma@0.9.4/css/bulma.min.css",
        "https://unpkg.com/@fortawesome/fontawesome-free@5.15.2/css/all.min.css",
      ],
    },
  });
  return {
    ...config,
    ...aliasConfig,
    ...htmlWebpackPluginConfig,
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
      redux: "Redux",
      "react-redux": "ReactRedux",
      "redux-thunk": "ReduxThunk",
      "redux-persist": "ReduxPersist",
      "react-router-dom": "ReactRouterDOM",
      axios: "axios",
      classnames: "classNames",
    },
  };
};
