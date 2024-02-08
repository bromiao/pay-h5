<script setup lang="ts">
import { getMoneyWithdrawApi } from '@/apis/user'
import info from '@/assets/images/common/info.png'
import warning from '@/assets/images/common/warning.png'
import { useAppBar } from '@/components/AppBar/useAppBar'
import { useAuthStore } from '@/store/modules/auth'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell/buySell'
import { useCommonStore } from '@/store/modules/common'
import { useEntryStore } from '@/store/modules/entry'
import { withdrawddresslist as IWithdrawddressList } from '@/store/types/buySellCoin'
import { IMoneyWithdraw } from '@/store/types/coin'
import mitt from '@/utils/mitt'
import { requireImg } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { computed, nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
useAppBar({ mode: 'dark' })
const router = useRouter()
const coinBuySellStore = useCoinBuySellStore()
const { getWithdrawddresslist } = coinBuySellStore
const { withdrawddresslist } = storeToRefs(coinBuySellStore)

const authStore = useAuthStore()
const { getUserCoin } = authStore
const { coins } = storeToRefs(authStore)

const commonStore = useCommonStore()

const EntryStore = useEntryStore()
const { config } = storeToRefs(EntryStore)

// 扣款相关条目配置数据
const withDrawCoins = ref([
  { label: '手续费(2%)', value: '0.00' },
  { label: '实际扣款', value: '0.00' },
  { label: '最小提现', value: '0.00' },
  { label: '最大提现', value: '0.00' }
])
// 提币数量输入
const withDrawCoinsAmount = ref('')
const isLoading = ref(true)

const isConfirmDialog = ref(false)
// 支付密码输入
const pay_pass = ref('')
// 数字键盘显示
const showKeyboard = ref(false)
// USDT弹层切换显示
const showUSDTCardSheet = ref(false)

// ref节点引用
const payPass = ref()
const numberKeyboard = ref()

// USDT币种协议，地址等信息
const withdrawCoinInfo = ref<IWithdrawddressList>({} as IWithdrawddressList)

// 图片资源域名
const imgserver_url = computed(() => {
  // console.log('(imgserver_url',(config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v);
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v || ''
})
// USDT币种信息
const coinInfo = computed(() => coins.value?.find(item => item.mtype === 2))
// usdt卡列表
const usdtCardList = computed(() => {
  const list =
    withdrawddresslist.value?.filter(
      item => item.coin_protocol === 'USDT_TRC20' && item.status === 1
    ) ?? []
  list.sort((l1, l2) => l1.def_card - l2.def_card)

  return list
})
// 最大可提币数量(扣减手续费后)
const maxAvailableWithdraw = computed(
  () => +coinInfo.value!.available_coincash / (1 + +coinInfo.value!.coinset_config!.fee_withdraw)
)

const slectMenu = (item: IWithdrawddressList) => {
  withdrawCoinInfo.value = item
  showUSDTCardSheet.value = false
}

// 修正光标位置
const updateCursorPos = (onlyUpdateValue = false) => {
  setTimeout(() => {
    let amountInputEl = document.querySelector('.amount-input input') as HTMLInputElement

    if (amountInputEl) {
      amountInputEl.value = withDrawCoinsAmount.value

      if (onlyUpdateValue) {
        // 释放dom引用
        amountInputEl = null as any
        return
      }

      // 光标开始处
      amountInputEl.selectionStart = withDrawCoinsAmount.value.length
      // 光标结束处
      amountInputEl.selectionEnd = withDrawCoinsAmount.value.length
      // 释放dom引用
      amountInputEl = null as any
    }
  }, 20)
}

// 更新USDT提币地址信息
watch(withdrawddresslist, (val, oldVal) => {
  withdrawCoinInfo.value = withdrawddresslist.value?.find(
    item => item.coin_protocol === 'USDT_TRC20' && item.def_card === 1
  ) as IWithdrawddressList
})

// 输入内容修正
watch(withDrawCoinsAmount, (val, oldVal) => {
  // 小数点开头，自动补齐0.
  if (val === '.' || val.startsWith('00')) {
    withDrawCoinsAmount.value = '0.'
    updateCursorPos()
    return
  }

  // 00开头变为0
  if (oldVal && val.startsWith('0')) {
    withDrawCoinsAmount.value = '0'
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

    withDrawCoinsAmount.value = newAmount
    updateCursorPos(true)
    return
  }

  // 提币输入超过最大提币数量时，变为最大可提币输入
  if (+val > +maxAvailableWithdraw.value) {
    withDrawCoinsAmount.value = maxAvailableWithdraw.value.toTruncFixed(2)
    updateCursorPos()
  }
})

// 更新扣款相关条目数据
watchEffect(() => {
  // 手续费费率
  const withdrawFeeRate = +coinInfo.value!.coinset_config!.fee_withdraw
  // 手续费
  const withdrawFee = (+(withDrawCoinsAmount.value || 0) * withdrawFeeRate).toTruncFixed(2)
  // 实际扣款
  const actualDebuction = (+(withDrawCoinsAmount.value ?? 0) * (1 + withdrawFeeRate)).toTruncFixed(
    2
  )
  // 最小提现
  const minWithdraw = (+coinInfo.value!.coinset_config!.min_withdraw).toTruncFixed(2)
  // 最大提现
  const maxWithdraw = (+coinInfo.value!.coinset_config!.max_withdraw).toTruncFixed(2)

  withDrawCoins.value = [
    {
      label: `手续费(${withdrawFeeRate * 100}%)`,
      value: withdrawFee
    },
    { label: '实际扣款', value: actualDebuction },
    { label: '最小提现', value: minWithdraw },
    { label: '最大提现', value: maxWithdraw }
  ]
})

// 最大提币数量
const onMaxAmount = () => {
  withDrawCoinsAmount.value = maxAvailableWithdraw.value.toTruncFixed(2)
}

// 确定/绑定地址
const onSubmit = () => {
  if (withdrawCoinInfo.value?.coin_address) {
    // 未输入
    if (!withDrawCoinsAmount.value) {
      showToast({
        message: '请输入提币数量',
        icon: info,
        iconSize: '48px'
      })
      return
    }

    // 不满足最小提现
    if (withDrawCoinsAmount.value < coinInfo.value!.coinset_config!.min_withdraw) {
      showToast({
        message: '提现数量小于最小提现',
        icon: info,
        iconSize: '48px'
      })
      return
    }

    // 余额不足
    if (
      +coinInfo.value!.available_coincash < +withDrawCoins.value[1].value ||
      !+coinInfo.value!.available_coincash
    ) {
      showToast({
        message: '余额不足',
        icon: warning,
        iconSize: '48px'
      })
      return
    }

    isConfirmDialog.value = true
    showKeyboard.value = true

    nextTick(() => {
      payPass.value?.focus()
      payPass.value?.click?.()

      payPass.value.$el.querySelector('input[type=password]').focus()
    })
  } else {
    router.push('/usdt')
  }
}

// 数字键盘位置修正
const onNumberKeyboardShow = () => {
  mitt.emit('number-keyboard-show')
}

const onFocus = () => {
  showKeyboard.value = true
}

const onCloseAuthConfirm = () => {
  isConfirmDialog.value = false
  showKeyboard.value = false
  pay_pass.value = ''
}

// 支付确认
const onConfirmPayPass = async () => {
  if (pay_pass.value.length < 6) {
    showToast({
      message: '请输入6位支付密码',
      icon: info,
      iconSize: '48px'
    })
    return
  }

  try {
    commonStore.setShowLoading(true)
    const res = await getMoneyWithdrawApi({
      money: withDrawCoinsAmount.value,
      id: withdrawCoinInfo.value!.id,
      coin_address: withdrawCoinInfo.value!.coin_address,
      passwd: pay_pass.value
    })

    if ((res as IMoneyWithdraw).orderID) {
      mitt.emit('dialog-tips', {
        title: '提示',
        content: '您的提现信息提交成功，请等待客服审核。',
        confirmButtonText: '确定',
        confirmAction: () => {
          router.push('/details/coin-details/usdt')
        }
      })
    } else {
      onCloseAuthConfirm()
    }
  } catch (error) {
    console.error(error)
  } finally {
    commonStore.setShowLoading(false)
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

// 初始化请求数据
const getInitData = async () => {
  try {
    isLoading.value = true
    if (!coins.value.length) {
      getUserCoin({})
    }
    getWithdrawddresslist({})
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    initAmountEvent()
  }
}

onMounted(() => {
  getInitData()
  mitt.emit('number-keyboard-show')
  mitt.emit('action-sheet-show')
})
</script>

<template>
  <div class="withdraw-coins-container">
    <div class="blue-bg-container"></div>
    <div class="main-content-container flex flex-col justify-between items-center">
      <div class="wallet-container flex flex-col justify-center items-center">
        <div class="available-text">可用余额</div>
        <div>
          <span class="money">{{ (+(coinInfo?.available_coincash ?? '0')).toTruncFixed(2) }}</span>
          <span class="usdt-text">USDT</span>
        </div>
      </div>

      <template v-if="!isLoading">
        <template v-if="withdrawCoinInfo?.coin_address">
          <div class="protocols-address-container">
            <div class="item-row item-title-row flex justify-between items-center">
              <div class="label">提现信息</div>
              <div
                v-if="usdtCardList.length > 1"
                class="value toggle-select-text"
                @click="showUSDTCardSheet = true"
              >
                选择
              </div>
            </div>
            <div class="item-row flex justify-between items-center">
              <div class="label">昵称</div>
              <div class="value">{{ withdrawCoinInfo?.account_bank_realname }}</div>
            </div>
            <div class="item-row flex justify-between items-center">
              <div class="label">协议</div>
              <div class="value">{{ withdrawCoinInfo?.coin_protocol ?? 'USDT_TRC20' }}</div>
            </div>
            <div class="item-row flex justify-between items-center">
              <div class="label">提现地址</div>
              <div class="value">{{ withdrawCoinInfo?.coin_address ?? '--' }}</div>
            </div>
          </div>

          <div class="withdraw-coins-info-container">
            <div class="withdraw-coins-amount-text">提币数量</div>
            <div class="input-container flex justify-between items-center">
              <!-- 允许输入数字，调起带符号的纯数字键盘 -->
              <van-field
                v-model="withDrawCoinsAmount"
                type="number"
                placeholder="请输入提币数量"
                class="amount-input"
              />
              <div class="coin-unit">USDT</div>
              <div
                class="max-amount"
                @click="onMaxAmount"
              >
                最大
              </div>
            </div>
            <div
              v-for="(item, index) in withDrawCoins"
              :key="index"
              class="row-item flex justify-between items-center"
            >
              <div class="label">{{ item.label }}</div>
              <div class="value">
                {{ item.value }}
                <span>USDT</span>
              </div>
            </div>
          </div>
        </template>

        <div
          v-else
          class="bind-address-tips"
        >
          请先绑定提币地址
        </div>
      </template>

      <div class="withdraw-coins-tips">需要注意提币地址的最低充值金额，否则提现不会到账</div>
      <div
        class="btn-submit text-center"
        @click="onSubmit"
      >
        {{ withdrawCoinInfo?.coin_address ? '确定' : '绑定地址' }}
      </div>
    </div>

    <van-dialog
      v-model:show="isConfirmDialog"
      title="身份验证"
      theme="round-button"
      className="dialog-auth"
    >
      <i
        class="icon-close close-dark block"
        @click="onCloseAuthConfirm"
      ></i>
      <div>
        <van-field
          v-model="pay_pass"
          ref="payPass"
          placeholder="请输入支付密码"
          type="number"
          :maxlength="6"
          clickable
          @touchstart.stop="onFocus"
          @focus="onFocus"
        />
      </div>

      <template #footer>
        <div
          class="btn-confirm flex items-center justify-center"
          @click="onConfirmPayPass"
        >
          提交
        </div>
      </template>
    </van-dialog>

    <!-- USDT选择弹层 -->
    <van-action-sheet
      v-model:show="showUSDTCardSheet"
      description="USDT提现地址"
      class="!w-[750px] usdt-sheet full-w-sheet"
      :lazy-render="false"
    >
      <div
        class="item-card flex justify-between items-center"
        v-for="(item, index) in usdtCardList"
        @click="slectMenu(item)"
        :key="item.id"
      >
        <van-image
          lazy-load
          class="usdt-icon"
          :src="requireImg('common/usdt-icon.png')"
        />
        <div class="pt-[5px] ml-[23px] mr-[auto]">
          <p class="text-[28px] text-[#343434]">
            {{ item.coin_protocol }}
          </p>
          <p class="text-[28px] text-[#979595]">{{ item.account_bank_realname }}</p>
        </div>
        <van-image
          v-if="item.id == withdrawCoinInfo.id"
          class="toggle-container mr-[15px]"
          :src="requireImg('common/success.png')"
        />
        <van-image
          v-else
          class="toggle-container mr-[15px]"
          :src="requireImg('common/hui.png')"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.withdraw-coins-container {
  width: 100%;
  height: 100%;
  background-color: #ebf1f6;
  .blue-bg-container {
    width: 100%;
    height: 145px;
    background-color: var(--van-button-primary-background);
  }
  .main-content-container {
    width: 100%;
    height: calc(100% - 145px);
    padding: 0 21px 40px 21px;
  }
  .wallet-container {
    width: 100%;
    height: 278px;
    margin-top: -132px;
    border-radius: 14px;
    background-color: #fff;
    .available-text {
      margin-bottom: 20px;
      font-size: 26px;
      color: #787f8c;
    }
    .money {
      font-size: 49px;
      font-weight: bold;
      color: #13161b;
    }
    .usdt-text {
      margin-left: 17px;
      font-size: 49px;
      color: #868d9a;
    }
  }

  .protocols-address-container {
    width: 100%;
    margin: 21px 0;
    padding: 0 21px;
    background-color: #fff;
    font-size: 25px;
    border-radius: 14px;
    .item-row {
      width: 100%;
      height: 70px;
    }
    .item-title-row {
      .label {
        color: #13161b;
        font-size: 28px;
      }
      .toggle-select-text {
        color: #2aaef2;
      }
    }
    .label {
      color: #787f8c;
    }
    .value {
      color: #13161b;
    }
  }

  .withdraw-coins-info-container {
    width: 100%;
    height: auto;
    background-color: #fff;
    border-radius: 14px;
    .withdraw-coins-amount-text {
      margin: 27px 0 20px 0;
      padding-left: 20px;
      font-size: 28px;
      color: #13161b;
    }
    .row-item {
      padding: 0 21px;
    }
    .input-container {
      margin: 0 21px 20px 21px;
      padding: 0 18px;
      background-image: linear-gradient(#ebf1f6, #ebf1f6);
      font-size: 25px;
      border-radius: 7px;
      .amount-input {
        flex: 1;
        padding-left: 0;
        background-color: #ebf1f6;
      }
      .coin-unit {
        margin: 0 28px;
        color: #868d9a;
      }
      .max-amount {
        color: var(--van-button-primary-background);
      }
    }
    .row-item {
      width: 100%;
      height: 70px;
      font-size: 25px;
      .label {
        color: #787f8c;
      }
      .value {
        color: #13161b;
        span {
          margin-left: 2px;
        }
      }
    }
  }

  .bind-address-tips {
    flex: 1;
    margin-top: 70px;
    font-size: 25px;
    color: #666;
  }

  .withdraw-coins-tips {
    margin: auto 0 21px 0;
    font-size: 25px;
    color: #ff0000;
  }
  .btn-submit {
    width: 669px;
    height: 80px;
    line-height: 80px;
    font-size: 31px;
    background-color: var(--van-button-primary-background);
    color: #fff;
    border-radius: 7px;
  }

  :deep(.dialog-auth) {
    width: 708px;
    height: auto;
    padding: 40px;
    .van-dialog__header {
      padding: 0;
      font-size: 29px;
      color: #13161b;
    }
    .van-dialog__content {
      margin: 33px 0 35px 0;
      font-size: 25px;
      color: #787f8c;
      text-align: justify;
      .van-field {
        background-color: #ebf1f6;
      }
    }
    .van-dialog__footer {
      padding: 0;
    }
    .van-dialog__confirm,
    .btn-confirm {
      width: 100%;
      height: 80px;
      font-size: 31px;
      background: var(--van-button-primary-background);
      color: #fff;
      border: 0;
      border-radius: 8px;
    }
    .icon-close {
      position: absolute;
      right: 40px;
      top: 24px;
    }
    img {
      width: 100%;
      margin-top: 20px;
    }
  }

  :deep(.usdt-sheet) {
    // padding-bottom: 15px;
    .van-action-sheet__description {
      padding: 30px 18px;
      font-size: 33px;
      font-weight: bold;
      color: #343434;
      &::after {
        left: 18px;
        right: 18px;
        border-color: #d9d8d8;
      }
    }
    .van-action-sheet__content {
      padding: 0 18px;
    }
    .item-card {
      margin: 0 13px 0 27px;
      height: 90px;
      border-bottom: rgba($color: #efeeee, $alpha: 0.5) 1px solid;
      &:last-child {
        border-bottom: 0;
      }
    }
    .toggle-container {
      width: 39px;
      height: 39px;
    }
    .usdt-icon {
      width: 53px;
      height: 53px;
      border-radius: 50%;
      overflow: hidden;
    }
  }

  .van-number-keyboard {
    .icon-delete-container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
