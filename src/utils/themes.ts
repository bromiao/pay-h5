import border from '@/assets/themes/border'
import font from '@/assets/themes/font'
import imgIcon from '@/assets/themes/img-icon'
import type { ConfigProviderProps, ConfigProviderTheme, ConfigProviderThemeVars } from 'vant'
export const themesVant: Record<
  string,
  ConfigProviderThemeVars | ConfigProviderTheme | ConfigProviderProps | any
> = {
  common: {
    ...font['common']
  },
  ofupay: {
    buttonPrimaryBackground: '#1e2d7e',
    buttonPrimaryBorderColor: '#1e2d7e'
  },
  def: {}
}

const def = {
  ...imgIcon['def'],
  ...font['def'],
  ...border['def']
}

const ofupay = {
  ...imgIcon['ofupay'],
  ...font['ofupay'],
  ...border['ofupay']
}

export type themeType = 'def' | 'ofupay'

// 主题变量集
const themeVariable = { ofupay, def }

export const changeThemeVariable = (theme: themeType) => {
  // root-var 全局变量样式表内容
  let themeStyleContent = ''
  // 当前样式主题对象
  const currentTheme = themeVariable[theme]

  // 主题颜色变量
  for (const key in currentTheme) {
    if (Object.hasOwnProperty.call(currentTheme, key)) {
      // 设置 root 变量
      themeStyleContent += `\n  --app-color-${key}: ${
        (currentTheme as Record<string, string>)[key]
      };`
    }
  }
  themeStyleContent = `:root {${themeStyleContent}\n}`

  const rootVarStylesheet = document.querySelector('#root-var')
  if (!rootVarStylesheet) {
    // 创建style标签
    const style = document.createElement('style')
    // 设置style属性
    style.type = 'text/css'
    style.id = 'root-var'
    // 将主题样式写入style内
    style.innerHTML = themeStyleContent
    // 将style样式存放到head标签
    document.querySelector('head')!.appendChild(style)
  } else {
    rootVarStylesheet.innerHTML = themeStyleContent
  }
}

export default themesVant
