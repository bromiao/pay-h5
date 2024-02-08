/// <reference types="vite/client" />

interface Number {
  toTruncFixed: (dig: number) => string
}

interface ImportMetaEnv {
  /** API 前缀 */
  readonly VITE_API_PREFIX: string
  /** WS 地址 */
  readonly VITE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.json' {
  const value: any
  export default value
}

declare module 'vue-vconsole-devtools'

declare module 'lodash-es'
