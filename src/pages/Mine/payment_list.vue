<template>
  <div class="rmb w-100 bg-white">
    <nav-bar
      :title="`${title}列表`"
      mode="blue"
      :hideLeft="false"
      gopath="/payments"
    />
    <div class="blue-bg w-full h-[30px] bg-[var(--van-button-primary-background)]"></div>
    <div
      class="order-content py-[30px] px-[20px] bg-[#fff] mt-[-30px] rounded-t-[15px] h-[calc(100%-50px)] safe-area-inset-bottom overflow-y-scroll"
    >
      <div
        :class="`w-full ${card_height} mb-[20px] relative`"
        v-for="(payment, index) in payment_list"
        :key="payment.title"
      >
        <img
          :src="payment.bg"
          alt=""
          class="absolute w-full h-full"
          @click="handle_select_payment(index)"
        />
        <!-- @click="payment.to" -->
        <!-- <img
          :src="imgServerUrl + payment?.code_imgurl"
          alt=""
          class="absolute w-[140px] h-[140px] left-[20px] top-[40px]"
          v-if="payment.status !== 2 && payment?.code_imgurl"
        /> -->
        <img
          :src="
            payment?.account_bankcode === 'ZDYYH'
              ? payment?.icon
              : imgServerUrl +
                bankList.find(b => b.bank_code === payment.account_bankcode)?.bank_logo
          "
          alt=""
          class="absolute w-[140px] h-[140px] left-[20px] top-[40px]"
          v-if="payment.coin_protocol === 'BANK'"
        />
        <img
          :src="payment?.icon"
          alt=""
          class="absolute w-[145px] h-[145px] left-[20px] top-[40px] bg-white rounded-[10px] p-[10px]"
          @click="handleShowIconDialog(payment)"
          v-else-if="payment.coin_protocol === 'WXPAY' || payment.coin_protocol === 'ALIPAY'"
        />
        <img
          :src="payment?.icon"
          alt=""
          class="absolute w-[145px] h-[145px] left-[20px] top-[40px]"
          @click="handleShowIconDialog(payment)"
          v-else
        />
        <!-- <div class="title absolute text-white text-[30px] left-[180px] top-[35px] font-bold">
          {{ payment?.coin_protocol === 'BANK' ? payment?.account_bankname : payment?.title }}
        </div> -->
        <div class="info absolute text-white text-[24px] left-[180px] top-[30px] font-normal">
          <div v-if="payment?.account_bankcode === 'SZRMB'">
            <div class="name">姓名：{{ payment?.account_bank_realname }}</div>
            <div class="name font-normal">钱包编号：{{ payment?.coin_address }}</div>
          </div>
          <div v-if="payment?.account_bankname === 'USDT'">
            <div class="name">昵称：{{ payment?.account_bank_realname }}</div>
            <div class="name font-normal">协议：{{ payment?.coin_protocol }}</div>
            <div class="name font-normal">
              地址：{{ payment?.coin_address }}
              <div
                class="copy-01 ml-[5px] inline-block"
                @click="onCopy(payment?.coin_address)"
              ></div>
            </div>
          </div>
          <div
            v-if="payment?.account_bankcode === 'WXPAY' || payment?.account_bankcode === 'ALIPAY'"
          >
            <div class="name">姓名：{{ payment?.account_bank_realname }}</div>
            <div class="name font-normal">账号：{{ payment?.coin_address }}</div>
          </div>
          <div v-if="payment?.coin_protocol === 'BANK'">
            <div class="name">姓名：{{ payment?.account_bank_realname }}</div>
            <div class="name font-normal">卡号：{{ payment?.coin_address }}</div>
            <div class="name font-normal">银行名称：{{ payment?.account_bankname }}</div>
          </div>
          <div class="address text-[#ccc] text-[20px]">添加时间：{{ payment?.add_time }}</div>
          <div
            class="name font-normal flex items-center text-[20px] mt-[15px]"
            @click="set_default_payment(payment)"
          >
            <img
              :src="payment?.def_card === 1 ? default_payment_check : default_payment_uncheck"
              alt=""
              class="w-[30px] mr-[10px]"
            />
            默认卡
          </div>
        </div>
        <img
          :src="payment_select_index === index ? payment_check : payment_uncheck"
          alt=""
          class="absolute w-[40px] right-[20px] top-[20px]"
          @click="handle_select_payment(index)"
        />
        <div
          v-if="payment.status === -1"
          class="text-white absolute z-10 bg-black bg-opacity-40 w-[100%] h-[100%] flex items-center justify-center"
          @click="handle_select_payment(index)"
        >
          <div class="text-[28px] text-center">
            <img
              :src="shz"
              alt=""
              class="w-[100px] mb-[10px] block mx-auto"
            />

            审核中
          </div>
        </div>
        <div
          v-if="payment.status === 2"
          class="text-white absolute z-10 bg-black bg-opacity-40 w-[100%] h-[100%] flex items-center justify-center"
          @click="handle_select_payment(index)"
        >
          <div class="text-[28px] text-center">
            <img
              :src="jy"
              alt=""
              class="w-[100px] mb-[10px] block mx-auto"
            />

            已禁用
          </div>
        </div>
        <!-- <div
          :class="`status absolute ${payment.status?.color} text-[24px] right-[20px] top-[35px] font-bold`"
        >
          {{ payment.status?.text }}
          &nbsp; ({{ payment.amount }})
        </div> -->
        <!-- <van-icon name="delete-o" color="white" size="20" /> -->
      </div>
      <div
        class="w-full h-[100px] mb-[10px] text-[32px] text-black relative"
        @click="payment_tos[payment_way_to_type?.[route?.query?.way]]"
        v-if="payment_list.length < bandcard_num?.[payment_way_to_type?.[route?.query?.way]]"
      >
        <img
          :src="addPaymentBtn"
          alt=""
          class="w-full h-[100px] mb-[40px]"
        />
        <div class="absolute left-[38%] right-0 top-[30px] bg-white w-[50%]">添加{{ title }}</div>
      </div>
      <div class="hint text-[#777] text-[24px] mb-[30px]">
        温馨提示：最多只能添加{{ bandcard_num?.[payment_way_to_type?.[route?.query?.way]] }}个{{
          title
        }}收款地址
      </div>
      <van-button
        v-if="payment_select_index !== -1"
        class="!w-full !mt-[80px]"
        size="large"
        color="var(--van-button-primary-background)"
        @click="handleConfirmDialog(true)"
      >
        刪除
      </van-button>
      <!-- <van-popup
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
            @click="payment.to"
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
                :class="`status ${payment.status_text?.color} text-[24px] right-[20px] top-[35px] font-bold`"
              >
                {{ payment.status_text?.text }}
              </div>
            </div>
            <div class="h-[1px] w-full bg-[#f7f7f7]"></div>
          </div>
        </div>
      </van-popup> -->
      <van-dialog
        v-model:show="isShowIconDialog"
        title=""
        className="dialog-qrcode"
        closeOnClickOverlay
      >
        <i
          class="icon-close close-white block"
          @click="isShowIconDialog = false"
        ></i>
        <img
          :src="imgServerUrl + dialogPayment?.code_imgurl"
          alt=""
        />
      </van-dialog>
      <van-dialog
        v-model:show="isConfirmDialog"
        title="身份验证"
        confirmButtonText="提交"
        theme="round-button"
        className="dialog-bulletin"
        @confirm="() => deletePayment()"
      >
        <i
          class="icon-close close-dark block"
          @click="handleConfirmDialog(false)"
        ></i>
        <div>
          <van-field
            v-model="pay_pass"
            placeholder="请输入支付密码"
            type="number"
            :maxlength="6"
            clickable
            @touchstart.stop="showKeyboard = true"
            @focus="showKeyboard = true"
          />
        </div>
      </van-dialog>
      <!-- <van-number-keyboard
        v-model="pay_pass"
        :show="showKeyboard"
        :maxlength="6"
        @blur="showKeyboard = false"
        class="!z-[3000]"
      /> -->
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
import { useAuthStore, useEntryStore } from '@/store'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
// import { showToast } from 'vant'
import mitt from '@/utils/mitt'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import info from '@/assets/images/common/info.png'
// import success from '@/assets/images/common/success.png'
import addPaymentBtn from '@/assets/images/mine/add-payment-btn.png'
import zfb from '@/assets/images/mine/alipay_bg.png'
import yhk from '@/assets/images/mine/bank_bg.png'
import szrmb from '@/assets/images/mine/szrmb_bg.png'
import usdt from '@/assets/images/mine/usdt_bg.png'
import wx from '@/assets/images/mine/wx_bg.png'

import yhk_icon from '@/assets/images/mine/yhk-icon.png'
import usdt_icon from '@/assets/images/mine/bb.png'
import default_payment_check from '@/assets/images/mine/default_payment_check.png'
import default_payment_uncheck from '@/assets/images/mine/default_payment_uncheck.png'
import jy from '@/assets/images/mine/jy.png'
import payment_check from '@/assets/images/mine/payment_check.png'
import payment_uncheck from '@/assets/images/mine/payment_uncheck.png'
import shz from '@/assets/images/mine/shz.png'
import szrmb_icon from '@/assets/images/mine/sz.png'
import wx_icon from '@/assets/images/mine/wx_icon.png'
import zfb_icon from '@/assets/images/mine/zfb_icon.png'

// import icon_alipay from '@/assets/images/mine/icon_alipay.png'
// import icon_wx from '@/assets/images/mine/icon_wx.png'
// import icon_bank from '@/assets/images/mine/icon_bank.png'
import info from '@/assets/images/common/info.png'
import success from '@/assets/images/common/success.png'
import verified from '@/assets/images/common/verified.png'
import { useAppBar } from '@/components/AppBar/useAppBar'
import { showToast } from 'vant'
import { computed } from 'vue'
import clipboard3 from 'vue-clipboard3'

import { bankListApi, deleteWithdrawAddressApi, setDefaultWithdrawAddressApi } from '@/apis/user'
import { storeToRefs } from 'pinia'

useAppBar({ mode: 'dark' })

const entryStore = useEntryStore()
const { config } = storeToRefs(entryStore)
// const { Web_Set_WebReg } = config as IConfigData | Record<string, any>
// 是否显示验证码表单
const bandcard_num = computed(() => {
  return config.value.Web_Set_WebReg?.bandcard_num?.v
    ? config.value.Web_Set_WebReg?.bandcard_num?.v
    : {
        v: { BANK: 5, ALIPAY: 5, WXPAY: 5, SZRMB: 5, USDT_TRC20: 5 }
      }
})

const imgServerUrl = entryStore.imgServerUrl

const router = useRouter()
const authStore = useAuthStore()
// const entryStore = useEntryStore()

// const bind_bank = ref({})
// const bind_wechat = ref({})
// const bind_alipay = ref({})
// const bind_usdt = ref({})
// const bind_rmb = ref({})
const route = useRoute()
const payment_names = ref({
  alipay: '支付宝',
  bank: '银行卡',
  wxpay: '微信',
  szrmb: '数字人民币',
  usdt: 'USDT'
})

const title = computed(() => payment_names.value[route?.query?.way])

const card_height = computed(() => {
  if (payment_way_to_type[route?.query?.way] === 'USDT_TRC20') {
    return 'h-[270px]'
  } else if (payment_way_to_type[route?.query?.way] === 'BANK') {
    return 'h-[240px]'
  } else {
    return 'h-[220px]'
  }
})

const { toClipboard } = clipboard3()
const onCopy = async (text: any) => {
  try {
    await toClipboard(text)
    showToast({
      message: '钱包地址已复制到剪切板',
      icon: verified,
      iconSize: '48px'
    })
  } catch (error) {
    showToast({
      message: '复制失败!!',
      icon: verified
    })
  }
}

const handleConfirmDialog = (open: boolean) => {
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }
  if (authStore?.userInfo?.is_set_paypassword !== 1) {
    return showInfoToast('请先设置支付密码')
  }
  isConfirmDialog.value = open
  // if (!bind_bank.value.coin_address) {
  //   if (!bank.value.coin_protocol) return showInfoToast('请选择协议')
  //   if (!coin_address.value) return showInfoToast('请输入您的提款地址')
  //   if (coin_address.value.length < 34) return showInfoToast('提款地址长度不正确')
  //   if (!img.value) return showInfoToast('请上传收款二维码')
  //   isConfirmDialog.value = open
  // } else {

  // }
}

const bankCardStatusText = (status: number) => {
  //   status   DEFAULT '1' COMMENT '1启用  2禁用   -1审核中 ',
  if (status === 1) {
    return {
      text: '已绑定',
      color: 'text-[#fff]'
    }
  }

  if (!status) {
    return {
      text: '未绑定',
      color: 'text-[#f98434]'
    }
  }

  if (status === 2) {
    return {
      text: '已禁用',
      color: 'text-[#d5515c]'
    }
  }

  if (status === -1) {
    return {
      text: '审核中',
      color: 'text-[#f0c388]'
    }
  }
}

const payment_bgs: any = {
  ALIPAY: zfb,
  WXPAY: wx,
  BANK: yhk,
  SZRMB: szrmb,
  USDT_TRC20: usdt
}

const payment_icons: any = {
  ALIPAY: zfb_icon,
  WXPAY: wx_icon,
  BANK: yhk_icon,
  SZRMB: szrmb_icon,
  USDT_TRC20: usdt_icon
}

const payment_ban_bgs: any = {
  ALIPAY: zfb,
  WXPAY: wx,
  BANK: yhk,
  SZRMB: szrmb,
  USDT_TRC20: usdt
}

const payment_way_to_type: any = {
  alipay: 'ALIPAY',
  wxpay: 'WXPAY',
  bank: 'BANK',
  szrmb: 'SZRMB',
  usdt: 'USDT_TRC20'
}

const payment_tos: any = {
  ALIPAY: (payment: any) => {
    if (payment.status === -1 || payment.status === 2) return
    if (
      payment_list.value.length >= bandcard_num?.value?.[payment_way_to_type?.[route?.query?.way]]
    )
      return
    router.push('/alipay')
  },
  WXPAY: (payment: any) => {
    if (payment.status === -1 || payment.status === 2) return
    if (
      payment_list.value.length >= bandcard_num?.value?.[payment_way_to_type?.[route?.query?.way]]
    )
      return
    router.push('/wechat')
  },
  BANK: (payment: any) => {
    if (payment.status === -1 || payment.status === 2) return
    if (
      payment_list.value.length >= bandcard_num?.value?.[payment_way_to_type?.[route?.query?.way]]
    )
      return
    router.push('/bank_card')
  },
  SZRMB: (payment: any) => {
    console.log(payment, 'payment')
    if (payment.status === -1 || payment.status === 2) return
    if (
      payment_list.value.length >= bandcard_num?.value?.[payment_way_to_type?.[route?.query?.way]]
    )
      return
    router.push('/rmb')
  },
  USDT_TRC20: (payment: any) => {
    if (payment.status === -1 || payment.status === 2) return
    if (
      payment_list.value.length >= bandcard_num?.value?.[payment_way_to_type?.[route?.query?.way]]
    )
      return
    router.push('/usdt')
  }
}

// const payment_icons: any = {
//   ALIPAY: {
//     sprite: 'ali-pay'
//   },
//   WXPAY: {
//     sprite: 'wechat-pay-03'
//   },
//   BANK: {
//     sprite: 'bank-card'
//   },
//   SZRMB: {
//     sprite: 'szrmb'
//   },
//   USDT_TRC20: {
//     src: icon_usdt
//   }
// }

const coin = useCoinBuySellStore()

const isConfirmDialog = ref(false)
const pay_pass = ref('')
const isLoading = ref(false)
const regPayPass = /^[0-9]{6}$/
const showKeyboard = ref(false)

const deletePayment = async () => {
  if (isLoading.value) return
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }
  if (!pay_pass.value || !regPayPass.test(pay_pass.value)) {
    pay_pass.value = ''
    return showInfoToast('请输入6位支付密码')
  }
  try {
    const res = await deleteWithdrawAddressApi({
      passwd: pay_pass.value,
      id: payment_list.value[payment_select_index.value].id
    })
    console.log(res, 'res')
    if (!res.code) {
      showSuceedToast(`刪除成功`)
      updateList()
    }

    if (res.code === 10040) {
      setTimeout(() => {
        router.push('/verify')
      }, 1000)
    }
  } catch (e) {
    console.log(e)
  } finally {
    pay_pass.value = ''
    isLoading.value = false
    isConfirmDialog.value = false
  }
}

// const getPayment = (protocol: string) => {
//   console.log(coin?.withdrawddresslist, 'coin?.withdrawddresslist')
//   if (
//     coin?.withdrawddresslist.filter(address => address.coin_protocol.includes(protocol)).length > 0
//   ) {
//     return coin?.withdrawddresslist.filter(address => address.coin_protocol.includes(protocol))[0]
//   } else {
//     console.log(2)
//     return {}
//   }
// }

const payment_options: any = ref([])
const payment_list: any = ref([])
const payment_select_index: any = ref(-1)

const handle_select_payment = (index: number) => {
  if (payment_select_index.value === index) {
    payment_select_index.value = -1
  } else {
    payment_select_index.value = index
  }
}
const getPayments = (list: any) => {
  // console.log(coin?.withdrawddresslist, 'coin?.withdrawddresslist')
  const type = payment_way_to_type?.[route?.query?.way]
  payment_list.value = list
    // .filter(coin => coin.coin_protocol === type)
    .map(payment => {
      const bank = payment_options?.value?.find(
        option => option.coin_protocol === payment.coin_protocol
      )
      return {
        ...payment,
        title: bank.title,
        bg:
          payment?.status === 2
            ? payment_ban_bgs[payment.coin_protocol]
            : payment_bgs[payment.coin_protocol],
        status_text: bankCardStatusText(payment.status),
        to: payment_tos[type],
        icon: payment_icons[type]
      }
    })
    .sort((a, b) => a.add_time.localeCompare(b.add_time))
    .sort((a, b) => a.def_card - b.def_card)

  payment_list.value = payment_list.value
    .filter(item => item.status === 1 || item.status === -1)
    .sort((a, b) => b.status - a.status)
    .concat(payment_list.value.filter(item => item.status === 2))

  if (
    payment_list?.value?.length > 0 &&
    payment_list?.value?.filter(p => p.def_card === 1)?.length === 0
  ) {
    // console.log(1)
    set_default_payment(payment_list.value?.[0])
  }
  // payment_list.value = payment_options.value
  //   .map(option => {
  //     const bank = coin?.withdrawddresslist.find(
  //       coin => coin.coin_protocol === option.coin_protocol
  //     )

  //     const amount = coin?.withdrawddresslist.filter(
  //       coin => coin.coin_protocol === option.coin_protocol
  //     ).length
  //     return {
  //       ...bank,
  //       title: option.title,
  //       bg:
  //         bank?.status === 2
  //           ? payment_ban_bgs[bank.coin_protocol]
  //           : payment_bgs[bank.coin_protocol],
  //       status: bankCardStatusText(bank),
  //       to: payment_tos[type],
  //       icon: payment_icons[type],
  //       amount
  //     }
  //   })
  //   .filter(item => !!item)
}

const show = ref(false)

const showPopup = () => {
  show.value = true
}

const img = ref('')

const { getWithdrawddresslist } = coin

const showInfoToast = (title: string) => {
  return showToast({
    message: title,
    icon: info
  })
}
const showSuceedToast = (title: string) => {
  return showToast({
    message: title,
    icon: success
  })
}

const set_default_payment = async (payment: any) => {
  try {
    const res = await setDefaultWithdrawAddressApi({
      id: payment.id
    })
    if (!res.code) {
      showSuceedToast('设置默认成功')
      updateList()
    }
  } catch (e) {
    console.log(e)
  }
}

const isShowIconDialog = ref(false)

const dialogPayment = ref({})
const handleShowIconDialog = payment => {
  console.log(payment, 'payment')
  if (payment?.code_imgurl) {
    dialogPayment.value = payment
    isShowIconDialog.value = true
  }
}

const updateList = () => {
  const params = payment_way_to_type?.[route?.query?.way]
    ? {
        coin_protocol: payment_way_to_type?.[route?.query?.way]
      }
    : {}
  payment_select_index.value = -1
  getWithdrawddresslist(params).then(list => {
    payment_options.value = [
      {
        coin_protocol: 'BANK',
        title: '银行卡',
        // status: bankCardStatusText(getPayment('BANK')),
        // to: payment_tos['BANK'],
        icon: payment_icons['BANK']
      },
      {
        coin_protocol: 'WXPAY',
        title: '微信',
        // status: bankCardStatusText(getPayment('WXPAY')),
        // to: payment_tos['WXPAY'],
        icon: payment_icons['WXPAY']
      },
      {
        coin_protocol: 'ALIPAY',
        title: '支付宝',
        // status: bankCardStatusText(getPayment('ALIPAY')),
        // to: payment_tos['ALIPAY'],
        icon: payment_icons['ALIPAY']
      },
      {
        coin_protocol: 'SZRMB',
        title: '数字人民币',
        // status: bankCardStatusText(getPayment('SZRMB')),
        // to: payment_tos['SZRMB'],
        icon: payment_icons['SZRMB']
      },
      {
        coin_protocol: 'USDT_TRC20',
        title: 'USDT',
        // status: bankCardStatusText(getPayment('USDT_TRC20')),
        // to: payment_tos['USDT_TRC20'],
        icon: payment_icons['USDT_TRC20']
      }
    ]
    getPayments(list)
  })
}

const bankList = ref([])

onMounted(async () => {
  await authStore.getUserInfo()
  updateList()

  if (payment_way_to_type?.[route?.query?.way] === 'BANK') {
    const getBankList = async () => {
      try {
        const res = await bankListApi({
          country_code: authStore?.userInfo?.set_country_code
        })
        console.log(res, 'res')
        bankList.value = res
      } catch (error) {
        console.error(error)
      } finally {
      }
    }
    getBankList()
  }

  mitt.emit('number-keyboard-show')
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-mine.scss';
@import '@/assets/styles/sprite-home.scss';
@import '@/assets/styles/sprite-002.scss';
@import '@/assets/styles/sprite-001.scss';

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

:deep(.dialog-qrcode) {
  width: 708px;
  height: auto;
  padding: 0 !important;
  border-radius: 10px;

  .van-dialog__header {
    padding: 0;
    font-size: 29px;
    color: #13161b;
    font-weight: normal;
  }

  .van-dialog__content {
    margin: 0;
    font-size: 25px;
    color: #787f8c;
    text-align: justify;
  }

  .van-dialog__footer {
    padding: 0;
    display: none;
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
    // margin-top: 20px;
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
