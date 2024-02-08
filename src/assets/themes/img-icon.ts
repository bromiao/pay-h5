const isEnv = process.env.NODE_ENV === 'dev'

export const def = {
  'sprite-001': isEnv
    ? 'url("/src/assets/images/sprite-s001.png")'
    : 'url("/assets/sprite-s001.png")'
}

export const ofupay = {
  'sprite-001': isEnv
    ? 'url("/src/assets/images/merchant/ofupay/ofupay-sprite-001.png")'
    : 'url("/assets/ofupay-sprite-001.png")'
}

export default {
  def,
  ofupay
}
