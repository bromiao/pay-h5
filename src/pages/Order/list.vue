<template>
  <div
    class="mine w-100 bg-[#f6fbff] overflow-y-scroll"
    :class="{ 'max-w-[750px]': !wideMode }"
  >
    <nav-bar
      class="nav-bar"
      title="挂单详情"
      mode="blue"
    />

    <div
      class="order-content pt-[22px] bg-[#fff] rounded-md fixed w-full"
      :class="{ 'max-w-[750px]': !wideMode }"
    >
      <div class="w-full relative bg-[#f6fbff]">
        <div class="bg-white px-[33px] pb-[20px]">
          <div class="flex items-center justify-start mb-[15px]">
            <div class="text-[#787f8c] text-[25px] mr-[20px]">挂单编号</div>
            <div class="text-[#000] text-[25px]">{{ sumData.order_id }}</div>
            <CardList
              :coin-protocol="sumData.coin_protocol"
              class="ml-[auto]"
            />
          </div>
          <div class="flex items-center justify-start mb-[15px]">
            <div class="text-[#787f8c] text-[25px] mr-[20px]">挂单金额</div>
            <div class="font-bold text-[#000] text-[30px]">
              {{ financial(sumData.sell_num) }}
              <span class="text-[#a6a6a6]">{{ moveBrick ? 'CNY' : coin_name }}</span>
            </div>
          </div>
          <div class="flex items-center justify-start mb-[15px]">
            <div class="text-[#787f8c] text-[25px] mr-[20px]">剩余金额</div>
            <div class="font-bold text-[#000] text-[30px]">
              {{ financial(sumData.remaining_num) }}
              <span class="text-[#a6a6a6]">{{ moveBrick ? 'CNY' : coin_name }}</span>
            </div>
          </div>
          <div class="flex items-center justify-start mb-[15px]">
            <div class="text-[#787f8c] text-[25px] mr-[20px]">
              {{ moveBrick ? '搬砖' : '已获' }}奖励
            </div>
            <div class="font-bold text-[#000] text-[30px]">
              {{ (sumData.sell_gift && (+sumData.sell_gift).toTruncFixed(3)) || '0.000' }}
              <span class="text-[#a6a6a6]">{{ moveBrick ? 'CNY' : coin_name }}</span>
            </div>
          </div>
        </div>
        <div
          class="order-details-list pt-[20px] w-full h-[calc(100vh-365px)] pb-[100px] overflow-scroll fixed"
          :class="{ 'max-w-[750px]': !wideMode }"
          v-if="list.length > 0"
        >
          <van-list>
            <div
              class="buy-item h-[307px] mb-[20px] mx-[33px] pt-[20px] border-0 border-solid border-b border-[#d8dce8]"
              v-for="item in list"
              :key="item"
            >
              <div class="flex items-center justify-between mb-[15px]">
                <div class="text-[#13161b] text-[25px]">{{ item.addtime }}</div>
                <div :class="`font-bold ${renderBuyStatusText(item.status).color} text-[28px]`">
                  {{ renderBuyStatusText(item.status).text }}
                </div>
              </div>
              <div class="flex items-center justify-between mb-[10px]">
                <div class="text-[#787f8c] text-[20px]">订单金额</div>
                <div class="font-bold text-[#000] text-[32px]">
                  {{ financial(item.buy_num) }}
                  <span class="text-[#a6a6a6]">{{ moveBrick ? 'CNY' : coin_name }}</span>
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
                <div class="text-[#787f8c] text-[20px]">{{ moveBrick ? '搬砖' : '额外' }}奖励</div>
                <div class="text-[#13161b] text-[25px] flex items-center">
                  {{ financial(item.sell_gift) }}
                  <span class="text-[#a6a6a6] ml-[6px]">{{ moveBrick ? 'CNY' : coin_name }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between mb-[15px]">
                <div class="text-[#13161b] text-[25px] flex items-center">
                  <img
                    class="w-[57px] h-[57px] block mr-[10px] rounded-sm"
                    :src="imgServerUrl + item.headimg"
                    alt=""
                  />
                  <span class="text-[28px]">{{ item.nickname }}</span>
                </div>
                <div
                  class="btn bg-[var(--van-button-primary-background)] text-white text-[28px] w-[181px] h-[63px] flex items-center justify-center rounded-[7px]"
                  @click="
                    router.push(
                      `/orderCreate?order_id=${item.order_id}&sellsumData=${JSON.stringify(
                        sumData
                      )}`
                    )
                  "
                >
                  订单详情
                </div>
              </div>
            </div>
          </van-list>
          <div
            class="no-data flex flex-col items-center"
            v-if="sumData?.status === 1"
          >
            <van-button
              size="large"
              color="var(--van-button-primary-background)"
              @click="cancelOrder"
            >
              取消挂单
            </van-button>
          </div>
        </div>
        <div
          class="no-data flex flex-col items-center"
          v-if="list.length == 0"
        >
          <img :src="noData" />
          <div class="text-no-data">暂无数据</div>
          <van-button
            size="large"
            color="var(--van-button-primary-background)"
            @click="cancelOrder"
            v-if="sumData?.status === 1"
          >
            取消挂单
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const coin_name = sessionStorage.getItem('coin_name')
import { SellCancel, SellOrderDetail } from '@/apis/buySellCoin'
import noData from '@/assets/images/common/noData.png'
import success from '@/assets/images/common/success.png'
import verified from '@/assets/images/common/verified.png'
import { useAppBar } from '@/components/AppBar/useAppBar'
import { useAuthStore, useEntryStore } from '@/store'
import { mergeHrefParams } from '@/utils/tools'
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'
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
const moveBrick = ref(0)
const { query } = route
moveBrick.value = +(query.moveBrick as string) == 1 ? 1 : 0
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

const action_tabs = [
  {
    title: '买币'
  },
  {
    title: '卖币'
  }
]

const action_index = ref(0)

const status_tabs = [
  {
    title: '进行中',
    path: '?status=1'
  },
  {
    title: '已完成',
    path: '?status=2'
  }
]

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

const status_index = ref(0)

const list = ref<any[]>([])

const { coins, editreview } = authStore
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
const getUserInfo = async () => {
  try {
    const coin = coins.filter(coin => coin?.coin_unit === 'GDB')?.[0]

    current_coin.value = coin

    console.log(editreview, 'editreview')
  } catch (e) {
    console.log(e)
  }
}

const sumData = ref<any>({})
const maping_buy_info = ref({})
const getSellOrderDetail = async () => {
  try {
    const res = await SellOrderDetail({ order_id: query.order_id as string })
    if (!res.order_id) return console.log('Selldata数据异常')
    sumData.value = res
    maping_buy_info.value = res.maping_buy_info
    list.value = res.buy_orders
    console.log(list.value, 'list.value')
  } catch (e) {
    console.log(e)
  }
}

const cancelOrder = async () => {
  const res: any = await SellCancel({ sell_order_id: query.order_id as string })
  if (!res?.code) {
    showToast({
      message: `挂单已取消`,
      icon: success
    })
  }
  await getSellOrderDetail()
  setTimeout(() => {
    router.back()
  }, 1000)
}

onMounted(() => {
  getUserInfo()
  getSellOrderDetail()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';
@import '@/assets/styles/sprite-mine.scss';

.mine {
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.nav-bar {
  padding-bottom: 45px;
}

.action-btn {
  &:nth-child(1):after {
    content: '';
    height: 40px;
    top: 5px;
    position: absolute;
    right: 0;
    border-right: 1px solid #d6dce8 !important;
  }
}

.no-data {
  width: 300px;
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

.order-content {
  top: calc(125px + constant(safe-area-inset-top));
  top: calc(125px + env(safe-area-inset-top));
}
.order-details-list {
  top: calc(365px + constant(safe-area-inset-top));
  top: calc(365px + env(safe-area-inset-top));
}
</style>
