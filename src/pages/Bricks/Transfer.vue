<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import transfer01 from '@/assets/images/bricks/transfer01.png'
import transfer02 from '@/assets/images/bricks/transfer02.png'
import KGB01 from '@/assets/images/bricks/KGB01.png'
import USDT01 from '@/assets/images/bricks/USDT01.png'
import { useAuthStore } from '@/store'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import info from '@/assets/images/common/info.png'
import success from '@/assets/images/common/success.png'
import { getMoneyExchargeApi } from '@/apis/user'

const authStore = useAuthStore()
const { getUserCoin } = authStore
const { coins } = storeToRefs(authStore)

const route = useRoute()

// 路由参数对应划转币种映射表
const routeParamsMap = {
  'kgb-to-usdt': {
    mtype: 30,
    unit: 'CNY'
  },
  'usdt-to-kgb': {
    mtype: 2,
    unit: 'USDT'
  }
} as Record<string, any>

const [from, to] = (route.params.coin as string).split('-to-')

// 币种划转映射表
const transferMap = ref({
  from: routeParamsMap[from + '-to-' + to],
  to: routeParamsMap[to + '-to-' + from]
})
// 划转条目信息
const transferCoinsInfo = ref([
  { label: '可用金额', value: '0.00' },
  { label: '手续费(0%)', value: '0.00' },
  { label: '当前汇率', value: '0.00' },
  { label: '划转获得', value: '0.00' },
  { label: '最小划转数量', value: '0.00' }
])
// 划转数量
const transferCoinsAmount = ref('')
const inputAmount = ref()

// 币种信息
const coinInfo = computed(() =>
  coins.value?.find(item => item.mtype === transferMap.value.from.mtype)
)
// 转换目标币种信息
const toCoinInfo = computed(() =>
  coins.value?.find(item => item.mtype === transferMap.value.to.mtype)
)
// 当前汇率
const currExchangeRate = computed(() => {
  const fromCoinPrice = +(coinInfo.value?.coinset_config?.coin_price || 0)
  const toCoinPrice = +(
    coins.value?.find(item => item.mtype === transferMap.value.to.mtype)?.coinset_config
      ?.coin_price || 1
  )

  return (fromCoinPrice / toCoinPrice).toTruncFixed(3)
})
// 最小划转数量
const minTransferAmount = computed(() => {
  if (!coinInfo.value?.coinset_config) return '0.00'

  return (
    +coinInfo.value!.coinset_config!.min_swapto / +coinInfo.value!.coinset_config!.coin_price
  ).toTruncFixed(2)
})
// 最大可划转数量(扣减手续费后)
const maxAvailableTransfer = computed(
  () => +coinInfo.value!.available_coincash / (1 + +coinInfo.value!.coinset_config!.swapto_fee)
)

// 修正光标位置
const updateCursorPos = (onlyUpdateValue = false) => {
  setTimeout(() => {
    let amountInputEl = document.querySelector('.amount-input input') as HTMLInputElement

    if (amountInputEl) {
      amountInputEl.value = transferCoinsAmount.value

      if (onlyUpdateValue) {
        // 释放dom引用
        amountInputEl = null as any
        return
      }

      // 光标开始处
      amountInputEl.selectionStart = transferCoinsAmount.value.length
      // 光标结束处
      amountInputEl.selectionEnd = transferCoinsAmount.value.length
      // 释放dom引用
      amountInputEl = null as any
    }
  }, 20)
}

// 输入内容修正
watch(transferCoinsAmount, (val, oldVal) => {
  // 小数点开头，自动补齐0.
  if (val === '.' || val.startsWith('00')) {
    transferCoinsAmount.value = '0.'
    updateCursorPos()
    return
  }

  // 00开头变为0
  if (oldVal && val.startsWith('0')) {
    transferCoinsAmount.value = '0'
  }

  // 小数位数保留2位
  const dotIndex = val.indexOf('.')
  if (~dotIndex) {
    const str = val.slice(dotIndex + 1, val.length)
    const replacer = (match: string, p1: string, p2: string) => {
      if (p1.startsWith('0') && +p1 > 0) {
        return '0'
      }
      return p1 + '.' + p2
    }
    const newAmount = val.replace(/^(\d+)\.(\d\d).*$/, replacer)

    transferCoinsAmount.value = newAmount
    updateCursorPos(true)
    return
  }

  // 提币输入超过最大提币数量时，变为最大可提币输入
  if (+val > +maxAvailableTransfer.value) {
    transferCoinsAmount.value = maxAvailableTransfer.value.toTruncFixed(2)
    updateCursorPos()
  }
})

// 更新划转相关条目配置数据
watchEffect(() => {
  // 手续费费率
  const swaptoFeeRate = +(coinInfo.value?.coinset_config?.swapto_fee || 0)
  // 手续费
  const swaptoFee = (+(transferCoinsAmount.value || 0) * swaptoFeeRate).toTruncFixed(2)
  // 可用金额
  const availableCoincash = (+coinInfo.value!.available_coincash).toTruncFixed(2)
  // 划转获得
  const finalCoincash = (+currExchangeRate.value * +(transferCoinsAmount.value || 0)).toTruncFixed(
    2
  )

  transferCoinsInfo.value = [
    { label: '可用金额', value: availableCoincash },
    {
      label: `手续费(${swaptoFeeRate * 100}%)`,
      value: swaptoFee
    },
    {
      label: '当前汇率',
      value: currExchangeRate.value
    },
    {
      label: '划转获得',
      value: finalCoincash
    },
    {
      label: '最小划转数量',
      value: minTransferAmount.value
    }
  ]
})

// 切换币种划转
const onToggleTransfer = () => {
  transferMap.value = {
    from: transferMap.value.to,
    to: transferMap.value.from
  }
  transferCoinsAmount.value = ''

  // 更新汇率等信息
  getUserCoin({})
}

// 最大划转数量
const onMaxAmount = () => {
  transferCoinsAmount.value = maxAvailableTransfer.value.toTruncFixed(2)
}
// 确认划转
const onSubmit = async () => {
  if (!transferCoinsAmount.value) {
    showToast({
      message: '请输入划转数量',
      icon: info,
      iconSize: '48px'
    })
    return
  }

  if (+transferCoinsAmount.value < +minTransferAmount.value) {
    showToast({
      message: '输入的数量小于最小划转数量',
      icon: info,
      iconSize: '48px'
    })
    return
  }

  try {
    const res = await getMoneyExchargeApi({
      num: transferCoinsAmount.value,
      mtype: transferMap.value.from.mtype,
      coin_name: coinInfo.value!.coin_name,
      to_mtype: transferMap.value.to.mtype,
      to_coin_name: toCoinInfo.value!.coin_name
    })

    if (res['code'] === 0) {
      showToast({
        message: '成功',
        icon: success,
        iconSize: '48px'
      })
      transferCoinsAmount.value = ''
      getUserCoin({})
    }

    inputAmount.value?.focus()
  } catch (error) {
    console.error(error)
  }
}

// 初始化提币输入框绑定事件
const initAmountEvent = () => {
  nextTick(() => {
    // 提币输入框禁止输入特定字符
    const amountInputEl = document.querySelector('.amount-input input') as HTMLInputElement
    if (amountInputEl) {
      amountInputEl.onkeydown = e => {
        if (['-', '+'].includes(e.key)) {
          return e.preventDefault()
        }
      }
    }
  })
}

onMounted(() => {
  getUserCoin({})
  initAmountEvent()
})
</script>

<template>
  <div class="transfer-container flex flex-col justify-between">
    <div class="transfer-toggle-container flex justify-between">
      <div class="from-to flex flex-col justify-between">
        <div>从</div>
        <img :src="transfer01" />
        <div>到</div>
      </div>
      <div
        class="coin-icon-name flex justify-between"
        :class="transferMap.from.mtype === 30 ? 'flex-col' : 'flex-col-reverse'"
      >
        <div class="row-item flex items-center">
          <img :src="KGB01" />
          <div>矿工币</div>
        </div>
        <div class="row-item flex items-center">
          <img :src="USDT01" />
          <div>USDT泰达币</div>
        </div>
      </div>
      <div class="self-center">
        <img
          :src="transfer02"
          class="icon-transfer"
          @click="onToggleTransfer"
        />
      </div>
    </div>

    <div class="transfer-info-container">
      <div class="amount-text">划转数量</div>

      <div class="input-container flex justify-between items-center">
        <!-- 允许输入数字，调起带符号的纯数字键盘 -->
        <van-field
          v-model="transferCoinsAmount"
          ref="inputAmount"
          type="number"
          placeholder="请输入划转数量"
          class="amount-input"
        />
        <div class="coin-unit">{{ transferMap.from.unit }}</div>
        <div
          class="max-amount"
          @click="onMaxAmount"
        >
          全部
        </div>
      </div>

      <div class="item-info-container">
        <div
          v-for="(item, index) in transferCoinsInfo"
          :key="index"
          class="row-item flex justify-between items-center"
        >
          <div class="label">{{ item.label }}</div>
          <div class="value flex items-center">
            <span v-if="index === 2">{{ `1 ${transferMap.from.unit} ≈ ${item.value}` }}</span>
            <span
              v-else
              class="amount"
              :class="{ 'amount-bold': index === 0 }"
            >
              {{ item.value }}
            </span>
            <span class="unit">
              {{ [0, 1, 4].includes(index) ? transferMap.from.unit : transferMap.to.unit }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="btn-submit text-center"
      @click="onSubmit"
    >
      确认划转
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.transfer-container {
  width: 100%;
  height: 100%;
  padding: 0 40px 97px 40px;
  background-color: #fff;
  .transfer-toggle-container {
    width: 100%;
    height: 208px;
    padding: 0 33px 0 80px;
    background-image: linear-gradient(#ebf1f6, #ebf1f6);
    font-size: 25px;
    border-radius: 14px;
    .from-to {
      padding: 30px 0;
      color: #999;
      img {
        width: 22px;
      }
    }
    .coin-icon-name {
      margin: 0 auto 0 84px;
      color: #000;
      .row-item {
        height: 84px;
      }
      img {
        width: 57px;
        height: 57px;
        margin-right: 21px;
      }
    }
    .icon-transfer {
      width: 84px;
      height: 84px;
    }
  }

  .transfer-info-container {
    margin: 40px 0 auto 0;
    .amount-text {
      font-size: 28px;
      color: #333;
    }

    .input-container {
      margin: 10px 0 21px;
      padding: 0 20px;
      background-image: linear-gradient(#ebf1f6, #ebf1f6);
      font-size: 25px;
      border-radius: 7px;
      .amount-input {
        flex: 1;
        padding-left: 0;
        background-color: #ebf1f6;
      }
      .coin-unit {
        margin: 0 22px;
        color: #868d9a;
      }
      .max-amount {
        color: var(--van-button-primary-background);
      }
    }

    .item-info-container {
      padding: 0 21px;
      background-color: #ebf1f6;
      border-radius: 14px;
    }

    .row-item {
      width: 100%;
      height: 70px;
      font-size: 25px;
      background-color: #ebf1f6;
      .label {
        color: #787f8c;
      }
      .value {
        color: #13161b;
        .amount-bold {
          font-size: 33px;
          font-weight: bold;
        }
        .unit {
          margin-left: 6px;
        }
      }
    }
  }

  .btn-submit {
    width: 100%;
    height: 80px;
    line-height: 80px;
    font-size: 31px;
    background-color: var(--van-button-primary-background);
    color: #fff;
    border-radius: 7px;
  }
}
</style>
