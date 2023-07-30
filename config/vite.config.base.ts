import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import postcssImport from 'postcss-pxtorem'
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      // 包括的文件类型
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [IconsResolver({ prefix: 'Icon' }), VantResolver()],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({ enabledCollections: ['ep'] })
      ],
      dts: 'src/components.d.ts'
    }),
    Icons({ autoInstall: true })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src')
      }
    ]
  },
  define: {
    'process.env': {}
  },
  css: {
    postcss: {
      plugins: [
        postcssImport({
          // 这里的rootValue就是你的设计稿大小
          rootValue: 37.5,
          propList: ['*']
        }),
        autoprefixer({}) // 自动添加样式兼容前缀
      ]
    }
  }
})
