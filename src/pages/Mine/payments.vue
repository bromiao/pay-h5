<template>
  <div class="rmb w-100 bg-white">
    <nav-bar
      title="收付款方式"
      mode="blue"
      :hideLeft="false"
      gopath="/mine"
    />
    <div class="blue-bg w-full h-[30px] bg-[var(--van-button-primary-background)]"></div>
    <div
      class="order-content py-[30px] px-[20px] bg-[#fff] mt-[-30px] rounded-t-[15px] h-[calc(100%-50px)] safe-area-inset-bottom overflow-y-scroll"
    >
      <img
        :src="addPaymentBtn"
        alt=""
        class="w-full h-[100px] mb-[40px]"
        @click="showPopup"
      />
      <div
        class="w-full h-[220px] mb-[20px] relative"
        v-for="payment in payment_list"
        :key="payment.title"
        @click="payment.to"
      >
        <img
          :src="payment.bg"
          alt=""
          class="absolute w-full h-full"
        />
        <img
          :src="payment.image"
          alt=""
          class="absolute w-[140px] h-[140px] left-[20px] top-[40px]"
        />
        <div class="title absolute text-white text-[30px] left-[180px] top-[35px] font-bold">
          {{ payment?.coin_protocol === 'BANK' ? payment?.account_bankname : payment?.title }}
        </div>
        <div class="name absolute text-white text-[30px] left-[180px] top-[80px] font-normal">
          {{ payment?.account_bank_realname }}
        </div>
        <div class="address absolute text-[#eee] text-[24px] left-[180px] top-[145px] font-normal">
          {{ payment?.coin_address }}
        </div>
        <div
          :class="`status absolute ${payment.status?.color} text-[24px] right-[20px] top-[35px] font-bold`"
        >
          {{ payment.status?.text }}
          &nbsp; ({{ payment.amount }})
        </div>
        <!-- <van-icon name="delete-o" color="white" size="20" /> -->
      </div>
      <van-popup
        v-model:show="show"
        position="bottom"
        :style="{
          height: 'auto',
          width: '100%',
          margin: '0 auto',
          left: 0,
          right: 0,
          position: 'absolute'
        }"
      >
        <div
          class="popup-title text-black text-[40px] flex items-center justify-center h-[100px] font-bold tracking-widest"
        >
          添加收付款方式
        </div>
        <div class="h-[1px] w-full bg-[#eee]"></div>
        <div class="overflow-y-scroll h-[520px]">
          <div
            class="mx-auto w-[600px]"
            v-for="payment in payment_options"
            :key="payment.title"
            @click="payment.pop_up_to"
          >
            <div class="h-[100px] relative flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex justify-center mr-[15px] w-[120px]">
                  <div
                    v-if="payment.icon.sprite"
                    :class="`${payment.icon.sprite}`"
                  ></div>
                  <img
                    v-else
                    :src="payment.icon.src"
                    alt=""
                    class="w-[60px] block"
                  />
                </div>
                <div class="title text-black text-[30px]">
                  {{ payment?.title }}
                </div>
              </div>
              <div
                :class="`status ${payment.status?.color} text-[24px] right-[20px] top-[35px] font-bold`"
              >
                {{ payment.status?.list_text }}
              </div>
            </div>
            <div class="h-[1px] w-full bg-[#f7f7f7]"></div>
          </div>
        </div>
      </van-popup>
      <!-- <van-dialog v-model:show="dialogContent.show" :title="dialogContent.title" theme="round-button"
        :className="['dialog-deal']" :confirmButtonText="dialogContent.confirmButtonText" @confirm="onConfirm">
        <i class="icon-close block close-dark" @click="onClose"></i>
        <div class="flex flex-col items-center justify-between">
          <img :src="dialogContent.img" :class="!authStore?.userInfo.verified_status ? 'verifi-id' : 'add-card'" />
          <div class="content text-center">{{ dialogContent.content }}</div>
        </div>
      </van-dialog> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
// import { showToast } from 'vant'
import mitt from '@/utils/mitt'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// import info from '@/assets/images/common/info.png'
// import success from '@/assets/images/common/success.png'
import addPaymentBtn from '@/assets/images/mine/add-payment-btn.png'
import zfb from '@/assets/images/mine/alipay_bg.png'
import yhk from '@/assets/images/mine/bank_bg.png'
import szrmb from '@/assets/images/mine/szrmb_bg.png'
import usdt from '@/assets/images/mine/usdt_bg.png'
import wx from '@/assets/images/mine/wx_bg.png'

import zfb_icon from '@/assets/images/mine/alipay.png'
import usdt_icon from '@/assets/images/mine/bb.png'
import szrmb_icon from '@/assets/images/mine/sz.png'
import wx_icon from '@/assets/images/mine/wx.png'
import yhk_icon from '@/assets/images/mine/yhk-icon.png'

// import icon_alipay from '@/assets/images/mine/icon_alipay.png'
// import icon_wx from '@/assets/images/mine/icon_wx.png'
// import icon_bank from '@/assets/images/mine/icon_bank.png'
import icon_usdt from '@/assets/images/mine/icon_usdt.png'
import { useAppBar } from '@/components/AppBar/useAppBar'

useAppBar({ mode: 'dark' })

const router = useRouter()
const authStore = useAuthStore()
// const entryStore = useEntryStore()

// const bind_bank = ref({})
// const bind_wechat = ref({})
// const bind_alipay = ref({})
// const bind_usdt = ref({})
// const bind_rmb = ref({})

const bankCardStatusText = (bank: any) => {
  //   status   DEFAULT '1' COMMENT '1启用  2禁用   -1审核中 ',
  if (bank?.status === 1) {
    return {
      text: '已绑定',
      list_text: '',
      color: 'text-[#fff]'
    }
  }

  if (!bank?.status) {
    return {
      text: '未绑定',
      list_text: '未绑定',
      color: 'text-[#f98434]'
    }
  }

  if (bank?.status === 2) {
    return {
      text: '已禁用',
      list_text: '',
      color: 'text-[#d5515c]'
    }
  }

  if (bank?.status === -1) {
    return {
      text: '审核中',
      list_text: '',
      color: 'text-[#f0c388]'
    }
  }
}

const payment_images: any = {
  ALIPAY: zfb_icon,
  WXPAY: wx_icon,
  BANK: yhk_icon,
  SZRMB: szrmb_icon,
  USDT_TRC20: usdt_icon
}

const payment_bgs: any = {
  ALIPAY: zfb,
  WXPAY: wx,
  BANK: yhk,
  SZRMB: szrmb,
  USDT_TRC20: usdt
}

const payment_ban_bgs: any = {
  ALIPAY: zfb,
  WXPAY: wx,
  BANK: yhk,
  SZRMB: szrmb,
  USDT_TRC20: usdt
}

const payment_tos: any = {
  ALIPAY: () => router.push('/payment_list?way=alipay'),
  WXPAY: () => router.push('/payment_list?way=wxpay'),
  BANK: () => router.push('/payment_list?way=bank'),
  SZRMB: () => router.push('/payment_list?way=szrmb'),
  USDT_TRC20: () => router.push('/payment_list?way=usdt')
}

const payment_icons: any = {
  ALIPAY: {
    sprite: 'ali-pay'
  },
  WXPAY: {
    sprite: 'wechat-pay-03'
  },
  BANK: {
    sprite: 'bank-card'
  },
  SZRMB: {
    sprite: 'szrmb'
  },
  USDT_TRC20: {
    src: icon_usdt
  }
}

const coin = useCoinBuySellStore()

const getPayment = (protocol: string) => {
  console.log(coin?.withdrawddresslist, 'coin?.withdrawddresslist')
  if (
    coin?.withdrawddresslist.filter(address => address.coin_protocol.includes(protocol)).length > 0
  ) {
    return coin?.withdrawddresslist.filter(address => address.coin_protocol.includes(protocol))[0]
  } else {
    console.log(2)
    return {}
  }
}

const payment_options: any = ref([])
const payment_list: any = ref([])
const getPayments = () => {
  // console.log(coin?.withdrawddresslist, 'coin?.withdrawddresslist')
  payment_list.value = payment_options.value
    .map(option => {
      let bank = coin?.withdrawddresslist.find(
        coin => coin.coin_protocol === option.coin_protocol && coin?.def_card === 1
      )
      if (!bank) {
        bank = coin?.withdrawddresslist.find(
          coin => coin.coin_protocol === option.coin_protocol && coin?.def_card === 2
        )
      }
      const amount = coin?.withdrawddresslist.filter(
        coin => coin.coin_protocol === option.coin_protocol
      ).length
      if (bank) {
        return {
          ...bank,
          title: option.title,
          bg:
            bank?.status === 2
              ? payment_ban_bgs[bank.coin_protocol]
              : payment_bgs[bank.coin_protocol],
          status: bankCardStatusText(bank),
          to: payment_tos[bank.coin_protocol],
          icon: payment_icons[bank.coin_protocol],
          image: payment_images[bank.coin_protocol],
          amount
        }
      } else {
        return null
      }
    })
    .filter(item => !!item)
}

const show = ref(false)

const showPopup = () => {
  show.value = true
}

const img = ref('')

const { getWithdrawddresslist } = coin

onMounted(async () => {
  await authStore.getUserInfo()
  getPayments()

  getWithdrawddresslist({}).then(() => {
    payment_options.value = [
      {
        coin_protocol: 'BANK',
        title: '银行卡',
        status: bankCardStatusText(getPayment('BANK')),
        to: payment_tos['BANK'],
        pop_up_to: () => {
          const amount = coin?.withdrawddresslist.filter(
            coin => coin.coin_protocol === 'BANK'
          ).length
          if (amount > 0) {
            router.push('payment_list?way=bank')
          } else {
            router.push('/bank_card')
          }
        },
        icon: payment_icons['BANK']
      },
      {
        coin_protocol: 'WXPAY',
        title: '微信',
        status: bankCardStatusText(getPayment('WXPAY')),
        to: payment_tos['WXPAY'],
        pop_up_to: () => {
          const amount = coin?.withdrawddresslist.filter(
            coin => coin.coin_protocol === 'WXPAY'
          ).length
          if (amount > 0) {
            router.push('payment_list?way=wxpay')
          } else {
            router.push('/wechat')
          }
        },
        icon: payment_icons['WXPAY']
      },
      {
        coin_protocol: 'ALIPAY',
        title: '支付宝',
        status: bankCardStatusText(getPayment('ALIPAY')),
        to: payment_tos['ALIPAY'],
        pop_up_to: () => {
          const amount = coin?.withdrawddresslist.filter(
            coin => coin.coin_protocol === 'ALIPAY'
          ).length
          if (amount > 0) {
            router.push('payment_list?way=alipay')
          } else {
            router.push('/alipay')
          }
        },
        icon: payment_icons['ALIPAY']
      },
      {
        coin_protocol: 'SZRMB',
        title: '数字人民币',
        status: bankCardStatusText(getPayment('SZRMB')),
        to: payment_tos['SZRMB'],
        pop_up_to: () => {
          const amount = coin?.withdrawddresslist.filter(
            coin => coin.coin_protocol === 'SZRMB'
          ).length
          if (amount > 0) {
            router.push('payment_list?way=szrmb')
          } else {
            router.push('/rmb')
          }
        },
        icon: payment_icons['SZRMB']
      },
      {
        coin_protocol: 'USDT_TRC20',
        title: 'USDT',
        status: bankCardStatusText(getPayment('USDT_TRC20')),
        to: payment_tos['USDT_TRC20'],
        pop_up_to: () => {
          const amount = coin?.withdrawddresslist.filter(
            coin => coin.coin_protocol === 'USDT_TRC20'
          ).length
          if (amount > 0) {
            router.push('payment_list?way=usdt')
          } else {
            router.push('/usdt')
          }
        },
        icon: payment_icons['USDT_TRC20']
      }
    ]
    getPayments()
  })
  mitt.emit('number-keyboard-show')
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-mine.scss';
@import '@/assets/styles/sprite-home.scss';
@import '@/assets/styles/sprite-002.scss';

.rmb {
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

:deep(.van-field__label) {
  font-size: 28px;
  color: #13161b;
  margin-bottom: 8px;
}

:deep(.van-cell__value) {
  height: 69px;
  background: #ebf1f6;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 25px;
  margin-bottom: 12px;
}

:deep(.van-cell) {
  padding-bottom: 0;
  padding-top: 0;
}

:deep(.van-cell:after) {
  display: none;
}

:deep(.van-button--large) {
  width: 92%;
  height: 80px;
  margin: 0 auto;
  font-size: 31px;
}

:deep(.van-field__body) {
  width: 100%;
}

:deep(.van-field__control:disabled) {
  color: #000;
  -webkit-text-fill-color: #000;
}

:deep(.dialog-bulletin) {
  width: 708px;
  height: auto;
  padding: 20px 30px 30px 30px;
  border-radius: 10px;

  .van-dialog__header {
    padding: 0;
    font-size: 29px;
    color: #13161b;
    font-weight: normal;
  }

  .van-dialog__content {
    margin: 33px 0 35px 0;
    font-size: 25px;
    color: #787f8c;
    text-align: justify;
  }

  .van-dialog__footer {
    padding: 0;
  }

  .van-dialog__confirm {
    width: 100%;
    height: 80px;
    font-size: 31px;
    background: var(--van-button-primary-background);
    border-radius: 8px;
    border-width: 0;
  }

  .icon-close {
    position: absolute;
    right: 40px;
    top: 35px;
  }

  img {
    width: 100%;
    margin-top: 20px;
  }

  .van-cell {
    padding: 0;
  }
}

:deep(.van-popup) {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding: 0px 20px 15px;
}

:deep(.van-overlay) {
  position: absolute;
  z-index: 20000;
}

:deep(.dialog-deal) {
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

  .dialog-radio-controler {
    margin-top: 20px;

    .radio {
      margin-right: 10px;
    }

    .radio-uncheck {
      width: 35px;
      height: 35px;
      border: 1px solid #868d9a;
      border-radius: 50%;
    }

    .radio-text {
      font-size: 25px;
      color: #13161b;
    }
  }

  .icon-close {
    position: absolute;
    right: 40px;
    top: 24px;
  }

  img {
    width: 100%;

    &.verifi-id {
      width: 260px;
    }

    &.add-card {
      width: 295px;
    }
  }

  .content {
    width: 380px;
    margin-top: 24px;
  }
}

.safe-area-inset-bottom {
  padding-bottom: calc(150px + env(safe-area-inset-bottom));
}
</style>

<style lang="css">
:root {
  --van-field-placeholder-text-color: #787f8c;
}
</style>
