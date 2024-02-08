<script setup lang="ts">
import brickMakeMoney from '@/assets/images/bricks/brick-make-money.png'
import topIconBgImg from '@/assets/images/common/icon_bg.png'
import { useAppBar } from '@/components/AppBar/useAppBar'
import Bulletin from '@/components/Home/Bulletin.vue'
import Slider from '@/components/Home/Slider.vue'
import BuyCoin from '@/pages/Crypto/buy.vue'
import { useEntryStore } from '@/store'
import { useArticleStore } from '@/store/modules/article'
import { useAuthStore } from '@/store/modules/auth'
import { useUserStore } from '@/store/modules/user'
import { IArticleListType } from '@/store/types/article'
import { SellOrder } from '@/store/types/buySellCoin'
import { IADModWebUrlLink, INormal } from '@/store/types/entry'
import mitt from '@/utils/mitt'
import { requireImg } from '@/utils/tools'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 异步加载我的挂单
const MyPendingOrder = defineAsyncComponent(() => import('@/components/Home/MyPendingOrder.vue'))

const topIconBg = ref(`url(${topIconBgImg})`)

useAppBar({ mode: 'dark' })

const entryStore = useEntryStore()
const { config } = storeToRefs(entryStore)

const domain = computed(() => {
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as INormal).v || ''
})

const adModWebUrlLink = computed<IADModWebUrlLink>(
  () => (config.value.Web_Set_DefaultInfo?.AD_Mod_WebUrlLink ?? {}) as IADModWebUrlLink
)

const router = useRouter()
const changeRoute = (path: string) => {
  router.push(path)
}

const authStore = useAuthStore()
const { userInfo, processnum } = storeToRefs(authStore)
const logout = () => {
  authStore.logout()
  router.push('/auth/login')
}

const currArticleIndex = ref(0)
const dialog = reactive({
  show: false,
  data: {} as IArticleListType,
  allowShow: true
})
const dialogBgImg = ref(`url('')`)
const articleStore = useArticleStore()
const { getArticleListApi, updateHomeNoticeList, updateHomeNoticeShowStatus } = articleStore
const { openNotice, homeNoticeShowList, homeNoticeShowStatus } = storeToRefs(articleStore)

const onClose = () => {
  const _homeNoticeShowList = cloneDeep(homeNoticeShowList).value
  const dateNow = dayjs().format('YYYY-MM-DD')

  // 更新当前弹窗今日显示状态
  _homeNoticeShowList[currArticleIndex.value] = dialog.allowShow ? true : dateNow
  updateHomeNoticeList(_homeNoticeShowList)

  currArticleIndex.value++
  dialog.show = false

  setTimeout(() => {
    window.log(
      '关闭',
      currArticleIndex.value,
      dialog,
      _homeNoticeShowList,
      homeNoticeShowList.value[currArticleIndex.value]
    )

    // 如果当前公告索引值小于公告列表长度，就设置下一个公告弹窗内容，否则，就更新首页公告显示状态
    if (currArticleIndex.value < openNotice.value.length) {
      const dateReg = /^\d{4}-\d{2}-\d{2}$/
      let date = null
      if (dateReg.test(_homeNoticeShowList[currArticleIndex.value] as string)) {
        date = _homeNoticeShowList[currArticleIndex.value]
      }

      if (dayjs().isSame(dayjs(date as string), 'day')) return

      dialog.data = openNotice.value[currArticleIndex.value]
      dialogBgImg.value = dialog.data.img ? `url(${domain.value + dialog.data.img})` : `url('')`
      dialog.allowShow = true
      dialog.show = true
    } else {
      updateHomeNoticeShowStatus(false)
    }
  }, 50)
}

const handleOpenNoticeData = async () => {
  try {
    const res = openNotice.value

    window.log('弹窗公告内容', res)
    if (res.length) {
      const _homeNoticeShowList = cloneDeep(homeNoticeShowList).value.map(
        (item: any) => typeof item === 'boolean' || !dayjs().isSame(dayjs(item), 'day') || item
      )
      const allShow = _homeNoticeShowList.every((item: any) => item === true)

      updateHomeNoticeList(allShow ? [] : _homeNoticeShowList)

      // 未点击过 '今日不再显示'
      if (!_homeNoticeShowList.length) {
        dialog.data = res[0]
        dialogBgImg.value = dialog.data.img ? `url(${domain.value + dialog.data.img})` : `url('')`
        dialog.show = true
        return
      }

      const showNoticeIndex = _homeNoticeShowList.findIndex((item: any) => item === true)

      window.log('homeNoticeShowList', homeNoticeShowList)

      // 首页公告弹窗过滤出今日要显示的公告列表，若存在，则显示
      if (~showNoticeIndex) {
        currArticleIndex.value = showNoticeIndex
        dialog.data = res[showNoticeIndex]
        dialogBgImg.value = dialog.data.img ? `url(${domain.value + dialog.data.img})` : `url('')`
        dialog.show = true
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const onCheck = () => {
  dialog.allowShow = !dialog.allowShow
}

const { token, getUserMoneyByMType, getFreezeMoney } = storeToRefs(authStore)

const goPage = (routePath: string) => {
  if (!routePath) return
  router.push(routePath)
}

// 可售金额
const canSaleAmount = computed(() => {
  const coinCash = +(getUserMoneyByMType.value(1)?.available_coincash ?? 0)
  const freeSellAmount = +(userInfo.value?.freesell_amount ?? 0)

  if (freeSellAmount > coinCash) return coinCash.toTruncFixed(2)
  return freeSellAmount < 0 ? '0.00' : freeSellAmount.toTruncFixed(2)
})

// 不可售金额
const notSaleAmount = computed(() => {
  const coinCash = +(getUserMoneyByMType.value(1)?.available_coincash ?? 0)
  return (coinCash - +canSaleAmount.value).toTruncFixed(2)
})

const handleArticleData = () => {
  // 如果公告今日未显示过，就获取公告数据，进行显示
  if (homeNoticeShowStatus.value) {
    handleOpenNoticeData()
  }
}

const userStore = useUserStore()
const { getUserMessageList } = userStore
const { userMessage } = storeToRefs(userStore)
// 站内信未读数量
const unReadCount = computed(() => userMessage.value.un_read ?? 0)
// 搬砖卖币未处理订单数
const unHandleOrderCount = computed(() => {
  const sellOrders =
    processnum.value?.sell_orders?.filter((item: SellOrder) => item.mtype === 30) ?? []

  return sellOrders.length
})

const route = useRoute()

onMounted(() => {
  // 获取最新用户信息
  authStore.getUserInfo().then(() => {
    if (route.name === 'Home' && processnum.value?.total) {
      mitt.emit('global-notification', { type: 'ProcessOrder', value: processnum.value })
    }
  })
  // 获取站内信未读数量
  getUserMessageList({})
})
</script>

<template>
  <template v-if="!adModWebUrlLink.theme_activities_show">
    <nav-bar
      class="nav-bar"
      title="买币"
      mode="icons"
    />
    <div class="blue-bg"></div>
  </template>
  <template v-else>
    <div
      class="activity-bg"
      @click.self="goPage('/activity/collect-cards')"
    >
      <nav-bar
        v-if="adModWebUrlLink.theme_activities_show"
        class="nav-bar"
        title="买币"
        mode="icons"
      />
      <Bulletin @update-article="handleArticleData" />
      <img
        class="yanhua01"
        :src="requireImg('activity/yanhua01.png')"
      />
      <img
        class="yanhua02"
        :src="requireImg('activity/yanhua02.png')"
      />
      <img
        class="yanhua03"
        :src="requireImg('activity/yanhua03.png')"
      />
      <img
        class="denglong"
        :src="requireImg('activity/denglong.png')"
      />

      <div
        class="btn-activity-container"
        @click="goPage('/activity/collect-cards')"
      >
        <div class="btn-get-now"></div>
      </div>

      <div class="border-highlight"></div>
    </div>
  </template>

  <div
    class="home-container flex flex-col"
    :class="{ 'mt-t0': adModWebUrlLink.theme_activities_show }"
  >
    <div class="main-content-container flex flex-col">
      <template v-if="!adModWebUrlLink.theme_activities_show">
        <Bulletin @update-article="handleArticleData" />
        <Slider />
      </template>
      <BuyCoin />
    </div>

    <div
      class="go-banzhuan flex items-start"
      @click="goPage('/bricks/move-brick')"
    >
      <!-- <i class="banzhuan"></i> -->
      <img :src="brickMakeMoney" />
      <span>搬砖赚钱</span>
      <div
        v-if="unHandleOrderCount"
        class="process-order-sign"
      >
        {{ unHandleOrderCount }}
      </div>
    </div>

    <van-dialog
      v-model:show="dialog.show"
      :title="dialog.data.img ? '' : dialog.data.desc"
      theme="round-button"
      :className="['dialog-open-notice', { 'dialog-bg-img': dialog.data.img }]"
      @confirm="onClose"
    >
      <i
        class="icon-close block"
        :class="dialog.data.img ? 'close-white' : 'close-dark'"
        @click="onClose"
      ></i>
      <div
        class="dialog-content"
        v-html="dialog.data.img ? '' : dialog.data.content"
        v-content
      ></div>

      <template #footer>
        <div
          class="btn-confirm flex items-center justify-center"
          @click="onClose"
        >
          我知道了
        </div>
        <div class="dialog-radio-controler flex items-center justify-center">
          <i
            class="radio"
            :class="dialog.allowShow ? 'radio-uncheck' : 'radio-checked'"
            @click="onCheck"
          ></i>
          <div class="radio-text">今日不再显示</div>
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';
@import '@/assets/styles/sprite-001.scss';
.blue-bg {
  width: 100%;
  height: 30px;
  background-color: var(--van-button-primary-background);
}

.activity-bg {
  position: relative;
  width: 10rem;
  flex: 0 0 460px;
  background: url('@/assets/images/activity/activity-banner-bg.png') no-repeat left top / cover;
  background-size: 100% 422px;
  .nav-bar--icons {
    background-color: transparent;
  }
  .bulletin-container {
    width: 676px;
    height: 47px;
    margin: 0 auto;
    padding: 0 18px;
    color: #fff1cf;
    font-size: 23px;
    background-color: rgba(0, 0, 0, 0.12);
    border-radius: 30px;
  }

  .btn-activity-container {
    position: absolute;
    width: 286px;
    height: 85px;
    bottom: 0;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    overflow: hidden;
  }
  .btn-get-now {
    position: relative;
    width: 100%;
    height: 100%;
    background: url('@/assets/images/activity/btn-get-now.png') no-repeat center / cover;
    background-size: 100% 100%;
    animation: btnScale 1s ease-in-out infinite;
    &::after {
      content: '';
      width: 100px;
      height: 85px;
      background: url('@/assets/images/activity/btn-guang.png') no-repeat center / cover;
      background-size: 100% 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      animation: glareMove 2.5s 1s linear infinite;
    }
  }

  .yanhua01 {
    width: 56px;
    height: 75px;
    position: absolute;
    top: 125px;
    left: 0;
    opacity: 0;
    animation: yanhuaBloom01 3s ease-in-out infinite;
  }
  .yanhua02 {
    width: 53px;
    height: 53px;
    position: absolute;
    top: 143px;
    left: 124px;
    opacity: 0;
    animation: yanhuaBloom01 3s 1s ease-in-out infinite;
  }
  .yanhua03 {
    width: 89px;
    height: 67px;
    position: absolute;
    top: 128px;
    right: 0;
    opacity: 0;
    animation: yanhuaBloom01 3s 2s ease-in-out infinite;
  }
  .denglong {
    width: 77px;
    height: 84px;
    position: absolute;
    top: 113px;
    right: 124px;
    opacity: 0;
    animation: denglongMove 2s 2s ease-in-out infinite;
  }

  .border-highlight {
    width: 130px;
    height: 57px;
    background: url('@/assets/images/activity/border-guang.png') no-repeat center / cover;
    background-size: 100% 100%;
    position: absolute;
    bottom: 250px;
    // left: 186px;
    left: 170px;
    opacity: 0;
    animation: borderHighlight 4s ease-in-out infinite;
  }
}

.home-container {
  position: relative;
  width: 100%;
  height: calc(100% - 30px);
  margin-top: -30px;
  background-color: #ebf1f6;
  overflow: hidden;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  &.mt-t0 {
    margin-top: 0;
    .go-banzhuan {
      top: 30px;
    }
  }

  .topbar-container {
    width: 100%;
    height: 264px;
    flex: 0 0 264px;
    padding: 0 30px;
    box-sizing: border-box;
    background-color: var(--van-button-primary-background);

    .topbar-content-view {
      position: relative;
      width: 100%;
      height: 90px;

      .top-icon-bg {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 132px;
        height: 50px;
        padding: 0 19px;
        background: v-bind('topIconBg') no-repeat center / cover;
      }

      .logo-container {
        position: absolute;
        top: 48px;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .home-top-logo {
          width: 45px;
        }

        .text-logo {
          margin-left: 10px;
          font-size: 42px;
          color: #fff;
        }
      }

      .help {
        margin: 0 28px;
      }

      .message {
        position: relative;
        margin-bottom: -3px;
        margin-right: auto;
      }

      .unread-sign {
        position: absolute;
        top: -7px;
        right: -9px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        background-color: red;
        color: #fff;
        font-size: 14px;
        text-align: center;
        border-radius: 50%;
      }
    }
  }

  .main-content-container {
    flex: 1;
    width: 100%;
    padding: 0 20px;

    .wallet-info-container {
      position: relative;
      width: 100%;
      z-index: 1;

      .wallet-info {
        width: 100%;
        // margin-top: -140px;
        border-radius: 14px;
        background-color: #fff;

        .wallet-main-content {
          padding: 21px;
          font-size: 26px;
          color: #868d9a;

          .text-funding-details {
            color: var(--van-button-primary-background);
          }
        }
      }
    }
  }

  .go-banzhuan {
    position: absolute;
    right: 0;
    top: 356px;
    width: 198px;
    height: 52px;
    padding: 10px 0 12px 22px;
    color: #fff;
    background-color: #fea703;
    font-size: 25px;
    border-top-left-radius: 26px;
    border-bottom-left-radius: 26px;
    white-space: nowrap;
    img {
      width: 31px;
      height: 31px;
      margin-right: 7px;
    }
    .process-order-sign {
      position: absolute;
      top: -7px;
      right: 6px;
      width: 35px;
      height: 35px;
      line-height: 35px;
      background-color: #d9001c;
      color: #fff;
      font-size: 21px;
      text-align: center;
      border-radius: 50%;
    }
  }

  :deep(.dialog-open-notice) {
    width: 708px;
    height: auto;
    padding: 40px;

    .van-dialog__header {
      padding: 0;
      font-size: 29px;
      color: #13161b;
    }

    .van-dialog__content {
      max-height: 600px;
      margin: 33px 0 35px 0;
      font-size: 25px;
      color: #787f8c;
      text-align: justify;
      overflow-y: auto;
    }

    .dialog-content {
      img {
        width: 100%;
        &[alt*='['] {
          width: auto;
        }
      }
    }

    .van-dialog__footer {
      padding: 0;
    }

    .van-dialog__confirm,
    .btn-confirm {
      width: 100%;
      height: 80px;
      font-size: 31px;
      background: var(--van-button-primary-background);
      color: #fff;
      border: 0;
      border-radius: 8px;
    }

    .dialog-radio-controler {
      margin-top: 20px;

      .radio {
        margin-right: 10px;
      }

      .radio-uncheck {
        width: 35px;
        height: 35px;
        border: 1px solid #868d9a;
        border-radius: 50%;
      }

      .radio-text {
        font-size: 25px;
        color: #13161b;
      }
    }

    .icon-close {
      position: absolute;
      right: 40px;
      top: 24px;
    }

    img {
      width: 100%;
      margin-top: 20px;
    }

    &.dialog-bg-img {
      padding: 0;

      .van-dialog__content {
        height: 572px;
        max-height: 600px;
        margin: 0;
        background: v-bind('dialogBgImg') no-repeat center / cover;
        overflow-y: auto;
      }

      .van-dialog__confirm {
        margin: 0 40px 40px 40px;
      }

      .btn-confirm {
        width: 626px;
        margin: 0 auto;
        margin-top: 30px;
      }

      .dialog-radio-controler {
        margin: 20px auto;
      }
    }
  }
}

@keyframes btnScale {
  0% {
    transform: scale(0.85);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.85);
  }
}
@keyframes glareMove {
  0% {
    left: -20px;
    opacity: 0;
  }
  5% {
    opacity: 0.5;
  }
  45% {
    opacity: 0.5;
  }
  55% {
    left: 170px;
    opacity: 0;
  }
  100% {
    left: 170px;
    opacity: 0;
  }
}
@keyframes yanhuaBloom01 {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  25% {
    transform: scale(1);
    opacity: 0.8;
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes denglongMove {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 0.7;
  }
  40% {
    transform: perspective(500px) translate3d(90px, -120px, -500px);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes borderHighlight {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  30% {
    opacity: 1;
    left: 440px;
  }
  35% {
    opacity: 0;
    left: 440px;
  }
  100% {
    opacity: 0;
  }
}
</style>
