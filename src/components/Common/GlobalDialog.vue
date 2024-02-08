<template>
  <div class="global-dialog-container">
    <van-toast
      v-model:show="toast.show"
      className="toast-global-info order_toast"
    >
      <template #message>
        <div class="title">{{ toast.data.title }}</div>
        <div class="content">{{ toast.data.content }}</div>
      </template>
    </van-toast>

    <van-dialog
      v-model:show="dialog.show"
      theme="round-button"
      className="dialog-global-info"
      @confirm="onClose"
    >
      <i
        class="icon-close block close-dark"
        @click="onClose"
      ></i>
      <div>
        <div class="title">{{ dialog.data.title }}</div>
        <div class="content">{{ dialog.data.content }}</div>
      </div>

      <template #footer>
        <div
          class="btn-confirm flex items-center justify-center"
          @click="dialog.data.confirmAction"
        >
          {{ dialog.data.confirmButtonText }}
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth'
import { IGlobalNotification } from '@/store/types/global'
import mitt from '@/utils/mitt'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const { processnum, userInfo } = storeToRefs(authStore)
const toast = reactive({
  show: false,
  data: {
    title: '通知',
    content: '你的订单B169336014711189179已经放行'
  }
})
const dialog = reactive({
  show: false,
  data: {
    title: '订单编号B15134102',
    content: '买方发来了交易提醒，请尽快操作',
    confirmButtonText: '去处理',
    confirmAction: () => {}
  }
})

const onClose = () => {
  dialog.show = false
}

watch(
  () => router.currentRoute.value,
  route => {
    // 需弹窗提醒待处理订单的路由页面列表
    const processOrderDialogShowRoutes = ['SellCoin', 'Point', 'Mine']
    if (processOrderDialogShowRoutes.includes(route.name as string)) {
      // 未完成交易订单弹窗提醒
      if (processnum.value?.total) {
        setTimeout(() => {
          mitt.emit('global-notification', { type: 'ProcessOrder', value: processnum.value })
        })
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  mitt.on('push_coin_buy_order_status', async (data: any) => {
    console.log('推送买币订单状态 ', data)
    if (data.data.status && userInfo.value.uuid) {
      await authStore.getUserInfo()
    }
    // console.log(
    //   'userInfo.value.uuid != data.uuid',
    //   userInfo.value.uuid != data.send_uuid,
    //   userInfo.value.uuid,
    //   data.uuid
    // )
    if (userInfo.value.uuid != data.send_uuid) {
      toast.data.content = data.data.msg
      toast.show = true
    }

    // setTimeout(() => {
    //   const hash = window.location.hash
    //   if (
    //     !hash.includes('orderCreate') &&
    //     !hash.includes('orderList') &&
    //     ![1].includes(data.data.status)
    //   ) {
    //     dialog.data = {
    //       title: '订单编号' + data.data.order_id,
    //       content: '订单状态更新，请尽快操作',
    //       confirmButtonText: '去处理',
    //       confirmAction: () => {
    //         // console.log('confirm')
    //         router.push('/orderCreate?order_id=' + data.data.order_id)
    //         onClose()
    //       }
    //     }
    //     dialog.show = true
    //   }
    // }, 300)
    mitt.emit('update_buy_f', data)
  })

  mitt.on('push_coin_sell_order_status', async (data: any) => {
    console.log('推送卖币订单状态 ', data)
    if (data.data.status && userInfo.value.uuid) {
      await authStore.getUserInfo()
    }
    // console.log(
    //   'userInfo.value.uuid != data.uuid',
    //   userInfo.value.uuid != data.send_uuid,
    //   userInfo.value.uuid,
    //   data.uuid
    // )
    if (userInfo.value.uuid != data.send_uuid) {
      toast.data.content = data.data.msg
      toast.show = true
    }

    // const hash = window.location.hash
    // if (!hash.includes('orderCreate') && !hash.includes('orderList')) {
    //   dialog.data = {
    //     title: '订单编号' + data.data.order_id,
    //     content: '订单状态更新，请尽快操作',
    //     confirmButtonText: '去查看',
    //     confirmAction: () => {
    //       router.push('/orderCreate?order_id=' + data.data.order_id + '&sell=true')
    //       onClose()
    //     }
    //   }
    //   dialog.show = true
    // }
    mitt.emit('update_sell_f', data)
  })

  mitt.on('push_reminders_buy', (data: any) => {
    const hash = window.location.hash
    console.log('买方发送给卖方催单 data', data)
    dialog.data = {
      title: '订单编号' + data.data.order_id,
      content: '买方发送交易提醒，请尽快操作',
      confirmButtonText: '去处理',
      confirmAction: () => {
        !hash.includes('orderCreate') && router.push('/orderCreate?order_id=' + data.data.order_id)
        onClose()
      }
    }
    dialog.show = true
  })

  mitt.on('push_reminders_sell', (data: any) => {
    const hash = window.location.hash
    console.log('卖方发送给买方催单 data', data)

    dialog.data = {
      title: '订单编号' + data.data.order_id,
      content: '卖方发送交易提醒，请尽快操作',
      confirmButtonText: '去处理',
      confirmAction: () => {
        !hash.includes('orderCreate') && router.push('/orderCreate?order_id=' + data.data.order_id)
        onClose()
      }
    }
    dialog.show = true
  })

  mitt.on('push_message', (data: any) => {
    console.log('站内消息 data', data)

    dialog.data = {
      title: '',
      content: '站内消息更新了',
      confirmButtonText: '去查看',
      confirmAction: () => {
        router.push('/message')
        onClose()
      }
    }
    dialog.show = true
  })

  mitt.on('push_coinsellcomment', (data: any) => {
    console.log('交易申诉更新 data', data)
    mitt.emit('update_appeal_f', data)
    dialog.data = {
      title: '订单编号' + data.data.coin_buy_order_id,
      content: '交易申诉更新，请尽快操作',
      confirmButtonText: '去处理',
      confirmAction: () => {
        router.push('/orderCreate?order_id=' + data.data.coin_buy_order_id)
        onClose()
      }
    }
    dialog.show = true
  })

  // 交易中的订单提醒， 首页，积分，我的页面需弹窗提醒
  mitt.on('global-notification', (data: IGlobalNotification) => {
    if (data.type === 'ProcessOrder') {
      dialog.data = {
        title: '',
        content: '您有待处理的交易订单，请尽快处理',
        confirmButtonText: '去处理',
        confirmAction: () => {
          const orderId = data.value.buy
            ? data.value.buy_orders[0].order_id
            : data.value.sell_orders[0].order_id

          router.push(`/orderCreate?order_id=${orderId}${!data.value.buy ? '&sell=true' : ''}`)
          onClose()
        }
      }
      dialog.show = true
    }
  })

  // 弹窗提醒tips
  mitt.on('dialog-tips', data => {
    dialog.data = {
      ...data,
      confirmAction: () => {
        data.confirmAction()
        onClose()
      }
    }
    dialog.show = true
  })
})
onUnmounted(() => {
  //
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.global-dialog-container {
  :deep(.toast-global-info) {
    width: 85%;
    padding: 10px 18px 28px 18px;
    background-color: #eef3f7;
    color: #3c4246;
    border-radius: 14px;
    .title {
      margin-bottom: 10px;
      font-size: 29px;
      text-align: center;
    }
    .content {
      font-size: 25px;
    }
  }
  :deep(.dialog-global-info) {
    width: 708px;
    height: auto;
    padding: 40px;
    .van-dialog__header {
      padding: 0;
      font-size: 29px;
      color: #13161b;
    }
    .van-dialog__content {
      margin: 33px 0 35px 0;
      font-size: 25px;
      color: #787f8c;
      text-align: center;
    }
    .title {
      margin-bottom: 20px;
    }
    .content {
      color: #13161b;
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
    .icon-close {
      position: absolute;
      right: 40px;
      top: 24px;
    }
  }
}
</style>
