<template>
  <div class="mine w-100 overflow-y-scroll">
    <div
      class="mine-top bg-[var(--van-button-primary-background)] w-full px-[0px] fixed max-w-[750px] z-[9]"
    >
      <div class="topbar-container">
        <div class="van-safe-area-top">
          <div class="topbar-content-view flex justify-between items-center">
            <div class="flex items-center">
              <div
                class="avatar w-[70px] h-[70px] relative overflow-hidden rounded-sm bg-[#fff] mt-[-5px]"
              >
                <div
                  class="avatar1 block"
                  v-if="!authStore?.userInfo?.headimg"
                ></div>
                <img
                  v-else
                  class="w-full h-full block"
                  :src="imgServerUrl + authStore?.userInfo?.headimg"
                  alt=""
                />
                <div
                  class="mask w-full bg-black/50 absolute bottom-0 left-0 h-[30px] flex items-center"
                >
                  <div class="camera mx-auto"></div>
                </div>
                <input
                  className="avatar-input absolute top-0 left-0 w-full h-full opacity-0 z-2"
                  type="file"
                  accept="image/*"
                  @change="afterRead"
                  @click="onAvatarClick"
                />
              </div>
              <div class="ml-[12.5px]">
                <div class="text-[26px] text-white flex items-center mb-[5px]">
                  {{ authStore?.userInfo?.nickname }}
                  <div
                    class="edit ml-[5px] scale-[0.8]"
                    @click="handleEditNicknameDialog(true)"
                  ></div>
                </div>
                <div class="text-[#fff] text-[26px] items-center flex justify-between">
                  <span className="">
                    {{
                      authStore?.userInfo?.username?.length > 18
                        ? authStore?.userInfo?.username.slice(0, 18) + '...'
                        : authStore?.userInfo?.username
                    }}
                  </span>
                  <div
                    class="copy-01 ml-[5px] w-[30px]"
                    @click="copy(authStore?.userInfo?.username)"
                  ></div>
                </div>
              </div>
            </div>
            <!-- <div
              v-for="item in topBarItemList"
              :key="item.icon"
              :class="item.icon === 'logo' ? 'logo-container' : item.icon"
              @click="changeRoute(item.routePath)"
            >

              <div
                v-if="item.icon === 'message' && unReadCount"
                class="unread-sign"
              >
                {{ unReadCount }}
              </div>
            </div> -->
          </div>
        </div>
        <!-- <div class="mt-[30px] flex items-center justify-between">
          <div class="flex items-center">
            <div class="avatar relative overflow-hidden rounded-md bg-[#fff]">
              <div
                class="avatar1"
                v-if="!authStore?.userInfo?.headimg"
              ></div>
              <img
                v-else
                class="w-[110px] h-[110px] block"
                :src="imgServerUrl + authStore?.userInfo?.headimg"
                alt=""
              />
              <div
                class="mask w-full bg-black/50 absolute bottom-0 left-0 h-[30px] flex items-center"
              >
                <div class="camera mx-auto"></div>
              </div>
              <input
                className="avatar-input absolute top-0 left-0 w-full h-full opacity-0 z-2"
                type="file"
                accept="image/*"
                @change="afterRead"
                @click="onAvatarClick"
              />
            </div>
            <div class="ml-[7.5px] w-[280px]">
              <div class="text-[30px] text-white flex items-center mb-[10px]">
                {{ authStore?.userInfo?.nickname }}
                <div
                  class="edit ml-[10px] scale-[0.8]"
                  @click="handleEditNicknameDialog(true)"
                ></div>
              </div>
              <div class="text-[#94c3ff] text-[26px] items-center flex justify-between">
                <span className="">
                  {{
                    authStore?.userInfo?.username?.length > 14
                      ? authStore?.userInfo?.username.slice(0, 14) + '...'
                      : authStore?.userInfo?.username
                  }}
                </span>
                <img
                  :src="copyIcon"
                  alt=""
                  class="w-[30px]"
                  @click="copy(authStore?.userInfo?.username)"
                />
              </div>
            </div>
          </div>
          <div @click="goFundingDetails">
            
          </div>
        </div> -->
      </div>
    </div>
    <div class="blue-bg"></div>
    <div class="mine-content px-[20px] py-[33px] bg-[#ebf1f6]">
      <div class="bg-profile rounded-[22px] bg-white mb-[30px]">
        <div
          class="bg-[var(--van-button-primary-background)] rounded-[22px] h-[330px] px-[30px] pt-[40px] pb-[30px]"
        >
          <div class="flex mb-[35px] items-start justify-between h-[60px]">
            <div class="text-[30px] text-[#fff] text-left">余额</div>
            <div
              class="w-[130px] flex items-start justify-center flex-wrap"
              @click="$router.push('/credit')"
            >
              <img
                :src="requireImg('mine/xingyuxingji.png', 1)"
                class="w-[130px] mb-[5px]"
              />
              <div class="flex items-center justify-center">
                <div
                  class="w-[25px] flex items-center"
                  v-for="(star, index) in stars"
                  :key="index"
                >
                  <img
                    :src="star_active"
                    alt=""
                    class="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-[50px] font-semibold text-white">
            {{
              current_coin?.coincash
                ? Number(current_coin?.coincash).toTruncFixed(3)
                : Number(
                    authStore?.coins.filter(coin => coin?.coin_unit === coin_name)?.[0]?.coincash ||
                      0
                  ).toTruncFixed(3)
            }}
            <span class="text-[26px] text-white font-normal ml-[10px]">
              {{ coin_name }}
            </span>
          </div>
          <div class="flex items-center justify-between mt-[70px]">
            <div class="flex items-center">
              <div class="wallet mr-[20px]"></div>
              <div class="text-[26px] font-semibold text-white">
                钱包地址：{{ authStore?.userInfo?.uuid }}
              </div>
            </div>
            <div
              class="copy-01 w-[30px] mr-[20px]"
              @click="copy(authStore?.userInfo?.uuid)"
            ></div>
          </div>
        </div>
        <div class="h-[120px] flex">
          <div class="w-[33.3%] py-[20px] text-center">
            <div class="text-[26px] text-[#777]">卖单余额</div>
            <div class="text-black text-[36px] pt-[10px]">{{ wallet?.remaining_num }}</div>
          </div>
          <div class="w-[33.3%] py-[20px] text-center">
            <div class="text-[26px] text-[#777]">买币交易中</div>
            <div class="text-black text-[36px] pt-[10px]">{{ wallet?.trans?.buy }}</div>
          </div>
          <div class="w-[33.3%] py-[20px] text-center">
            <div class="text-[26px] text-[#777]">卖币交易中</div>
            <div class="text-black text-[36px] pt-[10px]">{{ wallet?.trans?.sell }}</div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-[22px] flex mb-[30px] relative z-[1]">
        <div
          :key="entry.title"
          class="entry-row h-[220px] px-[0px] w-[25%] text-center"
          v-for="entry in entry_list_main"
          @click="entry.action"
        >
          <div class="text-[30px] text-[#13161b] text-center py-[40px]">
            <div class="relative">
              <img
                :src="entry.img_src"
                alt=""
                class="w-[90px] block mx-auto"
              />
              <div
                v-if="entry.is_ok"
                class="icon-ok-01 absolute right-[20px] bottom-[-10px]"
              ></div>
            </div>
            <div class="text-black text-[26px] mt-[20px]">
              {{ entry.title }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="adModWebUrlLink.theme_activities_show"
        class="activity-banner"
        @click="goPage('/activity/collect-cards')"
      >
        <img :src="requireImg('activity/banner02.png')" />
        <div class="btn-activity-container">
          <div class="btn-get-now"></div>
        </div>
      </div>

      <!-- <div
        v-if="adModWebUrlLink.theme_activities_show"
        class="activity-bg"
        @click.self="goPage('/activity/collect-cards')"
      >
        <img
          class="yanhua01"
          :src="requireImg('activity/yanhua01.png')"
        />
        <img
          class="yanhua02"
          :src="requireImg('activity/yanhua02.png')"
        />
        <img
          class="yanhua03"
          :src="requireImg('activity/yanhua03.png')"
        />
        <img
          class="denglong"
          :src="requireImg('activity/denglong.png')"
        />

        <div
          class="btn-activity-container"
          @click="goPage('/activity/collect-cards')"
        >
          <div class="btn-get-now"></div>
        </div>

        <div class="border-highlight"></div>
      </div> -->

      <div class="bg-white rounded-[22px] py-[20px] mb-[15px]">
        <template
          :key="entry.title"
          v-for="entry in entry_list_other"
        >
          <div
            v-if="
              (entry.title != '登录密码' && entry.title != 'APP下载') ||
              (entry.title == '登录密码' && !is_webview) ||
              (entry.title == 'APP下载' && !is_webview && coin_name !== 'OFB')
            "
            class="entry-row w-full h-[90px] px-[50px] flex items-center justify-between"
            @click="entry.action"
          >
            <div class="text-[30px] text-[#13161b] flex items-center relative">
              <img
                v-if="entry.img_src"
                :src="entry.img_src"
                alt=""
                class="w-[42px] block mr-1"
              />
              <div
                v-else
                :class="`${entry.icon} mr-1`"
              ></div>
              {{ entry.title }}
              <div
                class="bg-[#ff0000] text-white text-[20px] rounded-full absolute right-[-15px] top-[-10px] w-[25px] h-[25px] flex items-center justify-center"
                v-if="entry.dot_number && unReadCount > 0"
              >
                {{ unReadCount }}
              </div>
            </div>
            <div class="text-[26px] text-[#787f8c] flex items-center tracking-wider">
              {{ entry.status_text }}
              <div class="chervon-right ml-1"></div>
            </div>
          </div>
        </template>
      </div>
      <div class="!mt-[-5px]">
        <van-button
          v-if="!is_webview"
          class="w-[100%] !h-[100px]"
          type="primary"
          @click="logout(), $router.push('/auth/login')"
        >
          退出登录
        </van-button>
      </div>
    </div>

    <van-dialog
      v-model:show="dialog.show"
      :title="dialog.data.title"
      theme="round-button"
      className="dialog-msg"
      @confirm="onCloseDialog"
    >
      <i
        class="icon-close block close-dark"
        @click="onCloseDialog"
      ></i>

      <div class="add-time">{{ dialog.data.add_time }}</div>
      <div
        class="content"
        v-html="dialog.data.content"
      ></div>

      <template #footer>
        <div
          class="btn-confirm flex items-center justify-center"
          @click="onCloseDialog"
        >
          我知道了
        </div>
      </template>
    </van-dialog>
    <van-dialog
      v-model:show="isEditNicknameDialog"
      title="昵称修改"
      confirmButtonText="提交"
      theme="round-button"
      className="dialog-bulletin"
      @confirm="() => editNickname()"
    >
      <i
        class="icon-close close-dark block"
        @click="handleEditNicknameDialog(false)"
      ></i>
      <div>
        <van-field
          v-model="edit_nickname"
          placeholder="昵称限制3-8位长度"
        />
      </div>
    </van-dialog>
    <!-- <van-dialog v-model:show="dialogContent.show" :title="dialogContent.title" theme="round-button"
      :className="['dialog-deal']" :confirmButtonText="dialogContent.confirmButtonText" @confirm="onConfirm">
      <i class="icon-close block close-dark" @click="onClose"></i>
      <div class="flex flex-col items-center justify-between">
        <img :src="dialogContent.img" :class="!authStore?.userInfo.verified_status ? 'verifi-id' : 'add-card'" />
        <div class="content text-center">{{ dialogContent.content }}</div>
      </div>
    </van-dialog> -->
  </div>
</template>

<script setup lang="ts">
const pay_name = sessionStorage.getItem('pay_name')
const coin_name = sessionStorage.getItem('coin_name')
import { buySellCoinInfoApi } from '@/apis/buySellCoin'
import { uploadImgApi } from '@/apis/common'
import { updateUserInfoApi } from '@/apis/user'
import { useAppBar } from '@/components/AppBar/useAppBar'
import { useAuthStore, useEntryStore } from '@/store'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
import { IMessage } from '@/store/types/article'
import { showToast } from 'vant'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import info from '@/assets/images/common/info.png'
import success from '@/assets/images/common/success.png'
import verified from '@/assets/images/common/verified.png'
import star_active from '@/assets/images/credit/star.png'
import { useCommonStore } from '@/store/modules/common'
import { useUserStore } from '@/store/modules/user'
import { IADModWebUrlLink, INormal } from '@/store/types/entry'
import { requireImg } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import clipboard3 from 'vue-clipboard3'

const EntryStore = useEntryStore()
const { config } = storeToRefs(EntryStore)
const app_download_url = computed(() => {
  // console.log('(conft_fee',(config.value.Web_Transfer_BuySell_Coin_Fee?.Sell_mtype_1_gift as any)?.gift_fee);
  return (config.value.Web_Set_DefaultInfo?.app_download_url as any)?.v
})

const tutorialWebUrl = computed<INormal>(
  () => (config.value.Web_Set_DefaultInfo?.tutorial_web_url ?? {}) as INormal
)

const adModWebUrlLink = computed<IADModWebUrlLink>(
  () => (config.value.Web_Set_DefaultInfo?.AD_Mod_WebUrlLink ?? {}) as IADModWebUrlLink
)

const goPage = (routePath: string) => {
  if (!routePath) return
  router.push(routePath)
}

/* 導航列區 */
useAppBar({ mode: 'dark' })
// 上傳頭貼相關
const entryStore = useEntryStore()
const imgServerUrl = entryStore.imgServerUrl
const afterRead = async (event: any) => {
  if (!event.target.files[0]) return
  const res = await uploadImg(event.target.files[0])
  await updateUserInfoApi({
    headimg: res?.img
  })
  authStore?.getUserInfo()
  event.target.value = ''
  // avatarImg.value = res?.img
}
const uploadImg = async (file: string): Promise<any> => {
  try {
    const res = await uploadImgApi({
      file,
      type: 'face'
    })

    return res
  } catch (e) {
    console.log(e)
  }
}
const onAvatarClick = function (e: Event) {
  if (authStore?.editreview?.headimg?.status === -1) {
    e.preventDefault()
    return showToast({
      message: '头像正在审核中，请等待',
      icon: info
    })
  }
}

// 編輯暱稱
const edit_nickname = ref('')
const isEditNicknameDialog = ref(false)
const handleEditNicknameDialog = (open: boolean) => {
  if (authStore?.editreview?.nickname?.status === -1) {
    showInfoToast('昵称正在审核中请等待')
  } else {
    isEditNicknameDialog.value = open
  }
}

const editNickname = async () => {
  try {
    if (edit_nickname.value.length >= 3 && edit_nickname.value.length <= 8) {
      await updateUserInfoApi({
        nickname: edit_nickname.value
      })
      authStore?.getUserInfo()
    } else {
      edit_nickname.value = ''
      showInfoToast('昵称限制3-8位长度')
    }
  } catch (e) {
    console.log(e)
  } finally {
    handleEditNicknameDialog(false)
    edit_nickname.value = ''
  }
}

// 複製
const { toClipboard } = clipboard3()
const copy = async (text: any) => {
  try {
    await toClipboard(text)
    // showToast('复制成功');
    showToast({
      message: '复制成功',
      icon: verified,
      iconSize: '48px'
    })
  } catch (error) {
    // showToast('复制失败!!');
    showToast({
      message: '复制失败!!',
      icon: verified
    })
  }
}

/* 錢包與交易 */
// GDB錢包餘額
const current_coin = ref({
  mtype: 0,
  coin_name: '',
  coin_unit: 'GDB',
  coincash: '',
  available_coincash: '',
  status: 0,
  wallet_type: '',
  service_fee: ''
})
const getMineInfo = async () => {
  try {
    await getUserCoinData()
    const coin = authStore?.coins.filter(coin => coin?.coin_unit === 'GDB')?.[0]
    await authStore?.getUserInfo()
    current_coin.value = coin
    // getDialogMessage()
  } catch (e) {
    console.log(e)
  }
}

// 信譽評級
const userStore = useUserStore()
const { userScore, userWallet, userMessage } = storeToRefs(userStore)
// 信誉评分等级
const star_level = computed(() => userScore.value.scorelevel)
// star列表
const stars = ref<boolean[]>([])

// 更新星星填充数据
const gen_stars = () => {
  for (let i = 0; i < 5; i++) {
    if (i < star_level.value) {
      // 添加对应评分等级（填充）
      stars.value.push(true)
    }
  }
}

// 賣單餘額, 買幣交易中, 賣幣交易中
const wallet: any = ref({
  remaining_num: 0,
  trans: {
    buy: 0,
    sell: 0
  }
})
const goBuySellCoinInfoApi = () => {
  buySellCoinInfoApi({}).then(data => {
    wallet.value = data.wallets['1']
  })
}

const authStore = useAuthStore()
const { getUserCoin, logout } = authStore
const { coins } = storeToRefs(authStore)
const getUserCoinData = async (isReq: boolean = false) => {
  try {
    window.log('用户积分信息', coins.value, isReq)

    // if (coins.value.length && !isReq) {
    //   return
    // }

    const res = await getUserCoin({})
    window.log('用户积分信息2', res)
  } catch (error) {
    console.error(error)
  }
}
// 是否实名认证 0 否 1 成功 2待审核 3 拒绝’
// authStore?.userInfo?.verified_status
const isLogin = !!authStore.token

const coin = useCoinBuySellStore()
const { getWithdrawddresslist } = coin
const commonStore = useCommonStore()
let getUserWalletTimer: NodeJS.Timeout | null
const getRechargeInfo = async () => {
  try {
    const params = {
      mtype: 2,
      coin_name: 'USDT',
      coin_protocol: 'USDT_TRC20',
      coin_wallet_api: 'TRX_SYS'
    }

    // commonStore.setShowLoading(true)
    // 先请求数据，若没有，则创建充币地址，之后再请求
    await getUserWalletAddressApi({
      create: 0,
      ...params
    })

    if (!userWallet.value.length) {
      // 避免接口限流、限频，延迟请求
      getUserWalletTimer = setTimeout(async () => {
        await getUserWalletAddressApi({
          create: 1,
          ...params
        })
        getUserWalletAddressApi({
          create: 0,
          ...params
        })
      }, 1000)
    }
  } catch (error) {
    console.error(error)
  } finally {
    // commonStore.setShowLoading(false)
  }
}

const verifyStatusText = () => {
  // 0 未认证 1 已认证   2审核中   3 请重新认证   4禁止认证
  if (authStore?.userInfo?.verified_status === 0) {
    return { text: '未认证', color: 'text-[#ff0000]' }
  } else if (authStore?.userInfo?.verified_status === 3) {
    return { text: '请重新认证', color: 'text-[#ff0000]' }
  } else if (authStore?.userInfo?.verified_status === 4) {
    return { text: '禁止认证', color: 'text-[#ff0000]' }
  } else if (authStore?.userInfo?.verified_status === 1) {
    return { text: '已认证', color: 'text-[#58cf00]' }
  } else if (authStore?.userInfo?.verified_status === 2) {
    return { text: '审核中', color: 'text-[#777]' }
  } else return { text: '', color: 'text-[#777]' }
}

// const bind_bank = ref({})
// const bind_wechat = ref({})
// const bind_alipay = ref({})
// const bind_usdt = ref({})
// const bind_rmb = ref({})

// const bankCardStatusText = (bank: any) => {
//   //   status   DEFAULT '1' COMMENT '1启用  2禁用   -1审核中 ',
//   if (bank?.status === 1) {
//     return {
//       text: '已绑定',
//       color: 'text-[#58cf00]'
//     }
//   }

//   if (!bank?.status) {
//     return {
//       text: '未绑定',
//       color: 'text-[#ff0000]'
//     }
//   }

//   if (bank?.status === 2) {
//     return {
//       text: '已拒绝',
//       color: 'text-[#ff0000]'
//     }
//   }

//   if (bank?.status === -1) {
//     return {
//       text: '审核中',
//       color: 'text-[#777]'
//     }
//   }
// }

// const payPassStatusText = (is_set_pass: number) => {
//   return is_set_pass === 1 ? '已设置' : '未设置'
// }
// 入口限制
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

const router = useRouter()
const changeRoute = (path: string) => {
  router.push(path)
}

const entry_list_main = computed(() => [
  {
    title: '实名认证',
    action: () => {
      // DEFAULT '2' COMMENT '是否实名认证  1 成功   2待审核   3 拒绝请重新认证  4禁止认证',
      if ([0, 1, 2, 3].includes(authStore?.userInfo?.verified_status)) {
        router.push('verify')
        // router.push('verifyList')
      } else {
        showInfoToast(verifyStatusText().text)
      }
    },
    img_src: requireImg('mine/verify.png', 1),
    is_ok: authStore?.userInfo?.verified_status === 1
  },
  {
    title: '支付密码',
    action: () => {
      router.push('pay_password')
    },
    img_src: requireImg('mine/pay_password.png', 1),
    status_icon: true,
    is_ok: authStore.userInfo.is_set_paypassword === 1
  },
  {
    title: '收付款方式',
    action: () => {
      router.push('payments')
    },
    img_src: requireImg('mine/payments.png', 1),
    is_ok: coin?.withdrawddresslist.filter(address => address.status === 1).length > 0
  },
  {
    title: '资金明细',
    action: () => {
      if (!isLogin) {
        router.push('/auth/login')
      } else {
        router.push('/details/funding-details')
      }
    },
    img_src: requireImg('mine/notes.png', 1)
  }
])

const dialog = reactive({
  show: false,
  data: {} as IMessage
})
// 标记站内信弹窗信息已读
// const signMsgReadStatus = async () => {
//   try {
//     const res = await userMessageDetailsApi({
//       id: +dialog.data?.id ?? ''
//     })

//     unReadCount.value--
//   } catch (error) {
//     console.error(error)
//   }
// }

const { getUserWalletAddressApi } = userStore
const { getUserMessageList } = userStore
// 站内信未读数量
const unReadCount = computed(() => userMessage.value.un_read ?? 0)
// 获取站内信弹窗通知内容
// const getDialogMessage = async () => {
//   try {
//     const res = await getUserMessageList({})

//     if (!res.count || !res.un_read) {
//       return
//     }

//     unReadCount.value = res?.un_read ?? 0

//     const data = res.list.find(item => item.is_openwin === 1 && item.is_read === 0)

//     if (data) {
//       dialog.data = data
//       dialog.show = true

//       signMsgReadStatus()
//     }

//     window.log('消息列表', res)
//   } catch (error) {
//     console.error(error)
//   }
// }

const onCloseDialog = () => {
  dialog.show = false
}

console.log(unReadCount, 'unReadCount')

const entry_list_other = [
  {
    title: '登录密码',
    action: () => {
      router.push('/login_password')
    },
    status_text: '',
    img_src: requireImg('mine/login_pass_icon.png', 1)
  },
  {
    title: '绑定邮箱',
    action: () => {
      router.push('/bind_email')
    },
    status_text: '',
    img_src: requireImg('mine/emailIcon.png', 1)
  },
  {
    title: '在线客服',
    action: () => {
      changeRoute('/iframe-page/third?url=customer-service')
    },
    status_text: '',
    icon: 'customer-service-blue'
  },
  {
    title: '公告消息',
    action: () => {
      changeRoute('/message')
    },
    status_text: '',
    icon: 'message-03',
    dot_number: true
  },
  {
    title: '帮助中心',
    action: () => {
      changeRoute(
        '/iframe-page/third?url=' +
          (tutorialWebUrl.value.v?.split('?')[0] || import.meta.env.VITE_APP_TUTORIAL_URL) +
          `?from=gdpay_h5&pay_name=${pay_name}&coin_name=${coin_name}`
      )
    },
    status_text: '',
    icon: 'help-center'
  },
  {
    title: 'APP下载',
    action: () => {
      // changeRoute('/iframe-page/third?url=' + app_download_url.value)
      window.open(app_download_url.value)
    },
    status_text: '',
    img_src: requireImg('mine/download.png', 1)
  },
  {
    title: '关于我们',
    action: () => {
      router.push('about_us')
    },
    status_text: '',
    icon: 'about-us'
  }
]

const is_webview = computed(() => {
  const search = new URLSearchParams(window.location.search)
  const vtoken = search.get('vtoken') || ''
  const deviceid = search.get('deviceid') || ''
  if (!!vtoken && !!deviceid) {
    return true
  }
  return false
})

// const getPayment = (protocol: string) => {
//   console.log(coin?.withdrawddresslist)
//   if (
//     coin?.withdrawddresslist.filter(address => address.coin_protocol.includes(protocol)).length > 0
//   ) {
//     return coin?.withdrawddresslist.filter(address => address.coin_protocol.includes(protocol))[0]
//   } else {
//     return {}
//   }
// }

// const getPaymentEntryInfo = () => {
//   bind_bank.value = getPayment('BANK')
//   bind_wechat.value = getPayment('WXPAY')
//   bind_alipay.value = getPayment('ALIPAY')
//   bind_usdt.value = getPayment('USDT')
//   bind_rmb.value = getPayment('SZRMB')
// }

// console.log(current_coin.value, 'current_coin')

// console.log(userStore.userWallet, 'userStore.userWallet')

onMounted(async () => {
  getMineInfo()

  // 先从缓存更新数据
  gen_stars()

  // 请求到最新数据后，再次更新
  userStore.getUserScore().then(() => {
    stars.value = []
    gen_stars()
  })

  goBuySellCoinInfoApi()
  // getRechargeInfo()
  // getPaymentEntryInfo()

  getWithdrawddresslist({})
  getUserMessageList({})
  console.log(userMessage.value, 'userMessage')
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';
@import '@/assets/styles/sprite-mine.scss';
@import '@/assets/styles/sprite-001.scss';
@import '@/assets/styles/sprite-002.scss';

.mine {
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;

  :deep(.dialog-msg) {
    width: 708px;
    height: auto;
    padding: 40px;

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

    .add-time {
      margin-bottom: 25px;
    }

    .content {
      color: #13161b;
    }

    img {
      width: 100%;
      margin-top: 20px;
    }
  }

  .mine-top {
    height: calc(constant(safe-area-inset-top) + 100px);
    height: calc(env(safe-area-inset-top) + 100px);
  }
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

:deep(.van-cell__value) {
  height: 69px;
  background: #ebf1f6;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 25px;
  margin-bottom: 12px;
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

.topbar-container {
  width: 100%;
  height: 100px;
  padding: 0 19px;
  flex: 0 0 264px;
  box-sizing: border-box;
  background-color: var(--van-button-primary-background);

  .topbar-content-view {
    position: relative;
    width: 100%;
    height: 100px;

    .logo-container {
      position: absolute;
      top: 48px;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .home-top-logo {
        width: 45px;
      }

      .text-logo {
        margin-left: 10px;
        margin-top: -7px;
        font-size: 42px;
        color: #fff;
      }
    }

    .help {
      margin: 0 28px;
    }

    .message {
      position: relative;
      margin-bottom: -3px;
      margin-right: auto;
    }

    .unread-sign {
      position: absolute;
      top: -7px;
      right: -9px;
      width: 24px;
      height: 24px;
      line-height: 24px;
      background-color: red;
      color: #fff;
      font-size: 14px;
      text-align: center;
      border-radius: 50%;
    }
  }
}

.blue-bg {
  width: 100%;
  height: 140px;
  background-color: var(--van-button-primary-background);
}

.mine-content {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  margin-top: -34px;
}

.activity-banner {
  position: relative;
  width: 100%;
  height: 260px;
  margin-bottom: 30px;
  img {
    width: 100%;
    height: 100%;
  }
}

.btn-activity-container {
  position: absolute;
  width: 286px;
  height: 85px;
  bottom: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  overflow: hidden;
}
.btn-get-now {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('@/assets/images/activity/btn-get-now.png') no-repeat center / cover;
  background-size: 100% 100%;
  animation: btnScale 1s ease-in-out infinite;
  &::after {
    content: '';
    width: 100px;
    height: 85px;
    background: url('@/assets/images/activity/btn-guang.png') no-repeat center / cover;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    animation: glareMove 2.5s 1s linear infinite;
  }
}

.activity-bg {
  position: relative;
  width: 100%;
  height: 460px;
  margin-top: -180px;
  margin-bottom: 30px;
  background: url('@/assets/images/activity/activity-banner-bg.png') no-repeat left top / cover;
  background-size: 100% 422px;
  .nav-bar--icons {
    background-color: transparent;
  }
  .bulletin-container {
    width: 676px;
    height: 47px;
    margin: 0 auto;
    padding: 0 18px;
    color: #fff1cf;
    font-size: 23px;
    background-color: rgba(0, 0, 0, 0.12);
    border-radius: 30px;
  }

  .yanhua01 {
    width: 56px;
    height: 75px;
    position: absolute;
    top: 125px;
    left: 0;
    opacity: 0;
    animation: yanhuaBloom01 3s ease-in-out infinite;
  }
  .yanhua02 {
    width: 53px;
    height: 53px;
    position: absolute;
    top: 143px;
    left: 124px;
    opacity: 0;
    animation: yanhuaBloom01 3s 1s ease-in-out infinite;
  }
  .yanhua03 {
    width: 89px;
    height: 67px;
    position: absolute;
    top: 128px;
    right: 0;
    opacity: 0;
    animation: yanhuaBloom01 3s 2s ease-in-out infinite;
  }
  .denglong {
    width: 77px;
    height: 84px;
    position: absolute;
    top: 113px;
    right: 124px;
    opacity: 0;
    animation: denglongMove 2s 2s ease-in-out infinite;
  }

  .border-highlight {
    width: 130px;
    height: 57px;
    background: url('@/assets/images/activity/border-guang.png') no-repeat center / cover;
    background-size: 100% 100%;
    position: absolute;
    bottom: 250px;
    // left: 186px;
    left: 170px;
    opacity: 0;
    animation: borderHighlight 4s ease-in-out infinite;
  }
}
@keyframes btnScale {
  0% {
    transform: scale(0.85);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.85);
  }
}
@keyframes glareMove {
  0% {
    left: -20px;
    opacity: 0;
  }
  5% {
    opacity: 0.5;
  }
  45% {
    opacity: 0.5;
  }
  55% {
    left: 170px;
    opacity: 0;
  }
  100% {
    left: 170px;
    opacity: 0;
  }
}
@keyframes yanhuaBloom01 {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  25% {
    transform: scale(1);
    opacity: 0.8;
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes denglongMove {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 0.7;
  }
  40% {
    transform: translate3d(60px, -80px, -500px);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes borderHighlight {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  30% {
    opacity: 1;
    left: 410px;
  }
  35% {
    opacity: 0;
    left: 410px;
  }
  100% {
    opacity: 0;
  }
}
</style>
<style lang="css">
:root {
  --van-field-placeholder-text-color: #787f8c;
}
</style>
