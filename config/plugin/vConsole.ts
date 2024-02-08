export default function vConsolePlugin({ entry, enable = true }) {
  return {
    name: 'vite-plugin-vconsole',
    transform(src, id) {
      if (entry.includes(id) && enable) {
        const code = `
                import VConsole from 'vconsole';
                import { initPlugin } from 'vue-vconsole-devtools';
                window.vConsoleInstance = new VConsole();
                initPlugin(window.vConsoleInstance);
                ${src}
              `

        return {
          code: code,
          map: null // 如果可行将提供 source map
        }
      }
      return {
        code: src,
        map: null
      }
    }
  }
}
