import './GDpayCompSlider.scss'

type GDpayCompSliderProps = {
  min?: number
  max?: number
  value?: number
  onChange?: (val) => void
  minLabel?: string | HTMLElement
  maxLabel?: string | HTMLElement
  minLabelFormatter?: (val: number) => string
  maxLabelFormatter?: (val: number) => string
}

class GDpayCompSlider {
  private dom: HTMLElement
  private readonly minLabelDom: HTMLElement
  private readonly maxLabelDom: HTMLElement
  private readonly minLabelFormatter: (val: number) => string
  private readonly maxLabelFormatter: (val: number) => string
  private width: number
  private readonly min: number
  private readonly max: number
  private value: number
  private readonly onChange: (val) => void

  private wrapper: HTMLElement
  private slider: HTMLElement
  private sliderBar: HTMLElement
  private sliderButton: HTMLElement

  private start: number
  private current: number
  private percent: number

  constructor(dom: string | HTMLElement, props?: GDpayCompSliderProps) {
    if (typeof dom === 'string') {
      this.dom = document.querySelector(dom)
    } else {
      this.dom = dom
    }
    if (props.minLabel) {
      this.minLabelFormatter = props?.minLabelFormatter
      if (typeof props.minLabel === 'string') {
        this.minLabelDom = document.querySelector(props.minLabel)
      } else {
        this.minLabelDom = props.minLabel
      }
    }
    if (props.maxLabel) {
      this.maxLabelFormatter = props?.maxLabelFormatter
      if (typeof props.maxLabel === 'string') {
        this.maxLabelDom = document.querySelector(props.maxLabel)
      } else {
        this.maxLabelDom = props.maxLabel
      }
    }
    this.min = props?.min || 0
    this.max = props?.max || 100
    this.value = props?.value || 0
    this.onChange = props?.onChange || new Function()
    this.init()
    this.initLabel()
  }

  private initLabel() {
    if (this.minLabelDom) {
      if (this.minLabelFormatter) {
        this.minLabelDom.innerText = this.minLabelFormatter(this.min)
      } else {
        this.minLabelDom.innerText = this.min.toString()
      }
    }
    if (this.maxLabelDom) {
      if (this.maxLabelFormatter) {
        this.maxLabelDom.innerText = this.maxLabelFormatter(this.max)
      } else {
        this.maxLabelDom.innerText = this.max.toString()
      }
    }
  }

  private init() {
    this.wrapper = document.createElement('div')
    this.wrapper.className = 'gdpay-comp-slider-wrapper'

    this.slider = document.createElement('div')
    this.slider.className = 'gdpay-com-slider'

    this.sliderBar = document.createElement('div')
    this.sliderBar.className = 'gdpay-com-slider-bar'

    this.sliderButton = document.createElement('div')
    this.sliderButton.className = 'gdpay-com-slider-button'

    this.sliderBar.append(this.sliderButton)
    this.slider.append(this.sliderBar)
    this.wrapper.append(this.slider)
    this.dom.append(this.wrapper)

    this.width = this.slider.offsetWidth
    this.setValue()
    this.setCurrent()
    this.bindEvent()
  }

  private bindEvent() {
    this.slider.addEventListener('click', e => {
      const { offsetX } = e
      this.percent = (offsetX / this.width) * 100
      this.sliderBar.style.width = `${this.percent}%`
      this.getValue()
      this.setCurrent()
    })
    this.sliderButton.addEventListener('touchstart', this.onMousedown)
    this.sliderButton.addEventListener('mousedown', this.onMousedown)
  }

  private onMousedown = e => {
    let position = 0
    if (e.type === 'touchstart') {
      const touch = e.touches[0] || e.changedTouches[0]
      position = touch.pageX
    } else if (e.type === 'mousedown') {
      position = e.clientX
    }
    this.start = position
    document.addEventListener('touchmove', this.onMousemove)
    document.addEventListener('touchend', this.onMouseup)
    document.addEventListener('mousemove', this.onMousemove)
    document.addEventListener('mouseup', this.onMouseup)
  }

  private onMouseup = () => {
    document.body.style.overflow = ''
    this.setCurrent()
    document.removeEventListener('touchmove', this.onMousemove)
    document.removeEventListener('touchend', this.onMouseup)
    document.removeEventListener('mousemove', this.onMousemove)
    document.removeEventListener('mouseup', this.onMouseup)
  }

  private onMousemove = e => {
    document.body.style.overflow = 'hidden'
    let position = 0
    if (e.type === 'touchmove') {
      const touch = e.touches[0] || e.changedTouches[0]
      position = touch.pageX
    } else if (e.type === 'mousemove') {
      position = e.clientX
    }
    const move = position - this.start
    this.percent = this.current + (move / this.width) * 100
    this.sliderBar.style.width = `${this.percent}%`
    this.getValue()
  }

  private setCurrent() {
    const barPosition = this.sliderBar.offsetWidth
    this.current = Math.floor((barPosition / this.width) * 100)
  }

  private setValue() {
    if (!this.value) {
      return
    }
    this.validValue()
    const percent = Math.floor(((this.value - this.min) / (this.max - this.min)) * 100)
    this.sliderBar.style.width = `${percent}%`
  }

  private getValue() {
    this.value = Math.floor(this.min + (this.max - this.min) * (this.percent / 100))
    this.validValue()
    this.onChange(this.value)
  }

  private validValue() {
    if (this.value > this.max) {
      this.value = this.max
    } else if (this.value < this.min) {
      this.value = this.min
    }
  }

  sliderTo(value: number) {
    this.validValue()
    this.value = value
    this.setValue()
    this.setCurrent()
    this.onChange(this.value)
  }
  sliderToMax() {
    this.validValue()
    this.value = this.max
    this.setValue()
    this.setCurrent()
    this.onChange(this.value)
  }
}

export default GDpayCompSlider
