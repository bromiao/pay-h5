import 'amfe-flexible'
import './index.scss'

import alert from '../assets/lib/GDpayAlert'

const tagGroup = document.querySelector('.amount-tab')
const amountInput = document.getElementById('amount-input') as HTMLInputElement
const submitButton = document.getElementById('submit-button')
const buyButton = document.getElementById('buy-button')

tagGroup.addEventListener('click', e => {
  const target = e.target as HTMLElement
  if (target.tagName == 'li'.toUpperCase()) {
    const children = target.parentNode.children
    for (let i = 0; i < children.length; i++) {
      children[i].classList.remove('amount-tab__item--active')
    }
    target.classList.add('amount-tab__item--active')
  }
})

amountInput.addEventListener('input', e => {
  const value = (e.target as HTMLInputElement).value
  ;(e.target as HTMLInputElement).value = value.replace(new RegExp(/[^0-9]/g, 'ig'), '')
})

submitButton.addEventListener('click', () => {
  let amount: string
  const fillValue = amountInput.value
  const active = tagGroup.querySelector('.amount-tab__item--active') as HTMLElement
  if ((!fillValue || fillValue === '0') && active) {
    amount = active.dataset.value
  } else {
    amount = fillValue
  }
  console.log(amount)
  alert('GDB币余额不足，是否前往购买')
})

buyButton.addEventListener('click', () => {
  alert('前往GDpay购买GDB')
})
