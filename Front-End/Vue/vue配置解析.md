# vue.config.js 设置全局变量

使用`webpack.config.js`时，我们是通过`webpack.DefinePlugin`来定义全局变量的

```js
module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  return {
      plugins: [
          new VueLoaderPlugin(),
          new webpack.DefinePlugin({
            ISLOCAL: JSON.stringify(!isProd),
          }),
          new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: true,
          }),
      ],
  }
```

vue.config.js的话需要在configureWebpack的plugins中定义

```js
const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        ISLOCAL: JSON.stringify(!isProd),
      })
    ],
  },
};
```

这个`ISLOCAL`变量我是用在了根目录的`main.js`中，但是`eslint`不识别全局变量，所以无法通过编译

```
37:26  error  'ISLOCAL' is not defined  no-undef
```

需要在`.eslintrc.js`文件中配置`globals`

```js
module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  globals: {
    "ISLOCAL": true
  }
};
```

如果不用`.eslintrc.js`文件，可以在`package.json`文件，`eslintConfig`中添加`globals`

```json
"eslintConfig": {
  "root": true,
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  "globals": {
    "ISLOCAL": true
  }
};
```

