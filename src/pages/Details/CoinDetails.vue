<template>
  <div class="nav-bar-container">
    <nav-bar
      :title="title"
      mode="blue"
    />
  </div>

  <div class="coin-details-container">
    <div class="top-container flex flex-col items-center justify-center">
      <div class="balance-text">余额</div>
      <div class="balance-content">
        <span class="amount">{{ balance.toTruncFixed(2) }}</span>
        <span>{{ coin.unit }}</span>
      </div>
    </div>

    <div class="coin-details-list-container">
      <pull-refresh
        :loading="isLoading"
        @refresh="getCoinDetailsData('refresh')"
      >
        <van-list
          v-model:loading="listLoading"
          :finished="finished"
          :immediate-check="false"
          finished-text="没有更多了"
          @load="onLoad"
          class="details-list"
        >
          <user-money-details
            v-show="!isLoading"
            :data="coinDetailsData"
          />
        </van-list>
      </pull-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMoneyDetailsApi } from '@/apis/user'
import { useAppBar } from '@/components/AppBar/useAppBar'
import { useUserStore } from '@/store/modules/user'
import { IMoneyDetailsItem } from '@/store/types/coin'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

useAppBar({ mode: 'dark' })

// 币种类型映射表
const coinMap = {
  point: {
    title: '积分',
    mtype: '20',
    unit: '积分'
  },
  kgb: {
    title: '矿工币',
    mtype: '30',
    unit: 'CNY'
  },
  usdt: {
    title: 'USDT',
    mtype: '2',
    unit: 'USDT'
  }
} as Record<string, any>

const route = useRoute()
const coin = reactive(coinMap[route.params.type as string])
const title = ref(coin.title + '明细')

const balance = ref(0)
type TIMoneyDetailsItem = Partial<IMoneyDetailsItem>
const coinDetailsData = ref<TIMoneyDetailsItem[]>([])

// 当前页数
const page = ref(1)
// loading状态
const isLoading = ref(false)
// 列表内容loading
const listLoading = ref(false)
// 全部内容加载完成
const finished = ref(false)
// 是否正在刷新
const isRefreshing = ref(false)

const userStore = useUserStore()
const { getAllMType } = userStore

const onLoad = () => {
  getCoinDetailsData('load-more')
}

const getCoinDetailsData = async (type = '') => {
  try {
    if (isLoading.value || isRefreshing.value) return

    if (type === 'refresh') {
      page.value = 1
      isLoading.value = true
      isRefreshing.value = true
    } else if (type === 'load-more') {
      listLoading.value = page.value !== 1 && !!coinDetailsData.value.length
    } else {
      isLoading.value = true
    }

    finished.value = false

    const res = await getMoneyDetailsApi({
      mtype: coin.mtype,
      page: page.value
    })

    if (page.value === 1) {
      balance.value = +(res.data[0]?.money_cash ?? '0')
    }

    if (!res.count) {
      coinDetailsData.value = []
      return
    }

    const list = res.data ?? []

    if (type === 'refresh') {
      coinDetailsData.value = list
    } else {
      coinDetailsData.value.push(...list)
    }

    if (coinDetailsData.value.length < res.count) {
      page.value++
    }
    if (coinDetailsData.value.length === res.count) {
      finished.value = true
    }

    window.log('积分明细', res)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    listLoading.value = false
    isRefreshing.value = false
  }
}

onMounted(() => {
  // 获取所有mtype
  // getAllMType({})
  getCoinDetailsData()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.nav-bar-container {
  // width: 100%;
  // height: 90px;
}
.coin-details-container {
  width: 100%;
  height: calc(100% - 120px);
  .top-container {
    height: 150px;
    padding: 0 0 28px 0;
    background-color: var(--van-button-primary-background);
    .balance-text {
      flex: 1;
      color: #94c3ff;
      font-size: 33px;
    }
    .balance-content {
      flex: 1;
      color: #fff;
      font-size: 49px;
      .amount {
        margin-right: 17px;
        font-weight: bold;
      }
    }
  }

  .coin-details-list-container {
    width: 100%;
    height: calc(100% - 150px);
    :deep(.van-pull-refresh) {
      overflow: auto;
      scroll-behavior: smooth;
    }
    :deep(.details-list) {
      .user-money-details-container {
        height: auto;
        overflow: unset;
      }
    }
  }
}
</style>
