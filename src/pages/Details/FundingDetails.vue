<template>
  <div class="nav-bar">
    <nav-bar title="资金明细" />
  </div>

  <div class="funding-details-container">
    <div class="top-container flex flex-col items-center justify-center">
      <Balance
        :money="{
          coinCash: Number(getUserMoneyByMType(1)?.available_coincash ?? '0').toTruncFixed(3),
          canSale: canSaleAmount as unknown as number,
          notSale: notSaleAmount as unknown as number
        }"
      />
    </div>

    <div class="funding-details-list-container">
      <pull-refresh
        :loading="isLoading"
        @refresh="getFundingDetailsData('refresh')"
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
            :data="fundingDetailsData"
          />
        </van-list>
      </pull-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMoneyDetailsApi } from '@/apis/user'
import { useAppBar } from '@/components/AppBar/useAppBar'
import Balance from '@/components/Home/Balance.vue'
import { useAuthStore } from '@/store'
import { IMoneyDetailsItem } from '@/store/types/coin'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

useAppBar({ mode: 'dark' })
const authStore = useAuthStore()
const { getUserMoneyByMType, getFreezeMoney, userInfo } = storeToRefs(authStore)

type TIMoneyDetailsItem = Partial<IMoneyDetailsItem>
const fundingDetailsData = ref<TIMoneyDetailsItem[]>([])

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

// 可售金额
const canSaleAmount = computed(() => {
  const coinCash = +(getUserMoneyByMType.value(1)?.available_coincash ?? 0)
  const freeSellAmount = +userInfo.value.freesell_amount

  if (freeSellAmount > coinCash) return coinCash.toTruncFixed(2)
  return freeSellAmount < 0 ? '0.00' : freeSellAmount.toTruncFixed(2)
})

// 不可售金额
const notSaleAmount = computed(() => {
  const coinCash = +(getUserMoneyByMType.value(1)?.available_coincash ?? 0)
  return (coinCash - +canSaleAmount.value).toTruncFixed(2)
})

const onLoad = () => {
  getFundingDetailsData('load-more')
}

const getFundingDetailsData = async (type = '') => {
  try {
    if (isLoading.value || isRefreshing.value) return

    if (type === 'refresh') {
      page.value = 1
      isLoading.value = true
      isRefreshing.value = true
    } else if (type === 'load-more') {
      listLoading.value = page.value !== 1 && !!fundingDetailsData.value.length
    } else {
      isLoading.value = true
    }

    finished.value = false

    const res = await getMoneyDetailsApi({
      mtype: '1',
      page: page.value
    })

    if (!res.count) {
      fundingDetailsData.value = []
      return
    }

    const list = res.data ?? []

    if (type === 'refresh') {
      fundingDetailsData.value = list
    } else {
      fundingDetailsData.value.push(...list)
    }

    if (fundingDetailsData.value.length < res.count) {
      page.value++
    }
    if (fundingDetailsData.value.length === res.count) {
      finished.value = true
    }

    window.log('资金明细', res)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    listLoading.value = false
    isRefreshing.value = false
  }
}

onMounted(() => {
  getFundingDetailsData()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.funding-details-container {
  width: 100%;
  height: calc(100% - 120px);
  .top-container {
    height: 184px;
    // padding: 20px 0 29px 0;
    background-color: var(--van-button-primary-background);
    .balance-text {
      color: #94c3ff;
      font-size: 33px;
    }
    .balance-content {
      color: #fff;
      font-size: 49px;
      .amount {
        margin-right: 17px;
        font-weight: bold;
      }
    }

    :deep(.balance-container) {
      // height: 95px;
      // padding: 0 113px 0 74px;
      // padding-left: 50px;
      // padding-right: 15px;
      padding: 0 15px;
      .balance-content {
        width: 100%;
        height: 100%;
      }
      .balance-content3 {
        padding-right: 15px;
      }
      .coin-cash-container {
        padding: 0;
        justify-content: center;
      }
      .coin-cash-container,
      .title {
        color: #94c3ff;
      }
      .balance-value,
      .amount {
        color: #fff;
      }
    }
  }

  .funding-details-list-container {
    width: 100%;
    height: calc(100% - 184px);
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
