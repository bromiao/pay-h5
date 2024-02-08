import viteImagemin from 'vite-plugin-imagemin'

/**
 * 图片压缩
 */
export default function configImageminPlugin() {
  const imageminPlugin = viteImagemin({
    // disable: true,
    filter: asset => {
      const RegExp = /\.(css|js|html|json)$/

      if (asset.includes('assets/Imagemin_bg')) return false // 不压缩特定图像文件
      if (RegExp.test(asset)) return false // 过滤非图片资源
      return true // 压缩其他图像文件
    },
    gifsicle: {
      optimizationLevel: 7,
      interlaced: false
    },
    optipng: {
      optimizationLevel: 7
    },
    mozjpeg: {
      quality: 20
    },
    pngquant: {
      quality: [0.8, 0.9],
      speed: 4
    },
    svgo: {
      plugins: [
        {
          name: 'removeViewBox'
        },
        {
          name: 'removeEmptyAttrs',
          active: false
        }
      ]
    },
    webp: { quality: 80 }
  })
  return imageminPlugin
}
