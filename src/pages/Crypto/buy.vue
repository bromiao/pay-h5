<template>
  <div class="coinBuy flex flex-col">
    <!-- <nav-bar
      title="买币"
      mode="blue"
      class="nav-bar"
    /> -->

    <!--    <van-nav-bar title="买币" left-arrow @click-left="onClickLeft" />-->
    <div class="content flex flex-col">
      <div
        class="clearfix"
        v-if="wideMode"
      ></div>
      <div
        class="clearfix"
        v-else
      >
        <div
          class="title_buy"
          :class="active == 0 ? 'active' : ''"
          @click="toggleBuyCoin()"
        >
          自选买币
        </div>
        <span class="left shu_f"></span>
        <div
          v-if="!onlineCharge"
          class="title_buy ml-[10px]"
          @click="toggleBuyCoin(1)"
          :class="active == 1 ? 'active' : ''"
        >
          快捷买币
        </div>
        <div
          v-else
          class="title_buy ml-[10px]"
          @click="toggleBuyCoin(2)"
          :class="[active == 2 ? 'active' : '', redDot ? 'redDot' : '']"
        >
          我的购买
          <div
            class="redDotNum flex_z"
            v-if="redDot"
          >
            {{ redDot }}
          </div>
        </div>
        <div
          class="!float-right title_buy username flex_s"
          v-if="onlineCharge"
        >
          <span class="!text-[22px] text-[#000]">
            {{
              authStore?.userInfo?.username?.length > 18
                ? authStore?.userInfo?.username.slice(0, 18) + '...'
                : authStore?.userInfo?.username
            }}
          </span>
          <div
            class="copy mx-[10px] w-[30px] !float-right text-[#3a2828]"
            @click="copy(authStore?.userInfo?.username)"
          ></div>
        </div>
      </div>

      <wideModeSelfSelect v-if="active == 0 && wideMode"></wideModeSelfSelect>
      <SelfSelect v-else-if="active == 0"></SelfSelect>
      <QuickCoins
        :sellData="{}"
        v-if="active == 1"
      ></QuickCoins>
      <wideMode_Order
        v-if="active == 2 && wideMode"
        class="onlineCharge_Order ml-[-20px] !bg-[#ebf1f6]"
      ></wideMode_Order>
      <Order
        v-else-if="active == 2"
        class="onlineCharge_Order ml-[-20px] !bg-[#ebf1f6]"
      ></Order>
    </div>
  </div>
</template>

<script setup lang="ts">
import verified from '@/assets/images/common/verified.png'
import { useAuthStore } from '@/store/modules/auth'
import { BuyOrder } from '@/store/types/buySellCoin'
import { mergeHrefParams } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { computed, onMounted, ref, watch } from 'vue'
import clipboard3 from 'vue-clipboard3'
import { useRoute, useRouter } from 'vue-router'
import Order from '../Order/index.vue'
import wideMode_Order from '../Order/wide.vue'
import QuickCoins from './components/QuickCoins.vue'
import SelfSelect from './components/SelfSelect.vue'
import wideModeSelfSelect from './components/wideModeSelfSelect.vue'
const search = new URLSearchParams(mergeHrefParams())
const hs = search.get('hs') || ''
const wideMode = hs == 'h'
const route = useRoute()
const router = useRouter()
const active = ref(0)
const onClickLeft = () => history.go(-1)
const onlineCharge = ref(false)
const authStore = useAuthStore()
const { processnum } = storeToRefs(authStore)

watch(route, e => {
  active.value = (e.query.active && +e.query.active) || 0
})

// 未处理订单数(过滤掉搬砖卖币)
const redDot = computed(() => {
  const buyOrders =
    processnum.value?.buy_orders?.filter((item: BuyOrder) => item.mtype !== 30) ?? []
  return buyOrders.length
})
// console.log('redDot', redDot.value)
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
// 切换买币类型
const toggleBuyCoin = (type: number = 0) => {
  active.value = type
  onlineCharge.value
    ? router.replace('/onlineCharge?active=' + type)
    : router.replace('/index?active=' + type)
}
onMounted(() => {
  const { query, path } = route
  active.value = query.active ? +query.active : 0
  onlineCharge.value = path.includes('onlineCharge') ? true : false
  // console.log('route', route)
})
</script>

<style lang="scss" src="./buy.scss" scoped />
<style scoped lang="scss">
$spriteHome: '@/assets/images/sprites-home.png';
$sprite-computed-factor: 0.7;
$sprite-home-background-size: calc(108px * 7 / 10) calc(730px * 7 / 10);

.copy {
  background: url($spriteHome) calc(-0px * $sprite-computed-factor)
    calc(-616px * $sprite-computed-factor) no-repeat;
  width: calc(35px * $sprite-computed-factor);
  height: calc(35px * $sprite-computed-factor);
  background-size: $sprite-home-background-size;
}
.title_buy {
  position: relative;
}
.redDotNum {
  position: absolute;
  right: -8px;
  top: 18px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  font-size: 22px;
  background: red;
  color: #fff;
  border-radius: 50%;
}
</style>
