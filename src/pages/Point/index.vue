<script setup lang="ts">
import { useAppBar } from '@/components/AppBar/useAppBar'
import CheckIn from '@/components/Point/CheckIn.vue'
import LuckyDraw from '@/components/Point/LuckyDraw.vue'
import TodayActivity from '@/components/Point/TodayActivity.vue'
import TotalTask from '@/components/Point/TotalTask.vue'
import { useAuthStore, useEntryStore } from '@/store'
import { useTaskActivityStore } from '@/store/modules/taskActivity'
import { INormal } from '@/store/types/entry'
import mitt from '@/utils/mitt'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const pay_name = sessionStorage.getItem('pay_name')

useAppBar({ mode: 'dark' })
const authStore = useAuthStore()
const router = useRouter()
const point = ref(0)
const showDialog = ref(false)

const openDialog = () => {
  showDialog.value = true
}
const closeDialog = () => {
  showDialog.value = false
}
const goPointDetails = () => {
  router.push(authStore.isLogin ? '/details/coin-details/point' : '/auth/login')
}

const taskActivityStore = useTaskActivityStore()
const { getRewardRecordListApi, getUserActionListApi } = taskActivityStore

const getRewardRecordList = async () => {
  try {
    const res = await getRewardRecordListApi({})

    if (res) {
      window.log('已完成任务列表', res)
    }
  } catch (error) {
    console.error(error)
  }
}

const { getUserCoin } = authStore
const { coins, getUserMoneyByMType } = storeToRefs(authStore)

const entryStore = useEntryStore()
const { config } = storeToRefs(entryStore)

// 积分清零时间
const pointClearTime = computed(
  () =>
    (config.value?.Web_Set_JFpoint?.Points_Cleared_Times as INormal)?.v ??
    `${dayjs().year()}-12-30 00:00:10`
)

const getUserCoinData = async (isReq: boolean = false) => {
  try {
    window.log('用户积分信息', coins.value, isReq)

    if (coins.value.length && !isReq) {
      return
    }

    const res = await getUserCoin({})
    window.log('用户积分信息2', res)
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getUserCoinData()
  mitt.on('updateCoins', getUserCoinData)

  // getRewardRecordList()
})
onUnmounted(() => {
  mitt.off('updateCoins', getUserCoinData)
})
</script>

<template>
  <div class="point-container flex flex-col justify-between">
    <nav-bar
      mode="transparent"
      hide-left
      class="point-nav-bar"
    >
      <template #title>
        <div class="nav-bar-title">
          <div>会员积分</div>
          <i
            class="help"
            @click="openDialog"
          ></i>
        </div>
      </template>
    </nav-bar>

    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 overflow-x-hidden overflow-y-auto">
        <div class="point-info-container flex items-center justify-between">
          <div class="flex flex-col">
            <div class="point-show flex items-center">
              <div>积分</div>
              <div class="point-value">
                {{ authStore.isLogin ? getUserMoneyByMType(20)?.coincash : '未登录' }}
              </div>
            </div>
            <div class="point-clear-deadline">积分清零时间：{{ pointClearTime }}</div>
          </div>
          <div
            class="flex items-center"
            @click="goPointDetails"
          >
            <div class="text-point-details">积分明细</div>
            <i class="arrow-right"></i>
          </div>
        </div>
        <CheckIn />
        <AdBanner />
        <LuckyDraw @update-coins="getUserCoinData" />
        <TodayActivity @update-coins="getUserCoinData" />
        <TotalTask />
      </div>
    </div>

    <van-dialog
      v-model:show="showDialog"
      theme="round-button"
      class="point-dialog"
    >
      <i
        class="close-white block icon-pos"
        @click="closeDialog"
      ></i>
      <div class="title">提示</div>
      <div class="content">
        <p class="text-bold">消耗积分进行抽奖，有机会赢取大奖！</p>
        <p>以下途径可以获得积分：</p>
        <p class="get-point-way">1. 每日签到可获得积分，连续多日签到将获得更多积分；</p>
        <p class="get-point-way">2. 完成每日任务获得每日活跃度，活跃度足够时可领取积分；</p>
        <p class="get-point-way">3. 完成累计任务，可直接获得积分；</p>
        <p class="get-point-way">
          4. 在游戏平台使用{{ pay_name }}上分/下分，将按金额比例获得积分。
        </p>
        <p class="text-bold notice-tips">
          注意：积分将定期清零，请留意本页面上方的“积分清零时间”。
        </p>
      </div>
    </van-dialog>
  </div>
</template>

<style lang="scss" score>
@import '@/assets/styles/sprite-home.scss';

.point-container {
  width: 100%;
  height: 100%;
  padding: 0 21px;
  background: url('@/assets/images/common/bg.webp') center / cover no-repeat;
  overflow: auto;
  .point-nav-bar {
    height: unset;
    flex: 0 0 100px;
  }
  .nav-bar-title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    .help {
      margin-left: 10px;
      transform: scale(0.9);
    }
  }
  .point-title-container {
    width: 100%;
    height: 90px;
    color: #fff;
    font-size: 32px;
    margin-bottom: 20px;
    .help {
      margin-left: 10px;
      transform: scale(0.9);
    }
  }
  .point-info-container {
    width: 100%;
    height: 65px;
    color: #fff;
    .point-show {
      width: 100%;
      font-size: 28px;
      .point-value {
        margin-left: 13px;
        font-size: 38px;
      }
    }
    .point-clear-deadline {
      font-size: 17px;
    }
    .text-point-details {
      margin-right: 16px;
      font-size: 28px;
    }
  }
  .point-modal {
    .modal-container {
      background-color: #ffdbe3;
      padding-bottom: 35px;
      .close-btn-node {
        top: 28px;
      }
      .modal-content {
        align-items: center;
      }
      .btn-view {
        width: 313px;
        height: 80px;
        margin-top: 35px;
        .button {
          background-color: #ff4565;
          border-radius: 7px;
        }
      }
    }
  }

  .point-dialog {
    width: 100%;
    max-width: 686px;
    height: auto;
    padding: unset;
    background-color: #f5e8eb;
    .icon-pos {
      position: absolute;
      right: 40px;
      top: 32px;
    }
    .title {
      width: 100%;
      height: 83px;
      line-height: 83px;
      padding-left: 42px;
      font-size: 29px;
      color: #fff;
      background-color: #fb3a67;
      text-align: left;
    }
    .content {
      width: 100%;
      padding: 40px 32px 58px 32px;
      font-size: 26px;
      color: #13161b;
      text-align: justify;
      .text-bold {
        font-size: 28px;
        font-weight: bold;
      }
      .get-point-way {
        margin-top: 30px;
      }
      .notice-tips {
        margin-top: 50px;
      }
      img {
        width: 100%;
        margin-top: 20px;
      }
    }

    .van-dialog__footer {
      padding: 35px 0;
      justify-content: center;
      background-color: #ffdbe3;
    }
    .van-dialog__confirm {
      flex: 0 0 313px;
      height: 80px;
      background: #ff4565;
      font-size: 31px;
      border-radius: 7px;
    }
  }

  .app-ad-banner-container {
    margin-top: 30px;
    margin-bottom: 0;
    padding: 0;
  }
}
</style>
