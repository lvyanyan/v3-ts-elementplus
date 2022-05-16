const path = require('path')
import postCssPxToRem from "postcss-pxtorem"
module.exports = {
  alias: {
    // 键必须以斜线开始和结束
    '@': path.resolve(__dirname, 'src')
  },
  hostname: 'localhost',
  port: 8080,
  // 是否自动在浏览器打开
  open: true,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: './',
  /**
   * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
   * @default 'dist'
   */
  outDir: 'dist',
  css: {
    preprocessorOptions:{
        less:{
            modifyVars:{
                hack: `true; @import (reference) "${path.resolve('src/default.less')}";`,
            },
            javascriptEnabled:true
        }
    },
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 192, // 1rem的大小
          propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
        })
      ]
    }
  },
  optimizeDeps: {
    include: ["element-plus/lib/locale/lang/zh-cn"]
  },
  sourcemap:true,
  // 反向代理
  proxy: {
    '/api': {
      target: 'https://mhjoy.cn:3001',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  }
}
