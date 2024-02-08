import 'amfe-flexible'
import './index.scss'
import GDpayCompSlider from '../assets/lib/GDpayCompSlider'

function debounce(fn, wait) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}

const maxButton = document.getElementById('max-button')
const amountFiled = document.getElementById('amount-filed') as HTMLInputElement
const submitButton = document.getElementById('submit-button') as HTMLButtonElement

const slider = new GDpayCompSlider('#slider', {
  min: 30,
  max: 10000,
  minLabel: '#slider-label-min',
  maxLabel: '#slider-label-max',
  minLabelFormatter: val => `最小金额：${val}`,
  maxLabelFormatter: val => `最大金额：${val}`,
  onChange: val => {
    amountFiled.value = val
  }
})

const sliderTo = debounce(val => {
  slider.sliderTo(val as number)
}, 300)

maxButton.addEventListener('click', () => {
  slider.sliderToMax()
})

amountFiled.addEventListener('input', e => {
  const value = (e.target as HTMLInputElement).value
  const newValue = value.replace(new RegExp(/[^0-9]/g, 'ig'), '')
  ;(e.target as HTMLInputElement).value = newValue
  sliderTo(newValue)
})

submitButton.addEventListener('click', () => {
  const amount = amountFiled.value
  console.log(amount)
})
