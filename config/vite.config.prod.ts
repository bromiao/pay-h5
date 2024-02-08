import { loadEnv, mergeConfig } from 'vite'
import configCompressPlugin from './plugin/compress'
import configImageminPlugin from './plugin/imagemin'
import configVisualizerPlugin from './plugin/visualizer'
import baseConfig from './vite.config.base'

const lifecycle = process.env.npm_lifecycle_event
const env = loadEnv(process.env.NODE_ENV, process.cwd())

console.log('最终执行npm命令', lifecycle)
// console.log('环境变量', process.env)
console.log('当前NODE_ENV', process.env.NODE_ENV)
console.log('生产环境信息', env)

export default mergeConfig(
  {
    mode: 'production', // vite生产模式
    // 插件的具体配置请查看对应的文件
    plugins: [
      configCompressPlugin('gzip'),
      configImageminPlugin(),
      configVisualizerPlugin(lifecycle === 'report')
    ],
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV == 'pre-release' ? false : true,
          drop_debugger: process.env.NODE_ENV == 'pre-release' ? false : true
        }
      },
      rollupOptions: {
        output: {
          assetFileNames: assetInfo => {
            if (assetInfo.name.includes('.css')) return `assets/[name]-[hash][extname]`
            return `assets/[name].[ext]`
          },
          // 分包策略优化
          manualChunks: id => {
            if (
              id.includes('node_modules/vue/') ||
              id.includes('node_modules/@vue/') ||
              id.includes('vue-router') ||
              id.includes('pinia') ||
              id.includes('@vueuse/core')
            )
              return 'vue'
            if (id.includes('axios')) return 'axios'
            if (id.includes('lodash-es')) return 'lodash-es'
            if (id.includes('vant')) return 'vant'
            if (id.includes('fingerprintjs')) return 'fingerprintjs'
            if (id.includes('src/assets')) return 'assets'
          }
        },
        plugins: []
      },
      chunkSizeWarningLimit: 2000
    }
  },
  baseConfig
)
