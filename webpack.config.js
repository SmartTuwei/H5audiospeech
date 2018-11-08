const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // entry: './src/index.js',
    output: {
        path: __dirname,
        filename: './release/bundle.js'  // release 会自动创建
    },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: './index.html'  // bundle.js 会自动注入
    //     })
    // ],
    devServer: {
        contentBase: "./",  // 根目录
        open: true,  // 自动打开浏览器
        port: 9000,   // 端口
        proxy: {
            '/api': {
                target: 'http://vop.baidu.com/server_api',
                changeOrigin: true,
                pathRewrite: {
                '^/api': ''
                }
             },
             '/token': {
                target: 'https://aip.baidubce.com/oauth/2.0/token', //获取token代理
                changeOrigin: true,
                pathRewrite: {
                '^/token': ''
                }
             }
        }
    }
}