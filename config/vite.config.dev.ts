import { mergeConfig, loadEnv } from 'vite'
import baseConfig from './vite.config.base'
import config from '../public/config_dev.json'

const lifecycle = process.env.npm_lifecycle_event
const isHttpsLifecycle = lifecycle === 'dev:https'
const env = loadEnv(process.env.NODE_ENV, process.cwd())
console.log('开发环境信息', env)
const SERVE_URL = config.SERVE_URL

export default mergeConfig(
  {
    mode: 'development', // vite开发模式
    server: {
      port: 9988,
      open: false, // 自动打开浏览器
      fs: {
        strict: true // 文件读取必须是相对于根目录的绝对路径
      },
      https: true, // 开启https
      // https: isHttpsLifecycle, // 开启https
      // proxy: {
      //   // capi 开头的请求代理到远程服务器
      //   '/capi': {
      //     // 地址根据环境配置读取
      //     target: loadEnv('development', process.cwd()).VITE_API_PREFIX,
      //     changeOrigin: true,
      //   },
      // },
      proxy: {
        '/api': {
          target: SERVE_URL,
          changeOrigin: true,
          secure: true,
          ws: true, // 支持 websocket
          rewrite: path => path.replace(/^\/api/, '') // 路径重写
        },
        '/pay': {
          target: SERVE_URL,
          changeOrigin: true,
          secure: true,
          ws: true, // 支持 websocket
          rewrite: path => path.replace(/^\/pay/, '') // 路径重写
        },
        [env.VITE_APP_STATIC_PATH]: {
          target: env.VITE_APP_STATIC_URL,
          changeOrigin: true,
          secure: true,
          pathRewrite: {
            [`^${env.VITE_APP_STATIC_PATH}`]: ''
          }
        }
      }
    }
  },
  baseConfig
)
