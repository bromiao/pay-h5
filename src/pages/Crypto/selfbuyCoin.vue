<template>
  <nav-bar
    title="购买"
    :class="wideMode ? 'wideModenav' : ''"
    mode="blue"
    class="nav-bar"
  />
  <div
    class="coinBuy buy"
    :class="wideMode ? 'wideMode' : ''"
  >
    <div class="content">
      <div class="sell_c clearfix">
        <div
          class="left ml-[10px]"
          v-if="onlineCharge"
        >
          <p class="text-[24px] my-[5px]">
            商品金额：
            <span class="text-[red]">{{ data.remaining_num }}</span>
            CNY
          </p>
          <p class="text-[24px] my-[5px]">
            是否可拆分：
            <span :class="data.is_split == 1 ? 'text-[#5cc300]' : 'text-[red]'">
              {{ data.is_split == 1 ? '可拆分' : '不可拆分' }}
            </span>
          </p>
          <p
            class="text-[24px] my-[5px]"
            v-if="!wideMode"
          >
            交易成功率{{ data.statistics?.completion_rate || '0.00' }}%，平均回应时长{{
              data.statistics?.response_time || '0'
            }}分钟
          </p>
        </div>
        <div
          class="left pic flex_s"
          v-else
        >
          <van-image
            class="credit"
            :src="photo"
          />
          <span class="userName van-ellipsis">{{ data.nickname }}</span>
        </div>
        <div
          class="right s_amount"
          v-if="!onlineCharge"
        >
          {{ data.remaining_num }}
          <span>{{ onlineCharge ? 'CNY' : coin_name }}</span>
        </div>
        <div
          class="right s_amount !h-[80px]"
          v-else-if="onlineCharge && wideMode"
        >
          <p class="text-[24px] my-[5px]">
            交易成功率{{ data.statistics?.completion_rate || '0.00' }}%，平均回应时长{{
              data.statistics?.response_time || '0'
            }}分钟
          </p>
        </div>
      </div>
      <wideModeQuickCoins
        v-if="wideMode"
        :sellData="data"
      ></wideModeQuickCoins>
      <QuickCoins
        v-else
        :sellData="data"
      ></QuickCoins>
    </div>
  </div>
</template>

<script setup lang="ts">
const coin_name = sessionStorage.getItem('coin_name')
import { useAppBar } from '@/components/AppBar/useAppBar'
import { useEntryStore } from '@/store/modules/entry'
import { mergeHrefParams } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import QuickCoins from './components/QuickCoins.vue'
import wideModeQuickCoins from './components/wideModeQuickCoins.vue'
const search = new URLSearchParams(mergeHrefParams())
const hs = search.get('hs') || ''
const wideMode = hs == 'h'
if (wideMode) {
  document.body.classList.add('wideMode')
}
useAppBar({ mode: 'dark' })

const EntryStore = useEntryStore()
const { config } = storeToRefs(EntryStore)
const imgserver_url = computed(() => {
  // console.log('(imgserver_url',(config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v);
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v || ''
})
const route = useRoute()
const data = ref({
  nickname: '',
  headimg: '',
  is_split: 0,
  statistics: { completion_rate: '', response_time: '' },
  remaining_num: ''
})
const { query, path } = route
data.value = query.data ? JSON.parse(query.data as string) : {}
data.value.remaining_num && (data.value.remaining_num = (+data.value.remaining_num).toTruncFixed(2))
// console.log('data',data.value);
const onlineCharge = ref(path.includes('onlineCharge'))
const operation_verification = sessionStorage.getItem('operation_verification')
onlineCharge.value = !!operation_verification
  ? true
  : +(query.onlineCharge as string) == 1
  ? true
  : false
onMounted(() => {})

const photo = computed(() => {
  // console.log('imgserver_url', data.value);
  // console.log('V.headimg',imgserver_url + data.value.headimg);
  return imgserver_url.value + data.value.headimg
})

const onClickLeft = () => {
  // mitt.emit('buy_active', 1);
  history.go(-1)
}
</script>
<style lang="scss" src="./buy.scss" scoped />
<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.nav-bar {
  padding-bottom: 50px;
}
.content {
  height: 99% !important;
  overflow: auto !important;
}
.sell_c {
  width: 100%;
  padding: 25px 0 0;

  .pic {
    width: 50%;

    .van-image {
      width: 67.4px;
      height: 67.4px;
      border-radius: 13.9px;
      overflow: hidden;
    }

    .userName {
      font-family: MicrosoftYaHei;
      font-size: 22.2px;
      font-weight: 400;
      font-stretch: normal;
      line-height: 26.7px;
      letter-spacing: 0px;
      color: #13161b;
      margin-left: 10px;
      vertical-align: super;
    }
  }

  .s_amount {
    font-family: MicrosoftYaHei;
    font-size: 22.2px;
    font-weight: 400;
    font-stretch: normal;
    line-height: 90px;
    letter-spacing: 0px;
    color: #000;
    margin-left: 10px;
  }
}
.wideMode {
  transform: scale(0.6);
  transform-origin: 0 0;
  width: calc(1 / 0.6) * 100%;
  height: calc(1 / 0.6) * 100vh;
  .content {
    height: calc(1 / 0.6 * 100% - 45pxsss) !important;
  }
  .sell_c {
    padding-bottom: 10px !important;
  }
  .wideModenav {
    padding-bottom: 0;
    :deep(.van-nav-bar__content) {
      .van-nav-bar__left {
        .arrow-right {
          transform: rotate(180deg) scale(1.2);
        }
        .arrow-back {
          margin-left: 18px;
        }
      }
      .van-nav-bar__title {
        transform: scale(0.5);
      }
    }
  }
  .sell_c {
    padding: 10px 0 0;
  }
}
</style>
