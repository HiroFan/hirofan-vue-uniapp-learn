import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
//项目的配置文件 基于vite的配置文件
//vite 是一个基于Rollup的前端构建工具，它在开发过程中提供快速的构建和刷新，同时在生产环境中提供静态资源的构建
// https://vite.dev/config/
// 配置文件的路径
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
