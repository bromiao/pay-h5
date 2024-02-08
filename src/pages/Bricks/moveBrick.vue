<template>
  <div class="moveBrick">
    <div class="blue-top-container"></div>
    <div class="content flex_sc flex_wrap bg-[#f6fbff]">
      <div class="wrap_coins">
        <div class="usdt_ct clearfix px-[20px] py-[20px]">
          <div class="m_top clearfix mt-[15px]">
            <div class="left flex_s leading-[62px] mr-[15px]">
              <van-image
                class="pic me-[20px] h-[62px] w-[62px]"
                :src="requireImg('common/USDTICON.png')"
              />
              USDT余额
            </div>
            <div class="right font-bold text-[33.33px] text-[#333333]">
              <p class="text leading-[33px]">
                {{ (USDTCoin.coincash && (+USDTCoin.coincash).toTruncFixed(2)) || '0.00' }}
                <span>U</span>
                <van-image
                  @click="goPage('/details/coin-details/usdt')"
                  class="pic mx-[43.06px] h-[27.78px] w-[21.53px]"
                  :src="requireImg('common/usd.png', 1)"
                />
              </p>
              <p class="about font-[300] text-[#868d9a] text-[22px] leading-[22.22px] mt-[6px]">
                ≈{{
                  (+USDTCoin.coincash / +KGCoin.coinset_config?.coin_price || 0).toTruncFixed(2)
                }}RMB
              </p>
            </div>
          </div>
          <div class="m_dow clearfix mt-[15px]">
            <div class="left flex_z">
              <van-button
                type="primary"
                native-type="submit"
                block
                class=""
                @click="goPage('/bricks/recharge')"
              >
                充U
              </van-button>
              <van-button
                type="primary"
                native-type="submit"
                block
                class="ml_20"
                @click="goPage('/bricks/withdraw-coins')"
              >
                提U
              </van-button>
            </div>
            <div class="right flex_z">
              <!-- <van-button
                type="primary"
                native-type="submit"
                block
                class=""
                icon="orders-o"
                @click="goPage('/details/coin-details/usdt')"
              >
                明细
              </van-button> -->
              <van-button
                type="primary"
                native-type="submit"
                block
                class="ml_20 m-rotate-90"
                @click="goPage('/bricks/transfer/usdt-to-kgb')"
              >
                划转
              </van-button>
            </div>
          </div>
        </div>

        <div class="MinerCoin clearfix px-[20px] pt-[20px]">
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
                @click="showDIYDialog()"
              />
            </div>
            <div class="right font-bold text-[33.33px] text-[#333333]">
              {{ (KGCoin.coincash && (+KGCoin.coincash).toTruncFixed(2)) || '0.00' }}
              <span class="font-[300] text-[#868d9a] text-[22.33px]">元</span>
              <van-image
                class="pic mx-[43.06px] h-[27.78px] w-[21.53px]"
                @click="goPage('/details/coin-details/kgb')"
                :src="requireImg('common/cny.png', 1)"
              />
            </div>
          </div>
          <div class="m_dow clearfix mt-[15px]">
            <div class="left flex_z">
              <van-button
                type="primary"
                native-type="submit"
                block
                class="!rounded-[6.94px] !w-[270.83px] !h-[52.78px]"
                @click="startbz"
              >
                开始搬砖
              </van-button>
            </div>
            <div class="right">
              <van-button
                type="primary"
                native-type="submit"
                block
                class="ml_20 m-rotate-90"
                @click.stop="goPage('/bricks/transfer/kgb-to-usdt')"
              >
                划转
              </van-button>
            </div>
          </div>
        </div>

        <!-- <div class="wrap_top flex_s">
          <span
            v-if="BZCoin.status == '搬砖中'"
            class="banzhuan_wrap mr-[15px]"
          >
            <i class="banzhuan_m"></i>
          </span>
          <van-image
            v-else
            class="pic mr-[20px] h-[62px] w-[62px]"
            :src="requireImg('common/wks.png')"
          />
          {{ BZCoin.status == '搬砖中' ? '搬砖中' : '未开始搬砖' }}
        </div> -->
        <div class="moveBrick_top !h-auto clearfix px-[20px] py-[20px]">
          <div
            class="wrap_dow text-[25.33px] text-[#333333] mt-[10px] leading-[45.22px] clearfix flex_z_between text-center"
          >
            <span class="text">
              搬砖金额
              <p>
                {{ (BZCoin.sell_num && (+BZCoin.sell_num).toTruncFixed(2)) || '0.00' }}
              </p>
              <div class="right_shu"></div>
            </span>
            <span class="text">
              预计奖励
              <p>{{ !BZCoin.sell_gift ? '0.00' : (+BZCoin.sell_gift).toTruncFixed(2) }}</p>
              <div class="right_shu"></div>
            </span>
            <span class="text">
              完成金额
              <p>{{ !BZCoin.sell_num ? '0.00' : (+BZCoin.selled_num).toTruncFixed(2) }}</p>
              <div class="right_shu"></div>
            </span>
            <span class="text">
              已获奖励
              <p>{{ !BZCoin.get_sell_gift ? '0.00' : (+BZCoin.get_sell_gift).toTruncFixed(2) }}</p>
            </span>
          </div>
        </div>
      </div>

      <div class="list_coins clearfix felx1 max-h-[980.28px] h-[calc(100vh-980.28px)]">
        <div class="px-[0] w-full relative h-[100%]">
          <div class="w-full borderb clearfix">
            <div class="w-[640px] left">
              <van-tabs v-model:active="status_index">
                <van-tab
                  :title="item.title"
                  v-for="(item, index) in status_tabs"
                  :key="index"
                  :dot="
                  allList
                      .some((e:any) => {
                        return ((e.status==2||e.status==4)&&e.status==(item.status))
                      })
                     "
                ></van-tab>
              </van-tabs>
            </div>
            <van-icon
              class="right mr-[23px] top-[22px]"
              name="calendar-o"
              @click="showDateSheet = true"
              size="19px"
            />
          </div>
          <!-- @click=";(showData = true), (startData = true)" -->
          <!-- h-[calc(100vh-300px)] -->
          <div
            class="pt-[20px] w-[calc(100%-0px)] h-[calc(100%-80px)] pb-[30px] overflow-scroll max-w-[710px]"
          >
            <van-pull-refresh
              v-model="refreshing"
              @refresh="onRefresh"
            >
              <!-- 下拉提示 -->
              <!-- <template #pulling="props">
                <van-icon
                  name="replay"
                  size="24"
                  :style="{ transform: `rotateZ(${(props.distance / 50) * 360}deg)` }"
                />
              </template> -->

              <!-- 释放提示 -->
              <!-- <template #loosing="props">
                <van-icon
                  name="replay"
                  size="24"
                  :style="{ transform: `rotateZ(${(props.distance / 50) * 360}deg)` }"
                />
              </template> -->

              <!-- 加载提示 -->
              <template #loading>
                <van-loading size="24px">加载中...</van-loading>
              </template>
              <van-list
                v-if="list.length > 0"
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <div
                  class="buy-item rounded-[14px] bg-white h-[347px] mb-[20px] px-[13px] pt-[20px]"
                  v-for="item in list"
                  :key="item"
                >
                  <div class="flex items-center justify-between mb-[10px]">
                    <div class="text-[#787f8c] text-[20px]">{{ item.addtime }}</div>
                    <div
                      :class="`font-bold ${renderSellStatusText(item.status).color} text-[32px]`"
                    >
                      {{ renderSellStatusText(item.status).text }}
                    </div>
                  </div>
                  <div class="flex items-center justify-between mb-[10px]">
                    <div class="text-[#787f8c] text-[20px]">挂单金额</div>
                    <div class="font-bold text-[#000] text-[32px]">
                      {{ financial(item.sell_num) }}CNY
                    </div>
                  </div>
                  <div class="flex items-center justify-between mb-[10px]">
                    <div class="text-[#787f8c] text-[20px]">剩余金额</div>
                    <div class="font-bold text-[#000] text-[32px]">
                      {{ financial(item.remaining_num) }}CNY
                    </div>
                  </div>
                  <div class="flex items-center justify-between mb-[10px]">
                    <div class="text-[#787f8c] text-[20px]">搬砖奖励</div>
                    <div class="text-[#000] text-[25px]">
                      {{
                        status_index == 1
                          ? item.get_sell_gift && (+item.get_sell_gift).toTruncFixed(3)
                          : item.sell_gift && (+item.sell_gift).toTruncFixed(3)
                      }}CNY
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
                  <div class="flex items-center justify-end mb-[15px]">
                    <div
                      class="btn bg-[var(--van-button-primary-background)] text-white text-[28px] w-[181px] h-[63px] flex items-center justify-center rounded-[7px]"
                      @click="$router.push(`/orderList?order_id=${item.order_id}&moveBrick=1`)"
                    >
                      交易明细
                    </div>
                  </div>
                </div>
              </van-list>
              <div
                class="no-data flex flex-col items-center"
                v-if="list.length == 0"
              >
                <img :src="noData" />
                <div class="text-no-data">暂无数据</div>
              </div>
            </van-pull-refresh>
          </div>
        </div>
      </div>
    </div>
  </div>
  <van-action-sheet
    v-model:show="showDateSheet"
    title="日期选择"
    class="!w-[750px] date-action-sheet1 full-w-sheet"
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
          @click=";(showDateSheet = false), onRefresh()"
        >
          <!-- @click=";(showDateSheet = false), onRefresh(), getAllList()" -->
          确定
        </div>
        <div
          class="item-btn btn-cancel"
          @click=";(dateIndex = 0), (showDateSheet = false)"
        >
          取消
        </div>
      </div>
    </div>
  </van-action-sheet>
  <!-- <van-popup v-model:show="showData"></van-popup>
  <transition name="van-slide-up">
    <van-date-picker
      class="bottom-[515px] z-[2222] safe-area-inset-bottom"
      ref="datePicker1"
      :style="'bottom:' + getdatePickerh + 'px !important'"
      v-if="showData && startData"
      v-model="date_start"
      title="选择开始日期"
      :min-date="minDate"
      :formatter="formatter"
      :columns-type="columnsType"
      :max-date="maxDate"
      @cancel=";(showData = false), (startData = false)"
      @confirm=";(startData = false), (endData = true)"
    />
  </transition>
  <transition name="van-slide-up">
    <van-date-picker
      ref="datePicker2"
      :style="'bottom:' + getdatePicker2h + 'px !important'"
      class="bottom-[515px] z-[2222] safe-area-inset-bottom"
      v-if="showData && endData"
      v-model="date_end"
      title="选择结束日期"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel=";(showData = false), (endData = false)"
      @confirm=";(showData = false), (endData = false), onRefresh()"
    />
  </transition> -->
</template>

<script setup lang="ts">
import kgcoin from '@/assets/images/common/kgcoin.png'
import noData from '@/assets/images/common/noData.png'
import verified from '@/assets/images/common/verified.png'
import Dialog from '@/components/CommonPopup/Dialog/index'
import { requireImg } from '@/utils/tools'
import { computed, onMounted, ref, watch } from 'vue'
import clipboard3 from 'vue-clipboard3'
// import mitt from '@/utils/mitt';
// import router from '@/router';
import { mySellOrdersApi } from '@/apis/buySellCoin'
import { GiftInfo, getUserCoinApi } from '@/apis/user'
import router from '@/router'
import { useAuthStore } from '@/store'
import { useEntryStore } from '@/store/modules/entry'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { useRoute } from 'vue-router'

import { useAppBar } from '@/components/AppBar/useAppBar'
import mitt from '@/utils/mitt'
import dayjs from 'dayjs'
useAppBar({ mode: 'dark' })

const showDateSheet = ref(false)
const showZIndex999 = ref(false)
const dateIndex = ref(0)
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
// 获取时间段范围
const getRange = (days: number = 30) => {
  const date_start = dayjs().subtract(days, 'day').format('YYYY-MM-DD')
  // console.log('22', {
  //   date_start: date_start,
  //   date_end: days == 1 ? date_start : dayjs().format('YYYY-MM-DD')
  // })
  return {
    date_start: date_start,
    date_end: days == 1 ? date_start : dayjs().format('YYYY-MM-DD')
  }
}
const datePicker1 = ref<any>(null)
const getdatePickerh = computed(() => {
  let h = datePicker1.value?.$el.clientHeight || 'null'
  // console.log('datePicker', h)
  return h
})
const datePicker2 = ref<any>(null)
const getdatePicker2h = computed(() => {
  let h = datePicker2.value?.$el.clientHeight || 'null'
  // console.log('datePicker', h)
  return h
})
const EntryStore = useEntryStore()
const { config } = storeToRefs(EntryStore)
const authStore = useAuthStore()
const { updateUserCoin } = authStore
const imgserver_url = computed(() => {
  // console.log('(imgserver_url',(config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v);
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v || ''
})
// 获取当前时间
const now = new Date()
const [year, month, date] = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`.split('-')
const [y, m, d30] = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`.split('-')
// console.log('year, month, date', year, month, date)

const route = useRoute()
const KGCoin = ref<any>({})
const USDTCoin = ref<any>({})
const BZCoin = ref<any>({})
const showData = ref<any>(false)
const startData = ref<any>(false)
const endData = ref<any>(false)
const date_start = ref<any>([y, m, d30])
const date_end = ref<any>([year, month, date])
const minDate = ref<any>(new Date(2020, 0, 1))
const maxDate = ref<any>(new Date(2025, 5, 1))

const startbz = async () => {
  router.push('/sell_coin?moveBrick=1&KGCoin=' + (+KGCoin.value.coincash).toTruncFixed(2))
}
const columnsType: any = ['year', 'month', 'day']
const formatter = (type: string, option: any) => {
  // console.log('type, option', type, option)
  if (type === 'year') {
    option.text += '年'
  }
  if (type === 'month') {
    option.text += '月'
  }
  return option
}
getUserCoinApi({}).then(data => {
  if (!!!data.length) return false
  KGCoin.value = data.find(item => item.mtype === 30)
  USDTCoin.value = data.find(item => item.mtype === 2)

  // 更新币种信息
  updateUserCoin(data)
  // console.log('KGCoin.value', KGCoin.value)
})
GiftInfo({}).then(data => {
  if (!!!data.status) return false
  BZCoin.value = data
  // console.log('KGCoin.value', KGCoin.value)
})

const msgtext = `矿工币说明 </br>
</br>
1.矿工币是搬砖时使用的货币，需要有矿工币才能进行搬砖。</br>
</br>
2.在使用矿工币进行搬砖,在完成搬砖订单后会获得额外的矿工市奖励</br>
</br>
3.矿工币和人民币锚定1:1</br>
</br>
4.矿工币和USDT钱包可相互划转，划转汇率按当时人民币和USDT的汇率计算`

const showDIYDialog = () => {
  Dialog({
    title: '矿工币说明',
    message: msgtext,
    allowHtml: true,
    messageAlign: 'left',
    className: 'kgdialog',
    confirmButtonText: '确定'
  })
}

const { toClipboard } = clipboard3()
const copy = async (text: any) => {
  try {
    await toClipboard(text)
    showToast({
      message: '复制成功',
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

const goPage = (path: string) => {
  router.push(path)
}

const list = ref<any>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const status_index = ref(0)
watch(status_index, async e => {
  recordPageStatus()
  // onRefresh()
  // console.log('status_index', e)
  // let i = e > 2 ? e + 1 : e
  let i = status_tabs[e].status //
  // console.log('i', i)
  list.value = allList.value.filter((item: any) => {
    // console.log(
    //   !!!i,
    //   'i.split(",").includes(item.status)',
    //   item.status,
    //   i.split(',').includes(item.status + '')
    // )
    return !!!i ? allList.value : i.split(',').includes(item.status + '')
  })
})
const recordPageStatus = () => {
  router.replace({
    query: {
      status_index: status_index.value
    }
  })
}
onMounted(async () => {
  if (route.query.status_index && route.query.active_index) {
    status_index.value = Number(route.query.status_index)
  } else {
    onRefresh()
  }
  mitt.emit('action-sheet-show')
})
const status_tabs = [
  {
    title: '全部',
    status: '',
    frontend_status: ''
  },
  {
    title: '挂单中',
    status: '1',
    frontend_status: '1'
  },
  {
    title: '待确认',
    status: '2',
    frontend_status: '2'
  },
  // {
  //   title: '待收款',
  //   status: '3',
  // frontend_status: '3'
  // },
  {
    title: '待放行',
    status: '4',
    frontend_status: '4'
  },
  {
    title: '已挂起',
    status: '5',
    frontend_status: '6'
  },
  {
    title: '已完成',
    status: '6,8',
    frontend_status: '5'
  },
  {
    title: '已取消',
    status: '7',
    frontend_status: '7'
  }
]
const financial = (x: string) => {
  return x ? Number.parseFloat(x).toTruncFixed(2) : '0.00'
}

const oderParm = ref({
  page: 1, //	否	int	当前页码 默认1
  pagesize: 10 //	否	int	每页数据量 默认20
})
const onLoad = async () => {
  if (refreshing.value) {
    oderParm.value.page = 1
    list.value = []
    refreshing.value = false
  }

  const res = await getMyOrders(oderParm.value.page)
  if (!!!res) return false
  const count = res.count

  list.value.push(...(res.list ?? []))

  status_tabs[status_index.value].frontend_status == '' && (allList.value = list.value)

  loading.value = false
  oderParm.value.page = oderParm.value.page + 1

  if (list.value.length >= count) {
    finished.value = true
  }
}
const allList = ref<any>([])

// const getAllList = () => {
//   mySellOrdersApi({
//     pagesize: 10,
//     mtype: 30,
//     ...dateRangeArr.value[dateIndex.value].range()
//     // page
//     // frontend_status: orderStatus.value
//     // status: orderStatus.value
//   }).then(data => {
//     allList.value = data.list
//   })
// }
const getMyOrders = async (page: number) => {
  const [y, m, d] = [...date_start.value]
  let getDate_start = [y, m, d].join('-')
  const [y2, m2, d2] = [...date_end.value]
  let getDate_end = [y2, m2, d2].join('-')
  // console.log('ate_start.value', getDate_start)
  // console.log('date_end.value', getDate_start)
  try {
    let res
    res = await mySellOrdersApi({
      pagesize: 10,
      mtype: 30,
      page,
      // date_start: getDate_start,
      // date_end: getDate_end,
      ...dateRangeArr.value[dateIndex.value].range(),
      frontend_status: status_tabs[status_index.value].frontend_status
      // status: orderStatus.value
    })
    return res
  } catch (e) {
    console.log(e)
  }
}

const onRefresh = () => {
  // getAllList()
  // 清空列表数据
  finished.value = false
  oderParm.value.page = 1
  list.value = []

  // console.log(list.value, 'list.value')

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  onLoad()
}
const renderSellStatusText = (status: number) => {
  const sellStatusList = [
    { text: '挂单中', color: 'text-[#ff0000]' },
    { text: '确认交易中', color: 'text-[#ff0000]' },
    { text: '等待买家付款', color: 'text-[#ff0000]' },
    { text: '已付待收', color: 'text-[#ff0000]' },
    { text: '挂起待确认', color: 'text-[#ff0000]' },
    { text: '全部完成', color: 'text-[#58cf00]' },
    { text: '取消卖出', color: 'text-[#777]' },
    { text: '部分完成', color: 'text-[#58cf00]' }
  ]
  return sellStatusList[status - 1]
}

const onClickLeft = () => {
  // mitt.emit('buy_active', 1);
  history.go(-1)
}
</script>

<style lang="scss" src="./moveBrick.scss" scoped />
<style lang="scss">
.date-action-sheet1 {
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
