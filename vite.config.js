import path from 'path'
import { defineConfig } from 'vite'
import postCssPxToRem from "postcss-pxtorem"
import vue from "@vitejs/plugin-vue";
import legacyPlugin from '@vitejs/plugin-legacy'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'comp': path.resolve(__dirname, 'src/components'),
            'style': path.resolve(__dirname, 'src/style'),
            'api': path.resolve(__dirname, 'src/api'),
            'utils': path.resolve(__dirname, 'src/utils'),
            'views': path.resolve(__dirname, 'src/views'),
            'routers': path.resolve(__dirname, 'src/routers'),
            'config': path.resolve(__dirname, 'src/config'),
        },
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
        preprocessorOptions: {
            less: {
                modifyVars: {
                    hack: `true; @import (reference) "${path.resolve('src/default.less')}";`,
                },
                javascriptEnabled: true
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
    build: {
        target: ['chrome60', 'chrome102', 'chrome75']
    },
    plugins: [vue(),
    legacyPlugin({
        targets: ['> 1%, last 1 version, ie >= 11'],  // 需要兼容的目标列表，可以设置多个
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'] // 面向IE11时需要此插件
    })
    ],
    optimizeDeps: {
        include: ["element-plus/lib/locale/lang/zh-cn", "resize-observer-polyfill"]
    },
    sourcemap: true,
    // 反向代理
    proxy: {
        '/api': {
            target: 'https://mhjoy.cn:3001',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, '')
        }
    }
})
