<template>
  <div
    class="mine w-100 bg-[#f6fbff] overflow-y-scroll"
    :class="{ 'z-index-999': showZIndex999 }"
  >
    <nav-bar
      v-if="!onlineCharge"
      class="nav-bar"
      title="订单中心"
      mode="blue"
      hide-left
    />
    <div
      class="order-content bg-[#f6fbff] rounded-t-[21px] fixed w-full"
      :class="[{ 'max-w-[750px] ': !wideMode }, onlineCharge ? '' : 'py-[31px]']"
    >
      <div
        class="flex justify-between items-center mb-[0px] px-[21px]"
        v-if="!onlineCharge"
      >
        <div
          :class="[
            `action-btn w-auto h-[45px] relative text-[31px] text-center ${
              action_index == index ? 'text-[#000] font-bold' : 'text-[#868d9a] font-normal'
            } transition-colors duration-300`,
            {
              'pr-[18px]': index === 0,
              'pl-[18px]': index === 1
            }
          ]"
          v-for="(action, index) in action_tabs"
          :key="index"
          @click="action_index = index"
        >
          {{ action.title }}
        </div>
        <i
          class="icon-choose-datetime ml-[auto] mr-[13px]"
          @click="showDateSheet = true"
        ></i>
      </div>
      <!-- 買幣 -->
      <div
        class="order-content-container px-[20px] w-full relative"
        v-if="action_index === 0"
      >
        <div class="w-full">
          <div class="w-full">
            <van-tabs
              v-model:active="status_index"
              :line-width="lineWidth"
              class="tab-status-container van-hairline--bottom"
            >
              <van-tab
                :title="status.title"
                v-for="(status, index) in status_tabs_buyOrder"
                :key="index"
                :dot="[2].includes(index) && isShowBDot(index)"
              ></van-tab>
            </van-tabs>
          </div>
        </div>
        <div
          class="pt-[20px] w-[calc(100%-0px)] pb-[100px] overflow-scroll"
          :class="[
            onlineCharge ? 'h-[calc(100vh-200px)]' : 'h-[calc(100vh-300px)]',
            { 'max-w-[710px]': !wideMode }
          ]"
        >
          <van-pull-refresh
            v-model="refreshing"
            success-text="刷新成功"
            @refresh="getOrderList('refresh')"
            ref="pullRefresh"
          >
            <!-- 下拉提示 -->
            <template #pulling="props">
              <van-icon
                name="replay"
                size="24"
                :style="{ transform: `rotateZ(${(props.distance / 50) * 360}deg)` }"
              />
            </template>

            <!-- 释放提示 -->
            <template #loosing="props">
              <van-icon
                name="replay"
                size="24"
                :style="{ transform: `rotateZ(${(props.distance / 50) * 360}deg)` }"
              />
            </template>

            <!-- 加载提示 -->
            <template #loading>
              <van-loading size="24px">加载中...</van-loading>
            </template>
            <van-list
              v-show="currStatusList.length"
              v-model:loading="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <div
                class="buy-item rounded-[14px] bg-white h-[267px] mb-[20px] px-[18px] pt-[20px]"
                v-for="item in currStatusList"
                :key="item.order_id"
              >
                <div class="flex items-center justify-between mb-[10px]">
                  <div class="text-[#787f8c] text-[20px]">{{ item.addtime }}</div>
                  <div
                    class="text-[#ff0000] text-[28px]"
                    v-if="(item as IBuyOrder).time_second > 0"
                  >
                    <Timer :value="+(item.time_second ?? 0)" />
                  </div>
                  <div :class="`font-bold ${renderBuyStatusText(item.status).color} text-[32px]`">
                    {{ renderBuyStatusText(item.status).text }}
                  </div>
                </div>
                <div class="flex items-center justify-between mb-[10px]">
                  <div class="text-[#787f8c] text-[20px]">订单金额</div>
                  <div class="font-bold text-[#000] text-[32px]">
                    {{ financial((item as IBuyOrder).buy_num) }}
                    <span class="text-[#a6a6a6]">{{ onlineCharge ? 'CNY' : coin_name }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between mb-[10px]">
                  <div class="text-[#787f8c] text-[20px]">订单编号</div>
                  <div class="text-[#13161b] text-[25px] flex items-center font-semibold">
                    {{ item.order_id }}
                    <div
                      class="copy ml-[10px]"
                      @click="copy(item.order_id)"
                    ></div>
                  </div>
                </div>

                <div class="flex items-center justify-between mb-[10px]">
                  <div class="text-[#13161b] text-[25px] flex items-center">
                    <img
                      v-if="!onlineCharge"
                      class="w-[57px] h-[57px] block mr-[10px] rounded-sm"
                      :src="imgServerUrl + (item as IBuyOrder).sell_info.headimg"
                      alt=""
                    />
                    <span
                      v-if="!onlineCharge"
                      class="text-[28px]"
                    >
                      {{ (item as IBuyOrder).sell_info.nickname }}
                    </span>
                  </div>
                  <div
                    class="btn bg-[var(--van-button-primary-background)] text-white text-[28px] w-[181px] h-[63px] flex items-center justify-center rounded-[7px]"
                    @click="
                      router.push(
                        `/orderCreate?order_id=${item.order_id}${
                          onlineCharge ? '&onlineCharge=1' : ''
                        }`
                      )
                    "
                  >
                    订单详情
                  </div>
                </div>
              </div>
            </van-list>

            <div
              v-if="!currStatusList.length && !refreshing"
              class="no-data flex flex-col items-center"
            >
              <img :src="noData" />
              <div class="text-no-data">暂无数据</div>
            </div>
          </van-pull-refresh>
        </div>
      </div>
      <!-- 賣幣 -->
      <div
        class="order-content-container px-[20px] w-full relative"
        v-if="action_index === 1"
      >
        <div class="w-full">
          <div class="w-full">
            <van-tabs
              v-model:active="status_index"
              :line-width="lineWidth"
              class="tab-status-container van-hairline--bottom"
            >
              <van-tab
                :title="status.title"
                v-for="(status, index) in status_tabs_sellOrder"
                :key="index"
                :dot="[2, 4].includes(index) && isShowBDot(index)"
              ></van-tab>
            </van-tabs>
          </div>
        </div>
        <div
          class="pt-[20px] w-[calc(100%-0px)] h-[calc(100vh-300px)] pb-[100px] overflow-scroll"
          :class="{ 'max-w-[710px]': !wideMode }"
        >
          <van-pull-refresh
            v-model="refreshing"
            success-text="刷新成功"
            @refresh="getOrderList('refresh')"
            ref="pullRefresh"
          >
            <!-- 下拉提示 -->
            <template #pulling="props">
              <van-icon
                name="replay"
                size="24"
                :style="{ transform: `rotateZ(${(props.distance / 50) * 360}deg)` }"
              />
            </template>

            <!-- 释放提示 -->
            <template #loosing="props">
              <van-icon
                name="replay"
                size="24"
                :style="{ transform: `rotateZ(${(props.distance / 50) * 360}deg)` }"
              />
            </template>

            <!-- 加载提示 -->
            <template #loading>
              <van-loading size="24px">加载中...</van-loading>
            </template>
            <van-list
              v-show="currStatusList.length"
              v-model:loading="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <div
                class="buy-item rounded-[14px] bg-white h-[347px] mb-[20px] px-[13px] pt-[20px]"
                v-for="item in currStatusList"
                :key="item.order_id"
              >
                <div class="flex items-center justify-between mb-[10px]">
                  <div class="text-[#787f8c] text-[20px]">{{ item.addtime }}</div>
                  <div
                    class="text-[#ff0000] text-[28px]"
                    v-if="(item as IBuyOrder).time_second > 0"
                  >
                    <Timer :value="+(item.time_second ?? 0)" />
                  </div>
                  <div :class="`font-bold ${renderSellStatusText(item.status).color} text-[32px]`">
                    {{ renderSellStatusText(item.status).text }}
                  </div>
                </div>
                <div class="flex items-center justify-between mb-[10px]">
                  <div class="text-[#787f8c] text-[20px]">挂单金额</div>
                  <div class="font-bold text-[#000] text-[32px]">
                    {{ financial((item as ISellOrder).sell_num) }}
                    <span class="text-[#a6a6a6]">{{ coin_name }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between mb-[10px]">
                  <div class="text-[#787f8c] text-[20px]">剩余金额</div>
                  <div class="font-bold text-[#000] text-[32px]">
                    {{ financial((item as ISellOrder).remaining_num) }}
                    <span class="text-[#a6a6a6]">{{ coin_name }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between mb-[10px]">
                  <div class="text-[#787f8c] text-[20px]">已获奖励</div>
                  <div class="text-[#000] text-[25px]">
                    {{ financial((item as ISellOrder).get_sell_gift) }}
                    <span class="text-[#a6a6a6]">{{ coin_name }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between mb-[10px]">
                  <div class="text-[#787f8c] text-[20px]">挂单编号</div>
                  <div class="text-[#13161b] text-[25px] flex items-center font-semibold">
                    {{ item.order_id }}
                    <div
                      class="copy ml-[10px]"
                      @click="copy(item.order_id)"
                    ></div>
                  </div>
                </div>
                <div class="flex items-center justify-between mb-[15px]">
                  <CardList :coin-protocol="(item as ISellOrder).coin_protocol" />
                  <div
                    class="btn bg-[var(--van-button-primary-background)] text-white text-[28px] w-[181px] h-[63px] flex items-center justify-center rounded-[7px]"
                    @click="router.push(`/orderList?order_id=${item.order_id}`)"
                  >
                    交易明细
                  </div>
                </div>
              </div>
            </van-list>

            <div
              v-if="!currStatusList.length && !refreshing"
              class="no-data flex flex-col items-center"
            >
              <img :src="noData" />
              <div class="text-no-data">暂无数据</div>
            </div>
          </van-pull-refresh>
        </div>
      </div>
    </div>

    <van-action-sheet
      v-model:show="showDateSheet"
      title="日期选择"
      class="!w-[750px] date-action-sheet full-w-sheet"
      @open="showZIndex999 = true"
      @closed="showZIndex999 = false"
      :lazy-render="false"
    >
      <div class="h-full flex flex-col justify-between">
        <div class="date-range-container flex justify-between items-center flex-wrap">
          <div
            v-for="(date, index) in dateRangeArr"
            :key="index"
            class="item-date flex justify-center items-center"
            :class="{ active: dateIndex === index }"
            @click="dateIndex = index"
          >
            {{ date.title }}
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div
            class="item-btn btn-confirm"
            @click="onDateConfirm"
          >
            确定
          </div>
          <div
            class="item-btn btn-cancel"
            @click="onCloseDateSheet"
          >
            取消
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
const coin_name = sessionStorage.getItem('coin_name')
import { myBuyOrdersApi, mySellOrdersApi } from '@/apis/buySellCoin'
import noData from '@/assets/images/common/noData.png'
import verified from '@/assets/images/common/verified.png'
import { useAppBar } from '@/components/AppBar/useAppBar'
import Timer from '@/components/TImer.vue'
import { useAuthStore, useEntryStore } from '@/store'
import { IBuyOrder, IBuyOrderData, ISellOrder, ISellOrderData } from '@/store/types/buySellCoin'
import mitt from '@/utils/mitt'
import { mergeHrefParams } from '@/utils/tools'
import dayjs from 'dayjs'
import { showToast } from 'vant'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import clipboard3 from 'vue-clipboard3'
import { useRoute, useRouter } from 'vue-router'

const search = new URLSearchParams(mergeHrefParams())
const hs = search.get('hs') || ''
const wideMode = hs === 'h'

useAppBar({ mode: 'dark' })

const entryStore = useEntryStore()
const imgServerUrl = entryStore.imgServerUrl
const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

const financial = (x: string) => {
  return x ? Number.parseFloat(x).toTruncFixed(2) : '0.00'
}

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
const onlineCharge = ref(false)
const action_tabs = ref([
  {
    title: '买币订单'
  },
  {
    title: '卖币订单'
  }
])

const action_index = ref(0)

// 买币订单状态
const status_tabs_buyOrder = [
  {
    title: '全部',
    status: '1,2,3,4,5,6,7,8,9,10'
  },
  {
    title: '待确认',
    status: '1'
  },
  {
    title: '付款中',
    status: '3'
  },
  {
    title: '待收币',
    status: '6'
  },
  {
    title: '已完成',
    status: '8,10'
  },
  {
    title: '已挂起',
    status: '7'
  },
  {
    title: '已取消',
    status: '2,4,5,9'
  }
]
// 卖币订单状态
const status_tabs_sellOrder = [
  {
    title: '全部',
    status: '1,2,3,4,5,6,7,8'
  },
  {
    title: '挂单中',
    status: '1'
  },
  {
    title: '待确认',
    status: '2'
  },
  {
    title: '待收款',
    status: '3'
  },
  {
    title: '待放行',
    status: '4'
  },
  {
    title: '已挂起',
    status: '5'
  },
  {
    title: '已完成',
    status: '6,8'
  },
  {
    title: '已取消',
    status: '7'
  }
]

const status_index = ref(0)

const list = ref<IBuyOrder[] | ISellOrder[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
// 是否正在刷新
const isRefreshing = ref(false)
const showDateSheet = ref(false)
const showZIndex999 = ref(false)

const pullRefresh = ref()

// 当前时间段索引
const dateIndex = ref(0)
// 订单时间范围
const dateRangeArr = ref([
  {
    title: '默认',
    range: () => getRange(30)
  },
  {
    title: '今日',
    range: () => getRange(0)
  },
  {
    title: '昨日',
    range: () => getRange(1)
  },
  {
    title: '近7日',
    range: () => getRange(7)
  },
  {
    title: '近15日',
    range: () => getRange(15)
  },
  {
    title: '近30日',
    range: () => getRange(30)
  }
])

const oderParm = ref({
  page: 1, //	否	int	当前页码 默认1
  pagesize: 10 //	否	int	每页数据量 默认20
})

const onLoad = () => {
  if (oderParm.value.page === 1) return

  getOrderList('load-more')
}

// 获取站内通知——消息列表
const getOrderList = async (type = '') => {
  try {
    if (isRefreshing.value) return

    // 刷新重置页数
    if (type === 'refresh') {
      oderParm.value.page = 1
      refreshing.value = true
      isRefreshing.value = true
    } else if (type === 'load-more') {
      loading.value = oderParm.value.page !== 1 && !!list.value.length
    } else {
      loading.value = true
    }

    finished.value = false

    const res = (await getMyOrders(oderParm.value.page)) as IBuyOrderData | ISellOrderData

    if (!res.count) {
      list.value = []
      return
    }

    if (type === 'refresh') {
      list.value = res?.list ?? []
    } else {
      list.value.push(...((res?.list ?? []) as any))
    }

    if (list.value.length < res.count) {
      oderParm.value.page++
    }
    if (list.value.length === res.count) {
      finished.value = true
    }

    window.log('消息列表', res)
  } catch (error) {
    console.error(error)
  } finally {
    refreshing.value = false
    loading.value = false
    isRefreshing.value = false
  }
}

const { coins, getUserInfo } = authStore
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
const getUserCoinInfo = async () => {
  try {
    const coin = coins.filter(coin => coin?.coin_unit === 'GDB')?.[0]

    current_coin.value = coin
  } catch (e) {
    console.log(e)
  }
}

// 订单状态
const orderStatus = computed(() => {
  if (action_index.value === 0) {
    return status_tabs_buyOrder[status_index.value].status
  } else {
    return status_tabs_sellOrder[status_index.value].status
  }
})
// tab底部条高度
const lineWidth = computed(() => {
  return status_index.value === 0 ? 28 : 40
})
// 当前状态列表
const currStatusList = computed(() =>
  list.value.filter(item => orderStatus.value.includes(item.status.toString()))
)
// 当前状态是否显示红点
const isShowBDot = computed(() => {
  return (index: number) => {
    const _list = list.value.filter(item => {
      if (action_index.value === 0) {
        return item.status === 3
      }
      if (index === 2) return item.status === 2
      if (index === 4) return item.status === 4
    })
    return !!_list.length
  }
})

const getMyOrders = async (page: number) => {
  try {
    let res
    if (action_index.value === 0) {
      console.log(1)
      res = await myBuyOrdersApi({
        page,
        status: status_tabs_buyOrder[0].status,
        ...dateRangeArr.value[dateIndex.value].range()
      })
    } else {
      console.log(2)
      res = await mySellOrdersApi({
        page,
        status: status_tabs_sellOrder[0].status,
        ...dateRangeArr.value[dateIndex.value].range()
      })
    }
    return res
  } catch (e) {
    console.log(e)
  }
}

const renderBuyStatusText = (status: number) => {
  const buyStatusList = [
    { text: '等待卖家确认', color: 'text-[var(--van-button-primary-background)]' },
    { text: '卖家拒绝', color: 'text-[#777]' },
    { text: '付款中', color: 'text-[#ff0000]' },
    { text: '付款超时', color: 'text-[#777]' },
    { text: '取消买入', color: 'text-[#777]' },
    { text: '已付待收', color: 'text-[#ff0000]' },
    { text: '挂起待确认', color: 'text-[#ff0000]' },
    { text: '交易完成', color: 'text-[#58cf00]' },
    { text: '强制失败', color: 'text-[#58cf00]' },
    { text: '强制成功', color: 'text-[#58cf00]' }
  ]
  return buyStatusList[status - 1]
}

const renderSellStatusText = (status: number) => {
  const sellStatusList = [
    { text: '挂单中', color: 'text-[#ff0000]' },
    { text: '确认交易中', color: 'text-[#ff0000]' },
    { text: '等待买家付款', color: 'text-[#ff0000]' },
    { text: '确认收款中', color: 'text-[#ff0000]' },
    { text: '挂起待确认', color: 'text-[#ff0000]' },
    { text: '全部完成', color: 'text-[#58cf00]' },
    { text: '取消卖出', color: 'text-[#777]' },
    { text: '部分完成', color: 'text-[#58cf00]' }
  ]
  return sellStatusList[status - 1]
}

// 获取时间段范围
const getRange = (days: number = 30) => {
  const date_start = dayjs().subtract(days, 'day').format('YYYY-MM-DD')
  return {
    date_start: date_start,
    date_end: days == 1 ? date_start : dayjs().format('YYYY-MM-DD')
  }
}

// 关闭时间段筛选面板
const onCloseDateSheet = () => {
  dateIndex.value = 0
  showDateSheet.value = false
}
// 确认时间段筛选
const onDateConfirm = () => {
  getOrderList('refresh')
  showDateSheet.value = false
}

watch([action_index, status_index], async (val, oldVal) => {
  recordPageStatus()

  if (val[0] !== oldVal[0] || val[1] === 0) {
    oderParm.value.page = 1
    list.value = []
    refreshing.value = false
    getOrderList()
  }

  // 切换状态后，列表滚动至顶部
  nextTick(() => {
    pullRefresh.value?.$el?.scrollTo(0, 0)
  })
})

const recordPageStatus = () => {
  if (onlineCharge.value) {
    router.replace({
      query: {
        active: 2,
        status_index: status_index.value
      }
    })
  } else {
    router.replace({
      query: {
        active_index: action_index.value,
        status_index: status_index.value
      }
    })
  }
}

// 更新未处理订单数
getUserInfo()

onMounted(async () => {
  const { query, path } = route
  const { active_index: activeIndex, status_index: statusIndex } = route.query
  onlineCharge.value = path.includes('onlineCharge') ? true : false

  if (activeIndex && statusIndex) {
    action_index.value = Number(activeIndex)
    status_index.value = Number(statusIndex)
  }

  if (!activeIndex || activeIndex === '0') {
    getOrderList()
  }

  getUserCoinInfo()

  mitt.emit('action-sheet-show')
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';
@import '@/assets/styles/sprite-mine.scss';
@import '@/assets/styles/sprite-001.scss';

:deep(> .nav-bar) {
  height: calc(constant(safe-area-inset-top) + 120px);
  height: calc(env(safe-area-inset-top) + 120px);
}
.order-content {
  margin-top: -20px;
  .order-content-container {
    min-height: 1000px;
    background-color: #f5faff;
    .tab-status-container {
      &::after {
        border-color: #d6dce8;
      }
    }
    :deep(.van-tabs__wrap) {
      height: 72px;
      .van-tabs__nav {
        margin-bottom: 24px;
        padding: 0 5px 0 5px;
        gap: 0 42px;
      }
      .van-tab {
        padding: 0;
        font-size: 22px;
      }
      .van-tab--active {
        font-size: 25px;
      }
      .van-tabs__line {
        bottom: 0;
      }
    }
  }
}
.nav-bar {
  padding-bottom: 45px;
}
.mine {
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
  &.z-index-999 {
    z-index: 999;
  }
}

.action-btn {
  &:nth-child(1):after {
    content: '';
    height: 20px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    border-right: 1px solid #000 !important;
  }
}

.no-data {
  width: 200px;
  margin: 0 auto;
  margin-top: 120px;

  img {
    width: 180px;
    height: 130px;
    margin: 0 auto 20px;
    // height: 110px;
  }

  .text-no-data {
    width: 100%;
    margin-bottom: 22px;
    color: #999;
    font-size: 28px;
    text-align: center;
  }
}

:deep(.van-tabs__nav) {
  background: transparent !important;

  &.active {
    color: var(--van-button-primary-background);
    font-weight: bold;
  }
}

:deep(.van-tab) {
  color: #868d9a;
  font-weight: normal;
}

:deep(.van-tab--active) {
  color: var(--van-button-primary-background) !important;
  font-weight: bold !important;
}

:deep(.date-action-sheet) {
  height: 542px;
  .van-action-sheet__close {
    color: #230503;
    // font-size: 29px;
    line-height: 90px;
  }
  .van-action-sheet__header {
    font-size: 42px;
    font-weight: bold;
  }
  .van-action-sheet__content {
    padding: 16px 28px 65px 28px;
  }
  .date-range-container {
    gap: 56px 35px;
    .item-date {
      flex: 0 0 207px;
      height: 69px;
      font-size: 39px;
      background-color: #fff;
      border-radius: 15px;
      border: solid 1px #d1d1d1;
      &.active {
        color: var(--app-color-font-date-choose-1);
        background-color: #e0ebfe;
        border: solid 1px var(--app-color-border-date-choose-1);
      }
    }
  }
  .item-btn {
    width: 320px;
    height: 80px;
    line-height: 80px;
    font-size: 39px;
    color: #fff;
    border-radius: 15px;
    text-align: center;
    &.btn-confirm {
      background-color: var(--van-button-primary-background);
    }
    &.btn-cancel {
      background-color: #8d8d8d;
    }
  }
}
</style>
