<template>
  <nav-bar
    :title="moveBrick ? '开始搬砖' : '卖币'"
    :mode="moveBrick ? 'blue' : 'icons'"
  />
  <div class="coinBuy overflow_a !h-[100vh] relative top-[-1px]">
    <div class="blue"></div>
    <div class="content clearfix">
      <div class="amount">
        <div v-if="!moveBrick">
          <p class="NumText">{{ moveBrick ? '矿工币' : '可用余额' }}</p>
          <h4>
            {{ moveBrick ? wallets.toTruncFixed(2) : wallets.toTruncFixed(3) }}
            <span>{{ moveBrick ? '元' : coin_name }}</span>
          </h4>
        </div>
        <div
          class="p-[26.3px] mt-[-100px]"
          v-else
        >
          <div class="m_top clearfix mt-[15px] leading-[62px]">
            <div class="left flex_s">
              <van-image
                class="pic me-[20px] h-[62px] w-[62px]"
                :src="kgcoin"
              />
              矿工币余额
              <van-icon
                name="question-o"
                class="ms-[10px] mt-[5px]"
                @click="showDIYDialog1()"
              />
            </div>
            <div class="right font-bold text-[33.33px] text-[#333333]">
              {{ (wallets && (+wallets).toTruncFixed(2)) || '0.00' }}
              <span class="font-[300] text-[#868d9a] text-[22.33px] mr-[10px]">元</span>
            </div>
          </div>
          <div
            class="wrap_dow text-[25.33px] text-[#333333] mt-[35px] leading-[45.22px] clearfix flex_z_between text-center"
          >
            <span class="text">
              搬砖金额
              <p>
                {{ (BZCoin.sell_num && (+BZCoin.sell_num).toTruncFixed(2)) || '0.00' }}
              </p>
              <div class="right_shu"></div>
            </span>
            <span class="text">
              完成金额
              <p>{{ !BZCoin.sell_num ? '0.00' : (+BZCoin.selled_num).toTruncFixed(2) }}</p>
              <div class="right_shu"></div>
            </span>
            <span class="text">
              预计金额
              <p>{{ !BZCoin.sell_gift ? '0.00' : (+BZCoin.sell_gift).toTruncFixed(2) }}</p>
              <div class="right_shu"></div>
            </span>
            <span class="text">
              已获奖励
              <p>{{ !BZCoin.get_sell_gift ? '0.00' : (+BZCoin.get_sell_gift).toTruncFixed(2) }}</p>
            </span>
          </div>
        </div>
        <div
          class="top_sellNum clearfix"
          v-if="!moveBrick"
        >
          <div class="can_sell left">可售数量 {{ canSaleAmount }}</div>
          <div class="cant_sell right">
            不可售数量 {{ notSaleAmount }}
            <van-popover
              v-model:show="showPopover"
              placement="top"
              className="sell_popover van-popup van-popover van-popover--light"
            >
              不允许挂单出售，仅允许充值到商户
              <template #reference>
                <van-icon name="question-o" />
              </template>
            </van-popover>
          </div>
        </div>
      </div>
      <div
        ref="sellNum"
        class="sellNum !pb-[55px]"
      >
        <p class="numTitle">{{ moveBrick ? '搬砖金额' : '卖币数量' }}</p>
        <van-field
          v-model="value"
          type="digit"
          :placeholder="sell_coin_limit_placeholder"
        >
          <template #button>
            <span @click="value = moveBrick ? KGCoin : canSaleAmount">全部</span>
          </template>
          <template #right-icon>
            <span>{{ moveBrick ? '矿工币' : coin_name }}</span>
          </template>
        </van-field>
        <p
          v-if="moveBrick"
          class="caiText"
        >
          预计奖励
          <span>
            {{ (+value * findMaxNumber()).toFixed(3) }}
            CNY
          </span>
        </p>
        <p class="caiText">是否拆分</p>
        <div class="caifen clearfix">
          <div
            class="left box w-[328.47px] h-[89.58px]"
            :class="checked == '1' ? 'active' : ''"
            @click="checked = '1'"
          >
            可拆分
          </div>
          <div
            class="right box w-[328.47px] h-[89.58px]"
            :class="checked == '2' ? 'active' : ''"
            @click="checked = '2'"
          >
            不拆分
          </div>
        </div>
        <div v-if="checked == '1'">
          <p class="numTitle">最低购买</p>
          <van-field
            v-model="minimum"
            placeholder="0"
            type="digit"
          ></van-field>
        </div>

        <p class="payText">收款方式</p>
        <div className="paypic">
          <van-row justify="space-between">
            <van-col
              span="5.5"
              class="payBox"
              :class="payMateActive.includes('BANK') ? 'active' : ''"
              @click="
                withdrawddresslist.some(e => {
                  return e.coin_protocol == 'BANK' && e.status === 1
                })
                  ? payBoxTap('BANK')
                  : showDIYDialog('/payment_list?way=bank')
              "
            >
              <div>
                <van-image
                  class="Spic credit"
                  :src="requireImg('common/credit.png')"
                />
                银行卡
              </div>
              <div class="hotPic flex_s">
                <van-image
                  class="icon_huo"
                  :src="requireImg('common/icon_huo.png')"
                />
                <span class="van-ellipsis">奖励{{ +(gift_fee.BANK * 100).toFixed(2) }}%</span>
              </div>
              <div
                class="position_w"
                v-if="
                  !withdrawddresslist.some(e => {
                    return e.coin_protocol == 'BANK' && e.status === 1
                  })
                "
              >
                未绑定
              </div>
            </van-col>
            <van-col
              span="5.5"
              class="payBox"
              :class="payMateActive.includes('ALIPAY') ? 'active' : ''"
              @click="
                withdrawddresslist.some(e => {
                  return e.coin_protocol == 'ALIPAY' && e.status === 1
                })
                  ? payBoxTap('ALIPAY')
                  : showDIYDialog('/payment_list?way=alipay')
              "
            >
              <div>
                <van-image
                  class="Spic alipay"
                  :src="requireImg('common/ALIPAY.png')"
                />
                支付宝
              </div>
              <div class="hotPic flex_s">
                <van-image
                  class="icon_huo"
                  :src="requireImg('common/icon_huo.png')"
                />
                <span class="van-ellipsis">奖励{{ +(gift_fee.ALIPAY * 100).toFixed(2) }}%</span>
              </div>
              <div
                class="position_w"
                v-if="
                  !withdrawddresslist.some(e => {
                    return e.coin_protocol == 'ALIPAY' && e.status === 1
                  })
                "
              >
                未绑定
              </div>
            </van-col>
            <van-col
              span="5.5"
              class="payBox"
              :class="payMateActive.includes('WXPAY') ? 'active' : ''"
              @click="
                withdrawddresslist.some(e => {
                  return e.coin_protocol == 'WXPAY' && e.status === 1
                })
                  ? payBoxTap('WXPAY')
                  : showDIYDialog('/payment_list?way=wxpay')
              "
            >
              <div
                class="position_w"
                v-if="
                  !withdrawddresslist.some(e => {
                    return e.coin_protocol == 'WXPAY' && e.status === 1
                  })
                "
              >
                未绑定
              </div>
              <div>
                <van-image
                  class="Spic WeChatPay"
                  :src="requireImg('common/WeChatPay.png')"
                />
                微信
              </div>
              <div class="hotPic flex_s">
                <van-image
                  class="icon_huo"
                  :src="requireImg('common/icon_huo.png')"
                />
                <span class="van-ellipsis">奖励{{ +(gift_fee.WXPAY * 100).toFixed(2) }}%</span>
              </div>
            </van-col>
            <van-col
              span="5.5"
              class="payBox !m-[0]"
              :class="payMateActive.includes('SZRMB') ? 'active' : ''"
              @click="
                withdrawddresslist.some(e => {
                  return e.coin_protocol == 'SZRMB' && e.status === 1
                })
                  ? payBoxTap('SZRMB')
                  : showDIYDialog('/payment_list?way=szrmb')
              "
            >
              <div
                class="position_w"
                v-if="
                  !withdrawddresslist.some(e => {
                    return e.coin_protocol == 'SZRMB' && e.status === 1
                  })
                "
              >
                未绑定
              </div>
              <div>
                <van-image
                  class="Spic SZRMB"
                  :src="requireImg('common/SZRMB.png')"
                />
                数字人民币
              </div>
              <div class="hotPic flex_s">
                <van-image
                  class="icon_huo"
                  :src="requireImg('common/icon_huo.png')"
                />
                <span class="van-ellipsis">奖励{{ +(gift_fee.SZRMB * 100).toFixed(2) }}%</span>
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="hairline-border my-[15px]"></div>
        <van-dropdown-menu
          v-if="downList.length > 0"
          class="mt-[20px] dropdown_f"
          :overlay="false"
        >
          <van-dropdown-item
            class="dropdown_item_f jz_f"
            v-model="value1"
            @open="onDropdownItemOpen"
            @close="onDropdownItemClose"
            @closed="onDropdownItemClosed"
            ref="itemRef"
          >
            <!-- :options="downList" -->
            <template #title>
              <van-image
                v-if="locImgList.includes(downList.find((item: any) => {
                  return item.id == value1
                })?.account_bankcode)"
                lazy-load
                @click.stop="
                  ;['ALIPAY', 'WXPAY'].includes(currActiveCard.coin_protocol) &&
                    showImage(imgserver_url + currActiveCard.code_imgurl)
                "
                class="credit left mr-[20px]"
                :src="['ALIPAY', 'WXPAY'].includes(currActiveCard.coin_protocol)?requireImg(`mine/${currActiveCard.coin_protocol === 'ALIPAY' ? 'zfb_icon' : 'wx_icon'}.png`):requireImg('common/'+downList.find((item: any) => {
                  return item.id == value1
                })?.account_bankcode+'.png')"
              />
              <van-image
                v-else
                lazy-load
                class="credit left mr-[20px]"
                :src="imgserver_url+'/static/default/bank/'+downList.find((item: any) => {
                  return item.id == value1
                })?.account_bankcode+'.png'"
              />
              <div class="flex flex-col justify-between">
                <p class="text-[24px]">
                  {{
                    downList.find((item: any) => {
                      return item.id == value1
                    })?.account_bankname
                  }}
                  <span v-if="['ALIPAY', 'WXPAY'].includes(currActiveCard.coin_protocol)">
                    {{ currActiveCard.coin_address }}
                  </span>
                  <span v-if="['BANK', 'SZRMB'].includes(currActiveCard.coin_protocol)">
                    {{ currActiveCard.coin_address.slice(-4) }}
                  </span>
                </p>
                <p class="mt-[4px] text-[24px] text-[#9d9999]">
                  {{
                    downList.find((item: any) => {
                      return item.id == value1
                    })?.account_bank_realname
                  }}
                </p>
              </div>
              <div
                class="switchover text-[#0875f9] text-[24px]"
                v-if="downList.length > 1"
              >
                更多
              </div>
            </template>
            <div
              class="drop_f_item flex_s"
              v-for="(item, index) in downList.filter((item: any) => item.id !== value1)"
              @click="slectMenu(item)"
              :key="item.id"
            >
              <van-image
                v-if="locImgList.includes(item.account_bankcode)"
                lazy-load
                @click.stop="
                  ;['ALIPAY', 'WXPAY'].includes(currActiveCard.coin_protocol) &&
                    showImage(imgserver_url + item.code_imgurl)
                "
                class="credit left mr-[20px]"
                :src="
                  ['ALIPAY', 'WXPAY'].includes(item.coin_protocol)
                    ? requireImg(
                        `mine/${
                          currActiveCard.coin_protocol === 'ALIPAY' ? 'zfb_icon' : 'wx_icon'
                        }.png`
                      )
                    : requireImg('common/' + item.account_bankcode + '.png')
                "
              />
              <van-image
                v-else
                lazy-load
                class="credit left mr-[20px]"
                :src="imgserver_url + '/static/default/bank/' + item.account_bankcode + '.png'"
              />
              <div class="flex flex-col justify-between">
                <p class="text-[24px]">
                  {{ item.account_bankname }}
                  <span v-if="['ALIPAY', 'WXPAY'].includes(item.coin_protocol)">
                    {{ item.coin_address }}
                  </span>
                  <span v-if="['BANK', 'SZRMB'].includes(item.coin_protocol)">
                    {{ item.coin_address.slice(-4) }}
                  </span>
                </p>
                <p class="mt-[4px] text-[24px] text-[#9d9999]">{{ item.account_bank_realname }}</p>
              </div>
              <van-image
                v-if="item.id == value1"
                class="rightimg mr-[15px]"
                :src="requireImg('common/success.png')"
              />
              <van-image
                v-else
                class="rightimg mr-[15px]"
                :src="requireImg('common/hui.png')"
              />
            </div>
            <div
              v-if="downList.length > 1"
              class="switchover_s text-[#0875f9] text-[24px]"
              @click="menuSwitch(false)"
            >
              收起
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <van-button
        ref="sellButton"
        type="primary"
        class="sellButton"
        @click="onConfirm"
      >
        {{ moveBrick ? '开始搬砖' : '确认出售' }}
      </van-button>
    </div>
    <p class="text_sell">
      <span class="title_t">注意事项</span>
      <br />

      1.【确认出售】前请核实您的收款方式准确无误
      <br />
      2.【确认出售】挂出卖单后请在{{
        moveBrick ? '【买币】-【搬砖赚钱】' : '【订单】-【卖币】'
      }}-【挂单中】查询您的挂单
      <br />
      3.请时刻关注站内待处理消息弹窗通知
      <br />
      4.请勿恶意取消订单，查证属实后将限制账号交易
      <br />
      5.如未收到买家打款，切勿放行，请及时提交【交易申诉】，等待人工客服介入处理
      <br />
    </p>
    <van-dialog
      v-model:show="showKeyboard"
      class="confirm-dialog !top-[508px]"
      title="请输入支付密码"
      theme="round-button"
      :show-confirm-button="false"
    >
      <i
        class="icon-close block close-dark"
        @click="showKeyboard = false"
      ></i>

      <div class="confirm-dialog__content">
        <h4>
          {{ confirmAmount }}
          <span>{{ moveBrick ? 'CNY' : coin_name }}</span>
        </h4>
        <van-divider />
        <form
          class="confirm-dialog__form"
          @submit.prevent="onSubmit"
        >
          <div class="confirm-dialog__form-item">
            <label>支付密码</label>
            <!-- clickable readonly-->
            <!-- type="number"  -->
            <van-field
              style="-webkit-text-security: disc"
              type="number"
              ref="input_p"
              v-model="passwdValue"
              :focused="showKeyboard"
              @focus="showKeyboard = true"
              @touchstart.stop="showKeyboard = true"
              showKeyboard="true"
              :maxlength="6"
            />
          </div>
          <van-button
            type="primary"
            native-type="submit"
            block
            class="confirm-dialog__form-btn"
          >
            提交
          </van-button>
        </form>
      </div>
    </van-dialog>
    <van-dialog
      v-model:show="dialogContent.show"
      :title="dialogContent.title"
      theme="round-button"
      :className="['dialog-deal']"
      :confirmButtonText="dialogContent.confirmButtonText"
      @confirm="router.push('/pay_password')"
    >
      <i
        class="icon-close block close-dark"
        @click="dialogContent.show = false"
      ></i>
      <div class="flex flex-col items-center justify-between">
        <img
          :src="dialogContent.img"
          :class="!authStore?.userInfo.verified_status ? 'verifi-id' : 'add-card'"
        />
        <div class="content text-center">{{ dialogContent.content }}</div>
      </div>
    </van-dialog>
  </div>
  <van-image-preview
    v-model:show="imageShow"
    :images="[image_src]"
  ></van-image-preview>
</template>

<script setup lang="ts">
import { Sell, buySellCoinInfoApi } from '@/apis/buySellCoin'
import { GiftInfo, getUserCoinApi } from '@/apis/user'
import infoIcon from '@/assets/images/common/info.png'
import passIcon from '@/assets/images/common/key.png'
import kgcoin from '@/assets/images/common/kgcoin.png'
import { useAppBar } from '@/components/AppBar/useAppBar'
import Dialog from '@/components/CommonPopup/Dialog/index'
import router from '@/router'
import { useAuthStore } from '@/store/modules/auth'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
import { useEntryStore } from '@/store/modules/entry'
import { useUserStore } from '@/store/modules/user'
import mitt from '@/utils/mitt'
import { requireImg } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { showFailToast, showToast } from 'vant'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const imgserver_url = computed(() => {
  // console.log('(imgserver_url',(config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v);
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v || ''
})
const coin_name = sessionStorage.getItem('coin_name')
const route = useRoute()
useAppBar({ mode: 'dark' })

const userStore = useUserStore()
const { getUserMessageList } = userStore
onMounted(() => {
  getUserMessageList({})
  mitt.emit('number-keyboard-show')
})

const locImgList = ref(['SZRMB', 'ZDYYH', 'ALIPAY', 'WXPAY'])
// 当前选中的卡支付方式
const currActiveCard = computed(() => {
  return (
    downList.value.find((item: any) => {
      return item.id == value1.value
    }) || ({} as Record<string, any>)
  )
})
const imageShow = ref(false)
const image_src = ref('')
const showImage = (src: string) => {
  imageShow.value = true
  image_src.value = src
}

const itemRef = ref()
const value1 = ref(0)
const downList = ref<any>([])

const sellNum = ref()
const sellButton = ref()

// 下拉列表展开
const onDropdownItemOpen = () => {
  setTimeout(() => {
    // app视图容器宽度
    const appWidth = document.querySelector('#app')!.clientWidth
    // 宽度计算因子
    const factor = 750 / appWidth
    // 下拉高度
    let dropdownEle = document.querySelector('.van-dropdown-item__content')
    // 更多/收起 按钮高度
    const toggleBtnHeight = 52 / factor
    // 更新容器高度
    sellNum.value.style.height =
      sellNum.value.clientHeight + dropdownEle!.clientHeight - toggleBtnHeight + 'px'
  })
}
// 下拉列表关闭----动画未结束
const onDropdownItemClose = () => {
  document.querySelector('.van-dropdown-item__content')!.scrollTop = 0
}
// 下拉列表关闭----动画结束
const onDropdownItemClosed = () => {
  // sellButton.value.$el.style.marginTop = '0.42667rem'
  sellNum.value.style.height = 'auto'
}
const menuSwitch = (status?: boolean) => {
  itemRef.value.toggle(status)
}
const slectMenu = (item: { id: number }) => {
  withdrawddress_id.value[withdrawddress_id.value.length - 1] = item.id
  // console.log('withdrawddress_id.value1111', withdrawddress_id.value)
  // showToast('选择成功')
  value1.value = item.id
  downList.value.forEach((e: { id: number; def_card: number }) => {
    if (e.id == item.id) {
      e.def_card = 1
    } else {
      e.def_card = 0
    }
  })
  itemRef.value.toggle()
}
const authStore = useAuthStore()
const { token, getUserMoneyByMType, userInfo } = storeToRefs(authStore)
const { getUserCoin } = authStore
getUserCoin({})
const moveBrick = ref(0)
const KGCoin = ref(0)
const { query } = route
moveBrick.value = +(query.moveBrick as string) == 1 ? 1 : 0
KGCoin.value = +(query.KGCoin as string)

const input_p = ref(null)
// 可售金额
const canSaleAmount = computed(() => {
  const coinCash = +(getUserMoneyByMType.value(1)?.available_coincash ?? 0)
  const freeSellAmount = +(userInfo.value?.freesell_amount ?? 0)

  if (freeSellAmount > coinCash) return coinCash.toTruncFixed(2)
  return freeSellAmount.toTruncFixed(2)
})
const msgtext = `您还未绑定该收款方式,是否前往绑定 </br>
</br>
</br>
`
const showDIYDialog = (path: any) => {
  Dialog.confirm({
    title: '',
    message: msgtext,
    allowHtml: true,
    messageAlign: 'center',
    className: 'selldialog',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    action: () => {
      router.push(path)
    }
  })
}
const msgtext2 = `绑定邮箱后，可以在有交易信息的时候及时通知到您！建议您绑定好邮箱地址。 </br>
</br>
</br>
`
!!!userInfo.value.email &&
  handleClick() &&
  Dialog.confirm({
    title: '',
    message: msgtext2,
    allowHtml: true,
    messageAlign: 'center',
    className: 'selldialog',
    confirmButtonText: '去绑定',
    cancelButtonText: '取消',
    action: () => {
      router.push('/bind_email')
    }
  })
function handleClick() {
  let lastClickTime: any = localStorage.getItem('lastClickTime')
  const currentTime: any = new Date()
  if (
    lastClickTime === null ||
    currentTime - new Date(lastClickTime).getTime() > 2 * 60 * 60 * 1000
  ) {
    localStorage.setItem('lastClickTime', currentTime)
    return true
  } else {
    return false
  }
}
const BZCoin = ref<any>({})
GiftInfo({}).then(data => {
  if (!!!data.status) return false
  BZCoin.value = data
  // console.log('KGCoin.value', KGCoin.value)
})
const msgtext1 = `矿工币说明 </br>
</br>
1.矿工币是搬砖时使用的货币，需要有矿工币才能进行搬砖。</br>
</br>
2.在使用矿工币进行搬砖,在完成搬砖订单后会获得额外的矿工市奖励</br>
</br>
3.矿工币和人民币锚定1:1</br>
</br>
4.矿工币和USDT钱包可相互划转，划转汇率按当时人民币和USDT的汇率计算`

const showDIYDialog1 = () => {
  Dialog({
    title: '矿工币说明',
    message: msgtext1,
    allowHtml: true,
    messageAlign: 'left',
    className: 'kgdialog',
    confirmButtonText: '确定'
  })
}
// 不可售金额
const notSaleAmount = computed(() => {
  const coinCash = +(getUserMoneyByMType.value(1)?.available_coincash ?? 0)
  return (coinCash - Number(canSaleAmount.value)).toTruncFixed(2)
})

const confirmAmount = computed(() => {
  return Number(value.value).toTruncFixed(3)
})

const EntryStore = useEntryStore()
const { config } = storeToRefs(EntryStore)
const gift_fee = computed(() => {
  // console.log('(conft_fee',(config.value.Web_Transfer_BuySell_Coin_Fee?.Sell_mtype_1_gift as any)?.gift_fee);
  if (moveBrick.value) {
    return (config.value.Web_Transfer_BuySell_Coin_Fee?.Sell_mtype_30_gift as any)?.gift_fee
  }
  return (config.value.Web_Transfer_BuySell_Coin_Fee?.Sell_mtype_1_gift as any)?.gift_fee
})

const splitMin = computed(() => {
  const sellCoinLimit = (
    config.value.Web_Transfer_BuySell_Coin_Fee?.Sell_Coin_Limit as any
  )?.v.split('-')
  return (sellCoinLimit && Number(sellCoinLimit[0])) || 10
})

const splitMax = computed(() => {
  const sellCoinLimit = (
    config.value.Web_Transfer_BuySell_Coin_Fee?.Sell_Coin_Limit as any
  )?.v.split('-')
  return sellCoinLimit && Number(sellCoinLimit[1])
})

const minimum = ref(10)

watch(
  splitMin,
  newV => {
    minimum.value = +newV.toTruncFixed(2)
  },
  { immediate: true }
)

const sell_coin_limit_placeholder = computed(() => {
  const min = splitMin.value.toTruncFixed(2)
  const max = splitMax.value.toTruncFixed(2)
  return `限额${min}~${max}`
})

// socket().start(token.value);

const coin = useCoinBuySellStore()
const { getWithdrawddresslist } = coin
const { withdrawddresslist } = storeToRefs(coin)
const wallets = ref(0)

const payMateActive = ref<any>([])
const withdrawddress_id = ref<any>([])
const payBoxTap = (active: string) => {
  // console.log('payMateActive.value.includes(active)',delete payMateActive.value[active]);
  if (payMateActive.value.includes(active)) {
    active == payMateActive.value[payMateActive.value.length - 1] &&
      (downList.value =
        withdrawddresslist.value.filter(
          item =>
            item.coin_protocol === payMateActive.value[payMateActive.value.length - 2 || 0] &&
            item.status == 1
        ) || [])
    value1.value =
      downList.value.find((e: { def_card: number }) => {
        return e.def_card == 1
      })?.id || downList.value[0]?.id
    withdrawddress_id.value.splice(payMateActive.value.indexOf(active), 1)
    payMateActive.value.splice(payMateActive.value.indexOf(active), 1)
  } else {
    payMateActive.value.push(active)
    downList.value = withdrawddresslist.value.filter(
      item => item.coin_protocol === active && item.status == 1
    )
    value1.value =
      downList.value.find((e: { def_card: number }) => {
        return e.def_card == 1
      })?.id || downList.value[0]?.id
    withdrawddress_id.value.push(value1.value)
    // console.log('withdrawddress_id', withdrawddress_id.value)
    // console.log('downList.value111 ', downList.value[0].id)
  }
  // console.log('withdrawddress_id', withdrawddress_id.value)
  // console.log('active', payMateActive.value)
}

const active = ref(0)
const onClickLeft = () => history.go(-1)
const value = ref<number | string>('')
const checked = ref('1')

const passwdValue = ref('')
const showKeyboard = ref(false)
const showPopover = ref(false)
const errorInfo = ref('')
//
// watch(passwdValue, async newVal => {
//   if (newVal.length == 6) {
//     // console.log('passwdValue.value', passwdValue.value);
//     await goSell()
//       .then(order_id => {
//         // console.log('data',order_id);
//         passwdValue.value = ''
//         showKeyboard.value = false
//         router.push('/orderCreate?order_id=' + order_id + '&sell=true')
//         // goBuySellCoinInfoApi();
//       })
//       .catch(err => {
//         passwdValue.value = ''
//         errorInfo.value = '密码错误'
//         console.log('err错误', err)
//       })
//   } else {
//     errorInfo.value = ''
//   }
// })

const goSell = async () => {
  return new Promise((res, rej) => {
    const SellParm = {
      mtype: moveBrick.value ? 30 : 1,
      // mtype	是	string	兑换发起类型
      // 1 系统账户
      // 2、USDT账户
      // 3.以太坊账户
      // 4.比特币账户 ..
      coin_protocol: payMateActive.value.join(','), //付款卡协议 多选用逗号隔开
      // BANK
      // ALIPAY
      // WXPAY
      num: value.value, //数量
      is_split: Number(checked.value), //int	是否拆分 1,是 2否
      split_min: Number(checked.value) == 1 ? minimum.value : null, //数量
      withdrawddress_id: withdrawddress_id.value.join(','), //指定收款卡信息ID
      passwd: passwdValue.value
    }
    // console.log('SellParm', SellParm);

    Sell(SellParm).then(({ order_id }) => {
      console.log('order_id', order_id)
      if (order_id) {
        res(order_id)
      }
      rej(false)
    })
    // @ts-expect-error
    sell_(SellParm)
  })
}

getWithdrawddresslist({}).then(() => {
  // console.log('withdrawddresslist1222', withdrawddresslist.value);
  // payMateActive.value = withdrawddresslist.value;
  // payMateActive.value = [
  //   (withdrawddresslist.value.filter(e => {
  //     return e.status === 1
  //   })[0].coin_protocol as never) || ('BANK' as never)
  // ]
  // console.log('payMateActive.value', payMateActive.value)
})

const goBuySellCoinInfoApi = () => {
  buySellCoinInfoApi({}).then(data => {
    wallets.value = data.wallets['1'].available_num
    // console.log('wallets', wallets.value);
  })
}
if (moveBrick.value) {
  if (!!!KGCoin.value) {
    getUserCoinApi({}).then(data => {
      if (!!!data.length) return false
      let datas = data.find(item => item.mtype === 30) || { coincash: 0 }
      wallets.value = +(+datas.coincash).toTruncFixed(2)
    })
  } else {
    wallets.value = KGCoin.value
  }
} else {
  goBuySellCoinInfoApi()
}

const findMaxNumber = (arr: any[] = payMateActive.value) => {
  if (arr.length === 0) {
    return 0
  }
  let max = +gift_fee.value[arr[0]]
  arr.forEach((item: string, i) => {
    if (+gift_fee.value[item] > +max) {
      max = +gift_fee.value[item]
    }
  })
  return max
}

const onConfirm = () => {
  if (!canBindPayment()) {
    return false
  }
  if (!authStore.userInfo.is_set_paypassword) {
    return showToast({ message: '请先设置好支付密码', icon: infoIcon })
  }
  if (!value.value || value.value == 0) {
    return showToast({ message: '请输入卖币数量', icon: infoIcon })
  }
  if (Number(value.value) < splitMin.value || Number(value.value) > splitMax.value) {
    return showToast({
      message: `卖币限额\n${splitMin.value.toTruncFixed(2)}~${splitMax.value.toTruncFixed(2)}`,
      icon: infoIcon
    })
  }
  if (checked.value === '1') {
    if (Number(minimum.value) < splitMin.value) {
      return showToast({
        message: `最低买入不能设置低于${splitMin.value.toTruncFixed(2)}`,
        icon: infoIcon
      })
    }
    if (Number(minimum.value) > Number(value.value)) {
      return showToast({ message: `最低买入不能高于卖币数量`, icon: infoIcon })
    }
  }
  if (Number(value.value) > Number(wallets.value)) {
    return showToast({ message: `卖出数量不能高于现有额度`, icon: infoIcon })
  }
  if (!payMateActive.value || payMateActive.value.length === 0) {
    return showToast({ message: '请选择收款方式', icon: infoIcon })
  }
  showKeyboard.value = true
  setTimeout(() => {
    ;(input_p.value as any).focus()
  }, 500)
}

const onSubmit = async () => {
  if (passwdValue.value.length == 6) {
    // console.log('passwdValue.value', passwdValue.value);
    await goSell()
      .then(order_id => {
        // console.log('data',order_id);
        passwdValue.value = ''
        showKeyboard.value = false
        router.push(
          '/orderCreate?order_id=' +
            order_id +
            '&sell=true&payMateActive=' +
            payMateActive.value.join(',') +
            '&moveBrick=' +
            moveBrick.value
        )
        getUserCoin({})
        // goBuySellCoinInfoApi();
        setTimeout(() => {
          location.reload()
        }, 800)
      })
      .catch(err => {
        passwdValue.value = ''
        // showFailToast('密码错误')
      })
  } else {
    showFailToast('请输入6位密码')
  }
}

const dialogContent = reactive({
  show: false,
  title: '',
  img: '',
  content: '',
  confirmButtonText: ''
})

const canBindPayment = () => {
  if (authStore.userInfo.is_set_paypassword === 2) {
    const dialogInfo = {
      show: true,
      title: '设置支付密码',
      img: passIcon,
      content: '请先设置支付密码',
      confirmButtonText: '立即设置'
    }
    Object.assign(dialogContent, dialogInfo)
    return false
  }

  return true
}
</script>

<style lang="scss" src="./sell.scss" scoped />
<style lang="scss">
.sell_popover {
  transform: translate(-20px, -20px);
  .van-popover__content {
    padding: 20px;
    font-family: MicrosoftYaHei;
    font-size: 26.6px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #0875f9;
  }
}
</style>
