import './GDpayAlert.scss'

class GDpayAlert {
  private readonly content: string
  private readonly onConfirm: ((instance: GDpayAlert) => void) | undefined
  private readonly onCancel: ((instance: GDpayAlert) => void) | undefined
  private alert: HTMLElement
  private mask: HTMLElement
  private container: HTMLElement
  private confirmButton: HTMLButtonElement
  private cancelButton: HTMLButtonElement
  private readonly confirmButtonText: string
  private readonly cancelButtonText: string

  constructor(props) {
    this.content = props.content
    this.confirmButtonText = props.confirmButtonText || '是'
    this.cancelButtonText = props.cancelButtonText || '否'
    this.onConfirm = props.onConfirm
    this.onCancel = props.onCancel
    this.init()
  }

  private init() {
    this.alert = document.createElement('div')
    this.alert.className = 'gdpay-alert'

    this.container = document.createElement('div')
    this.container.className = 'gdpay-alert-main'
    const content = document.createElement('div')
    content.className = 'gdpay-alert-container'
    this.container.append(content)
    content.innerHTML = this.content

    this.mask = document.createElement('div')
    this.mask.className = 'gdpay-alert-mask'

    const buttonGroup = document.createElement('div')
    buttonGroup.className = 'gdpay-alert-button-group'
    this.confirmButton = document.createElement('button')
    this.confirmButton.className = 'gdpay-alert-button gdpay-alert-button-primary'
    this.confirmButton.innerText = this.confirmButtonText
    this.confirmButton.addEventListener('click', this.confirmHandle.bind(this))
    this.cancelButton = document.createElement('button')
    this.cancelButton.className = 'gdpay-alert-button'
    this.cancelButton.innerText = this.cancelButtonText
    this.cancelButton.addEventListener('click', this.cancelHandle.bind(this))
    buttonGroup.append(this.confirmButton)
    buttonGroup.append(this.cancelButton)

    this.container.append(buttonGroup)
    this.alert.append(this.container)
    this.alert.append(this.mask)
  }

  private confirmHandle() {
    this.onConfirm ? this.onConfirm?.(this) : this.close()
  }

  private cancelHandle() {
    this.onCancel ? this.onCancel?.(this) : this.close()
  }

  show() {
    this.alert.classList.add('animation')
    document.body.appendChild(this.alert)
  }

  private animationendHandle() {
    document.body.removeChild(this.alert)
    this.container.removeEventListener('animationend', this.animationendHandle.bind(this))
  }

  close() {
    this.container.addEventListener('animationend', this.animationendHandle.bind(this))
    this.alert.classList.add('leave')
  }
}

export default function alert(
  content: string,
  onConfirm?: (instance: GDpayAlert) => void,
  onClose?: (instance: GDpayAlert) => void
) {
  new GDpayAlert({ content, onConfirm, onClose }).show()
}
