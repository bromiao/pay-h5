import logo from '@/assets/images/logo.png'
import loading from 'vant/lib/loading'

export default class Toast {
  private static toast: HTMLElement
  private static pdom: HTMLElement
  private static parent: HTMLElement
  private static timer: NodeJS.Timeout
  static createStyle() {
    const style = document.createElement('style')

    style.innerHTML = `
    #errDialogParent{
      position: fixed;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      bottom: -100rem;
      z-index: 99999999
    }
    #errDialogParent[errDialogParentactive='true'] {
      bottom: 100rem;
    }
      #errDialog {
        background-color: #fff;
        color: #323233;
        width: 0;
        height: 0;
        overflow: hidden;
        font-size: 8rem;
        border-radius: 4rem;
      }
      #errDialog[errDialogactive='true'] {
        width: auto;
        padding: 0 10rem;
        height: auto;
        overflow: visible;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0rem 0rem 8rem 0 #5b5959;
      }
      #errDialog[errDialoghidden='true'] {
      }
      `
    document.head.appendChild(style)
  }

  static createDom() {
    const parent = document.createElement('div')

    parent.id = 'errDialogParent'
    const div = document.createElement('div')

    div.id = 'errDialog'
    const img = document.createElement('img')

    img.src = logo
    img.style.height = '25rem'
    img.style.width = '25rem'
    const p = document.createElement('p')

    div.appendChild(img)
    div.appendChild(p)
    parent.appendChild(div)
    // 插入到body中
    document.body.appendChild(parent)
    this.parent = parent
    this.toast = div
    this.pdom = p
  }

  // 插入元素到div中
  private static insertDom(msg: string) {
    this.pdom.innerHTML = msg
  }

  static {
    this.createStyle()
    this.createDom()
  }

  static show(msg = '', time = 2000) {
    return new Promise<void>(resolve => {
      if (this.timer) clearTimeout(this.timer)

      this.insertDom(msg)
      this.toast.setAttribute('errDialogactive', 'true')
      this.parent.setAttribute('errDialogParentactive', 'true')
      this.toast.animate(
        [
          {
            transform: 'scale(0)',
            opacity: 0
          },
          {
            transform: 'scale(1)',
            opacity: 1
          }
        ],
        {
          duration: 100,
          easing: 'cubic-bezier(.17,.67,.83,.67)'
        }
      )
      this.timer = setTimeout(() => {
        this.toast.animate(
          [
            {
              transform: 'scale(1)',
              opacity: 1
            },
            {
              transform: 'scale(0)',
              opacity: 0
            }
          ],
          {
            duration: 200,
            easing: 'cubic-bezier(.17,.67,.83,.67)'
          }
        ).onfinish = () => {
          this.parent.setAttribute('errDialogParentactive', 'false')
          this.toast.setAttribute('errDialogactive', 'false')
          resolve()
        }
      }, time)
    })
  }
}

export class Loading {
  private static dom: HTMLElement
  private static showStatus = false
  private static isDelayClose: NodeJS.Timeout
  static createStyle() {
    const style = document.createElement('style')

    style.innerHTML = `
    #loadingMask{
      position: fixed;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0,0,0,.5);
      z-index: 99999;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      overflow: hidden;
      padding-bottom: 100rem;
      -webkit-animation: maskShow 0.2s  ease-in-out;
      animation: maskShow 0.2s  ease-in-out;
    }
    #spinnerLoading {
      background-color: #fff;
      padding: 10rem 25.5rem;
      border-radius: 4rem;
      margin: 100rem auto;
      width: 100rem;
      height: 60rem;
      text-align: center;
      font-size: 10rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      -webkit-animation: loadingView 0.2s  ease-in-out;
      animation: loadingView 0.2s  ease-in-out;
    }
    
    #spinnerLoading > div {
      display: inline-block;
      background-color: rgba(0,0,0,.5);
      height: 100%;
      width: 6.5rem;
      justify-content: center;
      align-items: center;
      -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
      animation: sk-stretchdelay 1.2s infinite ease-in-out;
    }
    
    #spinnerLoading .rect2 {
      -webkit-animation-delay: -1.1s;
      animation-delay: -1.1s;
    }
    
    #spinnerLoading .rect3 {
      -webkit-animation-delay: -1.0s;
      animation-delay: -1.0s;
    }
    
    #spinnerLoading .rect4 {
      -webkit-animation-delay: -0.9s;
      animation-delay: -0.9s;
    }
    
    #spinnerLoading .rect5 {
      -webkit-animation-delay: -0.8s;
      animation-delay: -0.8s;
    }
    #spinnerLoading .rect6 {
      -webkit-animation-delay: -0.7s;
      animation-delay: -0.7s;
    }
    
    @-webkit-keyframes sk-stretchdelay {
      0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
      20% { -webkit-transform: scaleY(1.0) }
    }
    @-webkit-keyframes maskShow {
      0% { background-color: rgba(0,0,0,0); }
      100% { background-color: rgba(0,0,0,.5); }
    }

    @-webkit-keyframes loadingView {
      0% { transform: scale(0); }
      100% { transform: scale(1); }
    }
    @keyframes sk-stretchdelay {
      0%{
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
        background-color: rgba(0,0,0,0);
      }
      20% { 
        transform: scaleY(1.0);
        -webkit-transform: scaleY(1.0);
        background-color: rgba(0,0,0,.7);
      }
      40% { 
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
        background-color: rgba(0,0,0,.5);
      }  
      100% { 
       transform: scaleY(0.4);
       -webkit-transform: scaleY(0.4);
       background-color: rgba(0,0,0,0);
     }  
    }
      `
    document.head.appendChild(style)
  }

  static createDom() {
    const div = document.createElement('div')
    // 遮罩层
    const mask = document.createElement('div')

    mask.id = 'loadingMask'
    mask.style.display = 'none'
    div.id = 'spinnerLoading'

    for (let i = 0; i < 6; i++) {
      const child = document.createElement('div')

      child.className = `rect${i + 1}`
      div.appendChild(child)
    }
    mask.appendChild(div)
    document.body.appendChild(mask)
    this.dom = mask
  }

  static {
    this.createStyle()
    this.createDom()
  }

  static set isShow(val: boolean) {
    if (val) {
      this.dom.style.display = 'flex'
    } else {
      this.dom.style.display = 'none'
    }

    this.showStatus = val
  }

  static get isShow() {
    return this.showStatus
  }

  static show(time = 0) {
    if (time) {
      return setTimeout(() => {
        this.hide()
      }, time)
    }
    if (this.isShow) return

    this.isShow = true
  }

  // 如果传入参数则立即关闭，否则延迟关闭
  static hide(now = false) {
    if (!this.isShow) return
    if (!now) {
      if (this.isDelayClose) clearTimeout(this.isDelayClose)

      this.isDelayClose = setTimeout(() => {
        this.isShow = false
      }, 500)

      return
    }

    this.isShow = false
  }
}
