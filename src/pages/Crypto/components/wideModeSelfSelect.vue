<template>
  <div class="selfSelect selfSelect-wide-mode">
    <div class="selectList">
      <span
        class="paymate"
        @click="onFilter('payment')"
        :class="{ active: filterType === 'payment' }"
      >
        支付方式
        <van-icon name="arrow-up" />
      </span>
      <span
        class="pays"
        @click="onFilter('sell')"
        :class="{ active: filterType === 'sell' }"
      >
        售卖方式
        <van-icon name="arrow-up" />
      </span>
      <span
        class="amount"
        @click="onFilter('amount')"
        :class="{ active: filterType === 'amount' }"
      >
        金额
        <van-icon name="arrow-up" />
      </span>
      <span
        class="select"
        @click="onFilter('')"
      >
        筛选
        <van-icon name="filter-o" />
      </span>
    </div>

    <div class="O_wrap">
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
      >
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-skeleton
            title
            avatar
            :row="3"
            :loading="false"
            v-for="(item, i) in list"
            :key="i"
          >
            <div
              class="buyList"
              :class="{
                '!h-[150px] !py-[5px]': onlineCharge,
                '!mb-0': i === list.length - 1
              }"
            >
              <van-row
                justify="space-between"
                class="content-container"
              >
                <van-col
                  class="flex_s items-center coin-amount amountMoney !h-[57px] text-[54px]"
                  v-if="onlineCharge"
                >
                  <span class="text-[23px]">{{ (+item.remaining_num).toTruncFixed(2) }}</span>
                  <span class="unit text-[18px]">{{ onlineCharge ? 'CNY' : coin_name }}</span>
                </van-col>
                <van-col class="flex_s justify-between">
                  <div>
                    <p
                      class="contentText flex items-center !h-[25px]"
                      :class="item.is_split == 1 ? '' : 'colorred'"
                    >
                      <span>{{ item.is_split == 1 ? '可拆分' : '不可拆分' }}</span>
                      <span
                        class="mixinNum"
                        v-if="item.is_split == 1"
                      >
                        最低购买{{ item.split_min == 0 ? 10 : item.split_min }}
                      </span>
                    </p>
                  </div>
                </van-col>
                <van-col
                  v-if="!onlineCharge"
                  class="col-left flex_s"
                >
                  <div>
                    <div class="user-info-container flex items-center">
                      <van-image
                        lazy-load
                        class="avatar"
                        :src="imgserver_url + item.headimg"
                      />
                      <span class="userName flex items-center">{{ item.nickname }}</span>
                    </div>
                    <p
                      class="usert"
                      :class="onlineCharge ? '!text-[#000]' : ''"
                    >
                      交易成功率{{ item.statistics?.completion_rate || '0.00' }}%
                    </p>
                    <p
                      class="usert"
                      :class="onlineCharge ? '!text-[#000]' : ''"
                    >
                      平均回应时长{{ item.statistics?.response_time || '0' }}分钟
                    </p>
                  </div>
                </van-col>
                <van-col class="col-middle flex justify-between flex_s">
                  <div>
                    <!-- <p
                      v-if="!onlineCharge"
                      class="contentText flex items-center"
                      :class="item.is_split == 1 ? '' : 'colorred'"
                    >
                      <span>{{ item.is_split == 1 ? '可拆分' : '不可拆分' }}</span>
                    </p>
                    <p class="contentText flex items-center !h-[30px]">
                      <span
                        class="mixinNum text-[#a6a6a6]"
                        v-if="item.is_split == 1"
                      >
                        最低购买{{ item.split_min == 0 ? 10 : item.split_min }}
                      </span>
                    </p> -->
                    <van-row
                      justify="start"
                      gutter="10"
                      class="pay-way-container"
                    >
                      <van-col
                        v-if="item.coin_protocol.includes('BANK')"
                        class="payBox"
                      >
                        <van-image
                          class="credit"
                          lazy-load
                          :src="requireImg('common/credit.png')"
                        />
                      </van-col>
                      <van-col
                        v-if="item.coin_protocol.includes('WXPAY')"
                        class="payBox"
                      >
                        <van-image
                          class="WeChatPay"
                          lazy-load
                          :src="requireImg('common/WeChatPay.png')"
                        />
                      </van-col>
                      <van-col
                        v-if="item.coin_protocol.includes('ALIPAY')"
                        class="payBox"
                      >
                        <van-image
                          class="alipay"
                          lazy-load
                          :src="requireImg('common/ALIPAY.png')"
                        />
                      </van-col>
                      <van-col
                        v-if="item.coin_protocol.includes('SZRMB')"
                        class="payBox"
                      >
                        <van-image
                          class="SZRMB"
                          lazy-load
                          :src="requireImg('common/SZRMB.png')"
                        />
                      </van-col>
                    </van-row>
                  </div>
                </van-col>
                <van-col class="col-right flex flex_s !justify-end">
                  <div class="">
                    <p
                      class="amountMoney flex items-center justify-end"
                      v-if="!onlineCharge"
                    >
                      <span>{{ (+item.remaining_num).toTruncFixed(2) }}</span>
                      <span class="unit">{{ onlineCharge ? 'CNY' : coin_name }}</span>
                    </p>
                    <van-button
                      type="primary"
                      class="buyButton"
                      @click="
                        onlineCharge
                          ? mitt.emit('onlineCharge_show', item)
                          : router.push('/selfbuy_coin?data=' + JSON.stringify(item))
                      "
                    >
                      购买
                    </van-button>
                  </div>
                </van-col>
              </van-row>
            </div>
          </van-skeleton>
        </van-list>
      </van-pull-refresh>
    </div>

    <van-action-sheet
      v-model:show="show"
      title="自选买币"
      class="!w-[750px] full-w-sheet"
      @closed="filterType = ''"
      :lazy-render="false"
    >
      <div class="filterContent">
        <template v-if="filterType === 'payment' || filterType === ''">
          <div class="Ftitle !pt-[0]">付款方式</div>
          <van-row
            justify="space-between"
            class="paymate"
          >
            <van-col
              span="5.5"
              :class="[
                'flex flex-col justify-center items-center',
                {
                  paymateAction: oderParm.coin_protocol == ''
                }
              ]"
              @click="oderParm.coin_protocol = ''"
            >
              <p class="payAll">全部</p>
            </van-col>
            <van-col
              span="5.5"
              :class="[
                'flex flex-col justify-between items-center',
                {
                  paymateAction: oderParm.coin_protocol.includes('BANK')
                }
              ]"
              @click="oderParm.coin_protocol = 'BANK'"
            >
              <van-image
                class="credit"
                lazy-load
                :src="requireImg('common/credit.png')"
              />
              <p>银行卡</p>
            </van-col>
            <van-col
              span="5.5"
              :class="[
                'flex flex-col justify-between items-center',
                {
                  paymateAction: oderParm.coin_protocol.includes('ALIPAY')
                }
              ]"
              @click="oderParm.coin_protocol = 'ALIPAY'"
            >
              <van-image
                class="credit alipay"
                lazy-load
                :src="requireImg('common/ALIPAY.png')"
              />
              <p>支付宝</p>
            </van-col>
            <van-col
              span="5.5"
              :class="[
                'flex flex-col justify-between items-center',
                {
                  paymateAction: oderParm.coin_protocol.includes('WXPAY')
                }
              ]"
              @click="oderParm.coin_protocol = 'WXPAY'"
            >
              <van-image
                class="credit WeChatPay"
                lazy-load
                :src="requireImg('common/WeChatPay.png')"
              />
              <p>微信</p>
            </van-col>
            <van-col
              span="5.5"
              :class="[
                'flex flex-col justify-between items-center',
                {
                  paymateAction: oderParm.coin_protocol.includes('SZRMB')
                }
              ]"
              @click="oderParm.coin_protocol = 'SZRMB'"
            >
              <van-image
                class="credit alipay SZRMB"
                lazy-load
                :src="requireImg('common/SZRMB.png')"
              />
              <p class="!text-[12px]">数字人民币</p>
            </van-col>
          </van-row>
        </template>
        <template v-if="filterType === 'sell' || filterType === ''">
          <div class="Ftitle">售卖方式</div>
          <van-row class="pays">
            <van-col
              :class="oderParm.is_split == 0 ? 'paysAction' : ''"
              @click="oderParm.is_split = 0"
            >
              全部
            </van-col>
            <van-col
              :class="oderParm.is_split == 1 ? 'paysAction' : ''"
              @click="oderParm.is_split = 1"
            >
              拆分
            </van-col>
            <van-col
              :class="oderParm.is_split == 2 ? 'paysAction' : ''"
              @click="oderParm.is_split = 2"
            >
              不拆分
            </van-col>
          </van-row>
        </template>
        <template v-if="filterType === 'amount' || filterType === ''">
          <div class="Ftitle">金额</div>
          <van-row
            justify="space-between"
            class="amount"
          >
            <van-col
              span="7.5"
              v-for="(item, index) in amountFilter"
              :key="item.name"
              :class="
                oderParm.amount == item.value || (isAllMoney && index === 0) ? 'amountAction' : ''
              "
              @click="
                ;(oderParm.amount = item.value), (searchAmount = ''), changeFullpath(item.value)
              "
            >
              {{ item.name }}
            </van-col>
          </van-row>
        </template>
        <van-row
          justify="space-between"
          class="btn-filter-container"
        >
          <van-col span="11">
            <van-button
              type="primary"
              class="reset"
              block
              @click="onReset"
            >
              重置
            </van-button>
          </van-col>
          <van-col span="11">
            <van-button
              type="primary"
              class="Confirm"
              block
              @click="onConfirm"
            >
              确认
            </van-button>
          </van-col>
        </van-row>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
const coin_name = sessionStorage.getItem('coin_name')
import { SellOrders } from '@/apis/buySellCoin'
import { useAppBar } from '@/components/AppBar/useAppBar'
import router from '@/router'
import { useEntryStore } from '@/store/modules/entry'
import { IQBuyConfig } from '@/store/types/entry'
import mitt from '@/utils/mitt'
import { mergeHrefParams, requireImg } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const filterType = ref('')
const show = ref(false)

const amountFilter = [
  { name: '全部', value: '' },
  { name: '10-100', value: '10-100' },
  { name: '101-1000', value: '101-1000' },
  { name: '1001-5000', value: '1001-5000' },
  { name: '5001-10000', value: '5001-10000' },
  { name: '10001-20000', value: '10001-20000' }
]

const onFilter = (type: string) => {
  filterType.value = type
  show.value = true
}

useAppBar({ mode: 'dark' })
const EntryStore = useEntryStore()
const { config, QBuy_Config } = storeToRefs(EntryStore)
const imgserver_url = computed(() => {
  // console.log('(imgserver_url',(config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v);
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v || ''
})
const num = ref()
const route = useRoute()
const { query, path, fullPath } = route

const search = new URLSearchParams(mergeHrefParams())
num.value = search.get('money') || ''

const oderParm = ref({
  page: 1, //	否	int	当前页码 默认1
  pagesize: 10, //	否	int	每页数据量 默认20
  coin_protocol: '', //否	string	支付方式 BANK ALIPAY WXPAY USDT 支持多选,请用逗点隔开
  is_split: 0, //否	int	售卖方式 1可拆分 2不可拆分
  amount: sessionStorage.getItem('oderParm_amount') || '' //金额 ex:指定金额100, 范围查询100-1000
})

const onlineCharge = ref(false)
onMounted(() => {
  onlineCharge.value = path.includes('onlineCharge') ? true : false
  onRefresh()
})
// 配置是否开启买币推荐
const isOpenRecommendConfig = computed(
  () => (config.value.Web_BuySell_Coin_Times?.QBuy_Config as IQBuyConfig)?.v == '1' ?? false
)
// 买币推荐范围配置列表
const recommendRangeList = computed(() => {
  return QBuy_Config.value ?? []
})
// 无匹配金额时，默认选中全部金额
const isAllMoney = computed(() => !amountFilter.some(item => item.value == oderParm.value.amount))

// 搜索推荐金额范围
const searchAmount = ref('')
const setSearchAmount = () => {
  let amountFrom, amountTo

  for (const target of recommendRangeList.value) {
    const { q, v } = target
    const [from, to] = q.split('-')
    const vRate = parseFloat(v)

    if (num.value && +from <= +num.value && +num.value <= +to) {
      amountFrom = +num.value * (1 - vRate / 100)
      amountTo = +num.value * (1 + vRate / 100)
      break
    }
  }

  if (!!!amountFrom && !!!amountTo) {
    searchAmount.value = num.value
  } else {
    sessionStorage.setItem('oderParm_amount', '')
    searchAmount.value = `${amountFrom}-${amountTo}`
  }
  // console.log(
  //   'num.value1111111',
  //   num.value,
  //   amountFrom,
  //   amountTo,
  //   searchAmount.value,
  //   recommendRangeList.value
  // )
}
setSearchAmount()
watch(
  () => QBuy_Config.value,
  (newv, old) => {
    setSearchAmount()
    setTimeout(() => {
      num.value && onConfirm()
    }, 300)
  },
  { deep: true }
)

// 监听是否可变更为全部金额（若无匹配结果）
watch(isAllMoney, (newValue, oldValue) => {
  if (newValue) {
    oderParm.value.amount = ''
    searchAmount.value = ''
    // changeFullpath('')
  }
})

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 传入的金额,若没有挂单，且所有金额区间都没有挂单，设置状态标识拦截
const allowAllMoney = ref(true)

const list = ref<any>([])
const onLoad = () => {
  if (refreshing.value) {
    oderParm.value.page = 1
    list.value = []
    // console.log('加载', refreshing.value, list.value.length)
    refreshing.value = false
  }

  oderParm.value.amount = oderParm.value.amount
    ? oderParm.value.amount
    : isOpenRecommendConfig.value
    ? searchAmount.value || ''
    : ''
  // console.log('oderParm', oderParm.value.amount, searchAmount.value)
  SellOrders(oderParm.value).then(data => {
    let count = data.count
    if (!!!count && count !== 0) return showToast('数据异常!!')
    if (!count) {
      loading.value = false
      finished.value = true

      if (search.get('money') && allowAllMoney.value) {
        onConfirm()
        allowAllMoney.value = false
      }

      return
    }
    list.value.push(...data.list)
    // list.value = data.list;
    // console.log('list.value', data.list, list.value)
    loading.value = false
    oderParm.value.page++
    if (list.value.length >= count) {
      finished.value = true
    }
  })
}
const onRefresh = () => {
  // 清空列表数据
  finished.value = false
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  // showToast('刷新成功')
  onLoad()
}
const onReset = () => {
  oderParm.value.amount = ''
  oderParm.value.coin_protocol = ''
  oderParm.value.is_split = 0
}
const WfullPath = ref(window.location.search.replace('money', 'mone2y'))
let Fullpath = ref(false)
const changeFullpath = (e: string) => {
  Fullpath.value = true
  sessionStorage.setItem('oderParm_amount', e)
}
const onConfirm = () => {
  refreshing.value = true
  loading.value = true
  // console.log('onConfirm 重新加载', oderParm.value.amount, '<-')
  if (Fullpath.value) {
    window.location.search = WfullPath.value
  }
  onLoad()
  show.value = false
}
let self_t = ref()
onMounted(() => {
  mitt.emit('action-sheet-show')
  ;(document.querySelector('.van-action-sheet') as HTMLElement).style.height =
    window.innerHeight * 0.7 + 'px'
})
onUnmounted(() => {
  clearInterval(self_t.value)
  self_t.value = null
})
</script>
<style lang="sass" src="./SelfSelect.scss" scoped></style>
