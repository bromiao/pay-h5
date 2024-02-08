<script setup lang="ts">
import { useTaskActivityStore } from '@/store/modules/taskActivity'
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { showToast, showSuccessToast } from 'vant'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/modules/auth'
import { userDoTaskApi } from '@/apis/taskActivity'
import { ISignInData, ISignInRecord } from '@/store/types/taskActivity'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import info from '@/assets/images/common/info.png'
import error from '@/assets/images/common/error.png'
import success from '@/assets/images/common/success.png'
import mitt from '@/utils/mitt'
import { InWEB } from '@/utils/tools'
import router from '@/router'

const taskActivityStore = useTaskActivityStore()
const point = ref(0)
const { signInData } = storeToRefs(taskActivityStore)
const authStore = useAuthStore()
const { token } = storeToRefs(authStore)
const { verified_status } = authStore.userInfo ?? {}
const cardList = ref<ISignInRecord[]>([])
const btnCheckInName = ref(signInData.value.todayisok ? '今日已签到' : '点击签到')

const onCheckIn = async () => {
  if (signInData.value.todayisok) {
    return showToast({
      message: '今日已签到',
      icon: info,
      iconSize: '48px',
      teleport: '.check-in-container'
    })
  }
  const isLogin = computed(() => !!token.value)

  if (InWEB()) {
    if (!isLogin.value) {
      return router.push('/auth/login')
    }
  }
  if (!verified_status) {
    return showToast({
      message: '用户还未实名认证',
      icon: error,
      teleport: '.check-in-container'
    })
  }

  try {
    const res = await userDoTaskApi({
      idd: signInData.value.task_idd
    })

    window.log('签到状态', res)

    // 签到成功后更新状态
    if (res.money) {
      // 更新顶部积分数值
      mitt.emit('updateCoins', true)
      mitt.emit('updateTodayActivity', true)

      getSignInData(true)

      showToast({
        message: `签到成功，+${res.money}积分`,
        icon: success,
        teleport: '.check-in-container'
      })
      btnCheckInName.value = '今日已签到'
    }
  } catch (error) {
    console.error(error)
  }
}

const getSignInData = async (isReq: boolean = false) => {
  window.log('每日签到积分列表', signInData.value)

  // 签到缓存数据是否异常，若异常则需重新请求接口数据
  const listError = signInData.value.list?.[3]?.date !== dayjs().format('YYYY-MM-DD')
  if (signInData.value.list && !listError && !isReq) return

  await taskActivityStore.getSignInListApi()

  window.log('每日签到积分列表2', signInData.value)
}

const cardClassName = (item: ISignInRecord) => {
  let className
  const isSame = dayjs().isSame(dayjs(item.date), 'day')
  const isAfter = dayjs().isAfter(dayjs(item.date), 'day')

  if (isSame) {
    className = item.hisokflag ? 'item-checked-in' : 'item-today'
  } else if (isAfter) {
    className = item.hisokflag ? 'item-checked-in' : 'item-expires'
  } else {
    className = 'item-point'
  }
  return className
}

watchEffect(() => {
  const list = signInData.value.list
  cardList.value = list
})

onMounted(() => {
  getSignInData()
})
</script>

<template>
  <div class="check-in-container flex flex-col items-start justify-start">
    <div class="tips">
      已连续签到
      <span class="consequent-days">{{ signInData.out_num?.day }}</span>
      天，明天签到
      <span class="tomorrow-get-point">+{{ signInData.out_num?.money }}</span>
      积分
    </div>
    <div class="card-container flex items-center justify-start">
      <div
        v-for="item in cardList"
        :key="item.date"
        class="flex flex-col items-center justify-start"
      >
        <div
          class="item-card"
          :class="cardClassName(item)"
        >
          <i
            v-if="cardClassName(item) === 'item-checked-in'"
            class="checked-in"
          ></i>
          <i
            v-else-if="cardClassName(item) === 'item-expires'"
            class="point-expires"
          ></i>
          <div v-else>+{{ item.money }}</div>
        </div>
        <div class="item-date">{{ item.datetxt }}</div>
      </div>
    </div>
    <van-button
      type="primary"
      :class="`btn-check-in${signInData.todayisok ? ' checked' : ''}`"
      @click="onCheckIn"
    >
      {{ btnCheckInName }}
    </van-button>
  </div>
</template>

<style lang="scss" score>
@import '@/assets/styles/sprite-home.scss';

.check-in-container {
  width: 708px;
  margin-top: 8px;
  padding: 16px 22px 17px 22px;
  background-color: #fff;
  border-radius: 14px;
  .tips {
    font-size: 19px;
    color: #13161b;
  }
  .consequent-days,
  .tomorrow-get-point {
    color: #ff6d7f;
    margin: 0 5px;
  }
  .card-container {
    gap: 30px;
    margin: 15px 0 18px 0;
  }
  .item-card {
    width: 69px;
    height: 83px;
    line-height: 83px;
    font-size: 25px;
    color: #e4a41f;
    border-radius: 7px;
    text-align: center;
  }
  .item-checked-in {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #aefe8b;
    & + .item-date {
      color: #787f8c;
    }
    img {
      width: 30px;
      height: 20px;
    }
  }
  .item-today {
    background-color: #fcf3b2;
    border: solid 3px #e9a415;
    & + .item-date {
      color: #787f8c;
    }
  }
  .item-point {
    background-color: #fdf2db;
    & + .item-date {
      color: #abb1bb;
    }
  }
  .item-expires {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #c5c5c5;
    & + .item-date {
      color: #787f8c;
    }
    img {
      width: 22px;
      height: 21px;
    }
  }
  .item-date {
    margin-top: 4px;
    font-size: 19px;
  }
  .btn-check-in {
    width: 222px;
    height: 56px;
    font-size: 25px;
    background-color: #ff4565;
    border-radius: 7px;
    align-self: center;
    border: 0;
    &.checked {
      background-color: #828282;
    }
  }

  .van-toast {
    width: 270px;
    height: 270px;
    padding: 40px;
    font-size: 33px;
    .van-toast__icon {
      font-size: 110px;
    }
    .van-toast__text {
      margin-top: 15px;
      line-height: 1.5;
    }
  }
}
</style>
