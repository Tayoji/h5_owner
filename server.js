'use strict';

const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');
const bundler = webpack(webpackConfig);
const bs = browserSync.create();

bs.init({
  logPrefix: 'AMT',
  server: {
    baseDir: [
      'dist',
    ],
    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true}
      }),

      // bundler should be the same as above
      webpackHotMiddleware(bundler)
    ]
  },
});

// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var config = require('./webpack.config');
//
// //代理服务器
// var proxy = [{
//   path: '/*/*', //必须得有一个文件地址，如果顶层文件夹名字不同，则用/*代替
//   target: 'http://shopro.putaoevent.com',
//   host: 'shopro.putaoevent.com',
//   secure: false
// }];
// var server = new WebpackDevServer(webpack(config), {
//   publicPath: config.output.publicPath,
//   progress: true,
//   stats: {
//     colors: true
//   },
//   proxy
// });
//
// //将其他路由，全部返回index.html
// server.app.get('*', function(req, res) {
//   res.sendFile(__dirname + '/index.html')
// });
// server.listen(3000, function() {
//   console.log('正常打开3000端口')
// });

/*eslint-disable no-console, no-var */
// const express = require('express')
// const path = require('path')
// const port = process.env.PORT || 8080
// const app = express()
//
// // serve static assets normally
// app.use(express.static(__dirname + '/public'))
//
// // handle every other route with index.html, which will contain
// // a script tag to your application's JavaScript file(s).
// app.get('*', function (request, response){
//   response.sendFile(__dirname + '/index.html')
// })
//
// app.listen(port)
// console.log("server started on port " + port)
// const express = require('express')
// const path = require('path')
// const port = process.env.PORT || 8080
// const app = express()
//
// // serve static assets normally
// console.log(__dirname)
// app.use(express.static(__dirname + '/dist'))
//
// // handle every other route with index.html, which will contain
// // a script tag to your application's JavaScript file(s).
// app.get('*', function (request, response){
//   response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
// })
//
// app.listen(port)
// console.log("server started on port " + port)

