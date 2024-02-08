import { webUpdateNotice } from '@plugin-web-update-notification/vite'
import legacyPlugin from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import postCssPxToRem from 'postcss-pxtorem'
import esbuild from 'rollup-plugin-esbuild'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { version as appVersion } from '../package.json'
import vConsolePlugin from './plugin/vConsole'

import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import tailwindcss from 'tailwindcss'
import tailwindCssNesting from 'tailwindcss/nesting'
// import topLevelAwait from 'vite-plugin-top-level-await'
import basicSsl from '@vitejs/plugin-basic-ssl'

const env = loadEnv(process.env.NODE_ENV, process.cwd())

export default defineConfig({
  base: process.env.NODE_ENV === 'dev' ? '/' : './',
  plugins: [
    vue(),
    vueJsx(),
    basicSsl(),
    vConsolePlugin({
      entry: resolve(__dirname, '../src/main.ts'),
      // enable: process.env.NODE_ENV !== 'prod'
      enable: false
    }),
    // topLevelAwait({
    //   // The export name of top-level await promise for each chunk module
    //   promiseExportName: '__tla',
    //   // The function to generate import names of top-level await promise in each chunk module
    //   promiseImportName: i => `__tla_${i}`
    // }),
    webUpdateNotice({
      checkInterval: 5 * 60 * 1000,
      hiddenDefaultNotification: true
    }),
    AutoImport({
      // 包括的文件类型
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [IconsResolver({ prefix: 'Icon' }), VantResolver()],
      dts: true
      // dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [
        VantResolver(),
        // 自动注册图标组件
        IconsResolver({ enabledCollections: ['ep'] })
      ],
      dts: 'src/components.d.ts'
    }),
    Icons({ autoInstall: true }),
    esbuild({
      target: 'chrome64',
      loaders: {
        '.vue': 'js',
        '.ts': 'js'
      }
    }),
    legacyPlugin({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all'
      ]
    })
  ],
  build: {
    target: 'es2015',
    rollupOptions: {
      input: {
        main: resolve(__dirname, '../index.html')
        // exchange: resolve(__dirname, '../hybrid/exchange/index.html'),
        // deposit: resolve(__dirname, '../hybrid/deposit/index.html')
      }
    }
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src')
      }
    ]
  },
  define: {
    'process.env': Object.assign(process.env, env, { VITE_APP_VERSION: appVersion })
    // $coin_name: '5562'
  },
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        tailwindCssNesting(),
        tailwindcss(),
        autoprefixer({}), // 自动添加样式兼容前缀
        postCssPxToRem({
          // 这里的rootValue就是你的设计稿大小
          rootValue: ({ file }) => {
            if (file.indexOf('/hybrid/') !== -1) {
              return 100
            }
            return file.indexOf('node_modules/vant') !== -1 ? 37.5 : 75
          },
          minPixelValue: 2,
          propList: ['*'], //需要转换的属性
          selectorBlackList: ['.norem'] //过滤掉不需要转换的类名
          // exclude: [/node_modules\/vant/i],
        })
      ]
    }
  }
})
