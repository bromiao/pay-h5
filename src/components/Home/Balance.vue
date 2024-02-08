<script setup lang="ts">
const coin_name = sessionStorage.getItem('coin_name')
import { useAuthStore } from '@/store/modules/auth'
import mitt from '@/utils/mitt'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Props {
  money: {
    coinCash: string | number
    canSale: string | number
    notSale: string | number
  }
}

const props = withDefaults(defineProps<Props>(), {
  money: () => ({
    coinCash: '0',
    canSale: '0',
    notSale: '0'
  })
})

const authStore = useAuthStore()
const { token, userInfo, getUserMoneyByMType, getFreezeMoney, processnum } = storeToRefs(authStore)

const route = useRoute()
const router = useRouter()
const showTips = ref(false)
const actions = [{ text: '不允许挂单出售，仅允许充值到商户' }]

const isLogin = computed(() => !!token.value)

const goFundingDetails = () => {
  if (!isLogin.value) {
    router.push('/auth/login')
  } else {
    router.push('/details/funding-details')
  }
}

// 点击其他区域时，关闭不可售tips
const handleCloseInfoTips = () => {
  if (showTips.value) {
    showTips.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleCloseInfoTips)

  // 获取coins信息
  authStore.getUserCoin({})
  // 获取最新用户信息
  authStore.getUserInfo().then(() => {
    if (route.name === 'Home' && processnum.value?.total) {
      mitt.emit('global-notification', { type: 'ProcessOrder', value: processnum.value })
    }
  })
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleCloseInfoTips)
})
</script>

<template>
  <div class="balance-container">
    <div class="balance-content3 flex flex-col justify-between">
      <div class="coin-cash-container flex justify-center items-center">
        <div>余额</div>
        <div class="amount">{{ money.coinCash }}</div>
        <div>{{ coin_name }}</div>
        <div
          v-if="route.name === 'Home'"
          class="funding-details"
          @click="goFundingDetails"
        >
          资金明细
        </div>
      </div>
      <div class="coin-other-container relative flex justify-between items-center">
        <div class="item-sale flex justify-between items-center">
          <div class="title">可售</div>
          <div class="amount">{{ money.canSale }}</div>
        </div>
        <div class="item-sale flex justify-between items-center">
          <div class="title">不可售</div>
          <div class="amount">{{ money.notSale }}</div>
        </div>

        <div
          class="info-tips-container"
          @click.stop
        >
          <div
            class="help icon-help-pos"
            @click="showTips = !showTips"
          ></div>
          <div
            v-show="showTips"
            class="money-tips-container tips-arrow text-justify"
          >
            不允许挂单出售，仅允许充值到商户
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.balance-container {
  width: 100%;
  .title {
    font-size: 26px;
    color: #787f8c;
  }
  .balance-content {
    font-size: 49px;
    .balance-value {
      color: #13161b;
      font-weight: bold;
    }
    .balance-sell-status {
      padding-bottom: 10px;
      font-size: 31px;
    }
  }
  .balance-content2 {
    padding: 0 0 44px 18px;
    .coin-cash-container {
      margin-bottom: 70px;
      padding: 0 37px 0 0;
      font-size: 26px;
      color: #787f8c;
      gap: 10px 0;
      .amount {
        font-size: 78px;
        font-weight: bold;
        color: #13161b;
      }
      .funding-details {
        margin-left: 39px;
        color: var(--van-button-primary-background);
      }
    }
    .coin-other-container {
      padding: 0 170px 0 0;
      .item-sale {
        gap: 0 20px;
        font-size: 26px;
        color: #787f8c;
      }
      .amount {
        font-size: 31px;
        font-weight: bold;
        color: #13161b;
      }
    }
  }

  .balance-content3 {
    padding: 32px 0 28px 0;
    gap: 34px 0;
    .coin-cash-container {
      font-size: 26px;
      color: #787f8c;
      .amount {
        margin: -4px 17px 0 33px;
        font-size: 49px;
        font-weight: bold;
        color: #13161b;
      }
      .funding-details {
        margin-left: 39px;
        font-size: 25px;
        color: var(--van-button-primary-background);
      }
    }
    .coin-other-container {
      padding: 0 84px 0 50px;
      .item-sale {
        gap: 0 32px;
      }
      .amount {
        font-size: 31px;
        font-weight: bold;
        color: #13161b;
      }
    }
  }
  .info-tips-container {
    position: absolute;
    right: 40px;
    bottom: 0;
  }
  .icon-help-pos {
    filter: brightness(0.9);
  }
  .money-tips-container {
    position: absolute;
    right: -60px;
    bottom: -112px;
    width: 313px;
    height: auto;
    line-height: 28px;
    padding: 19px 22px;
    background-color: #fff;
    color: var(--van-button-primary-background);
    font-size: 22px;
    border-radius: 10px;
    -webkit-filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
    filter: drop-shadow(0 2px 12px rgba(50, 50, 51, 0.12));
    user-select: none;
    z-index: 1000;

    &.tips-arrow::before {
      content: '';
      position: absolute;
      top: 0;
      right: 64px;
      margin-top: -14px;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      border-width: 16px;
      border-top-width: 0;
      border-bottom-color: #fff;
    }
  }
}
</style>
