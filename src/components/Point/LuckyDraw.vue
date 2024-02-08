<script setup lang="ts">
import noData from '@/assets/images/common/noData-gold.png'
import iconWarning from '@/assets/images/common/warning.png'
import { useAuthStore } from '@/store'
import { useCommonStore } from '@/store/modules/common'
import { useEntryStore } from '@/store/modules/entry'
import { useTaskActivityStore } from '@/store/modules/taskActivity'
import { INormal } from '@/store/types/entry'
import {
  IAwardData,
  IGameRecord,
  IGameRecordData,
  IPlayTurntableData,
  ITurntableAward,
  ITurntableOption
} from '@/store/types/taskActivity'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Vue3SeamlessScroll as SeamlessScroll } from 'vue3-seamless-scroll'

const coin_name = sessionStorage.getItem('coin_name')
const emit = defineEmits(['update-coins'])

type TTurntableAward = Partial<ITurntableAward>

// 抽奖记录
const winRecordList = ref<IGameRecord[]>([])
// 抽奖轮盘奖项列表
const awardLoopList = ref<TTurntableAward[]>([
  {
    class: 'RMB-4'
  },
  {
    class: 'point-1'
  },
  {
    class: 'RMB-gold-box'
  },
  {
    class: 'lucky-star'
  },
  {
    class: 'point-5'
  },
  {
    class: 'point-8'
  },
  {
    class: 'RMB-1'
  },
  {
    class: 'RMB-silver-box'
  },
  {
    class: 'point-3'
  },
  {
    class: 'RMB-3'
  }
])
interface IAwardState {
  currentIndex: number // 当前位置
  isRunning: boolean // 是否正在抽奖
  speed: number // 抽奖转动速度
  runTurnTableTimer: NodeJS.Timeout | null // 抽奖轮盘计时器
  turnTableLimitTimer: NodeJS.Timeout | null // 抽奖频率计时器
  currentRunCount: number // 已跑次数
  totalRunCount: number // 总共跑动次数 10的倍数
  prizeId: number // 中奖id
  continue: number // 是否可以继续抽奖
}
// 抽奖相关数据状态
const awardState = reactive<IAwardState>({
  currentIndex: -1, // 当前位置
  isRunning: false, // 是否正在抽奖
  speed: 10, // 抽奖转动速度
  runTurnTableTimer: null, // 抽奖轮盘计时器
  turnTableLimitTimer: null, // 抽奖频率计时器
  currentRunCount: 0, // 已跑次数
  totalRunCount: 40, // 总共跑动次数 10的倍数
  prizeId: 0, // 中奖id
  continue: 1 // 是否可以继续抽奖
})
const awardResult = reactive<IPlayTurntableData>({
  awards: [],
  mtype: {
    '0': 0,
    '1': 0,
    '20': 0
  }
})
// 奖品高亮顺序
const prizeSort = [0, 1, 2, 3, 4, 9, 8, 7, 6, 5, 0]
// 抽奖按钮
const btnList = ref<ITurntableOption[]>([])

const entryStore = useEntryStore()
const { config } = storeToRefs(entryStore)

const appDomain = computed(() => {
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as INormal).v || ''
})

const taskActivityStore = useTaskActivityStore()
const { getTurntableAwardsApi, getGameRecordApi, getPlayTurntableApi } = taskActivityStore
const { turntableAwards, awardRecord } = storeToRefs(taskActivityStore)

const handleTurnTableAwardsData = (data: IAwardData) => {
  awardLoopList.value = data.awards
  btnList.value = data.options
}
// 获取轮盘奖项列表
const getTurntableAwards = async () => {
  try {
    let res: IAwardData = turntableAwards.value

    if (!res.awards?.length) {
      res = await getTurntableAwardsApi()
    }

    handleTurnTableAwardsData(res)

    window.log('轮盘奖项列表', res)
  } catch (error) {
    console.error(error)
  }
}
// 获取抽奖记录
const getGameRecord = async (isReq: boolean = false) => {
  try {
    let res: IGameRecordData

    if (awardRecord.value.count && !isReq) {
      res = awardRecord.value
    } else {
      res = await getGameRecordApi()
    }

    if (res.list?.length) {
      winRecordList.value = res.list
    }

    window.log('抽奖记录', res)
  } catch (error) {
    console.error(error)
  }
}

// 要执行总步数
const totalRunStep = computed(() => {
  return awardState.totalRunCount + prizeSort.indexOf(awardState.prizeId)
})

// 获取随机数
const getRandomNum = () => {
  // 这里一次必然可以取到 时间为1次
  return prizeSort[Math.floor(Math.random() * prizeSort.length)]
}

const authStore = useAuthStore()
const { getUserMoneyByMType } = storeToRefs(authStore)
// 点击抽奖
const runTurntable = (item: ITurntableOption) => {
  const point = +(getUserMoneyByMType.value(20)?.coincash ?? 0)
  if (point < +item.consume) {
    showToast({
      message: '积分不足',
      icon: iconWarning
    })

    return
  }
  if (!awardState.continue) {
    showToast({
      message: '10秒内只能操作一次',
      icon: iconWarning
    })

    return
  }

  if (!awardState.isRunning) {
    // 重置数据
    awardState.currentRunCount = 0
    awardState.speed = 30
    awardState.isRunning = true

    // 如果接口突然报错如何处理？直接调用stopRun()方法停止转动
    getTurnTableData(item.id)
  }
}

const startRun = () => {
  stopRun()
  // window.log('--currentRunCount-totalRunStep--', awardState.currentRunCount, totalRunStep.value)
  // 要执行总步数
  // 已走步数超过
  if (awardState.currentRunCount > totalRunStep.value) {
    awardState.isRunning = false
    showDialog.value = true
    awardState.currentIndex = -1
    emit('update-coins', true)
    getGameRecord(true)
    return
  }
  awardState.currentIndex = prizeSort[awardState.currentRunCount % 10]
  // 如果当前步数超过了2/3则速度慢下来
  if (awardState.currentRunCount > Math.floor((awardState.totalRunCount * 2) / 3)) {
    awardState.speed = awardState.speed + Math.floor(awardState.currentRunCount / 3)
    // console.log('速度>>>>', awardState.speed)
  }
  awardState.runTurnTableTimer = setTimeout(() => {
    awardState.currentRunCount++
    startRun()
  }, awardState.speed)
}

const stopRun = () => {
  awardState.runTurnTableTimer && clearTimeout(awardState.runTurnTableTimer)
}

const commonStore = useCommonStore()
// 轮盘抽奖
const getTurnTableData = async (id: number) => {
  try {
    commonStore.setShowLoading(true)
    awardState.continue = 0

    const params = {
      config_id: id
    }

    const res = await getPlayTurntableApi(params)

    if (res.awards?.length) {
      awardResult.awards = res.awards
      awardResult.mtype = res.mtype

      const prizeId = awardLoopList.value.findIndex(
        item => item.turntable_idd === res.awards[0].turntable_idd
      )

      if (~prizeId) {
        awardState.prizeId = prizeId
        startRun()
      }
    }

    window.log('抽奖', res)
  } catch (error) {
    console.error(error)
  } finally {
    commonStore.setShowLoading(false)

    awardState.turnTableLimitTimer && clearTimeout(awardState.turnTableLimitTimer)
    awardState.turnTableLimitTimer = setTimeout(() => {
      awardState.isRunning = false
      awardState.continue = 1
    }, 10 * 1000)
  }
}

const showDialog = ref(false)

const closeDialog = () => {
  showDialog.value = false
}

onMounted(() => {
  getTurntableAwards()
  getGameRecord()
})
onBeforeUnmount(() => {
  awardState.runTurnTableTimer && clearTimeout(awardState.runTurnTableTimer)
  awardState.runTurnTableTimer = null
  awardState.turnTableLimitTimer && clearTimeout(awardState.turnTableLimitTimer)
  awardState.turnTableLimitTimer = null
})
</script>

<template>
  <div class="lucky-draw-container">
    <div class="draw-middle-container flex items-center">
      <div class="award-loop-container flex items-center flex-wrap">
        <div
          v-for="(item, index) in awardLoopList"
          :key="item.id"
          class="item-award flex flex-col items-center justify-between"
          :class="{ active: awardState.currentIndex === index }"
        >
          <div class="icon-container flex items-center justify-center">
            <img
              v-if="item.activity_img"
              :src="appDomain + item.activity_img"
            />
            <i
              v-else
              :class="item.class"
            ></i>
          </div>
          <div
            class="award-name"
            :class="{ 'final-award-name': item.turntable_name && item.turntable_name.length > 5 }"
          >
            {{ item.turntable_name }}
          </div>
        </div>
      </div>
      <div class="right-scroll-container">
        <div class="title">中奖记录</div>
        <div
          class="winning-record"
          :class="!winRecordList.length ? 'flex items-center justify-center' : ''"
        >
          <SeamlessScroll
            v-if="winRecordList.length"
            :list="winRecordList"
            :limitScrollNum="7"
            :step="0.3"
            class="seamless-scroll"
          >
            <div
              v-for="(item, index) in winRecordList"
              :key="index"
              class="item-award-history ellipsis"
            >
              {{ dayjs(item.addtime).format('HH:mm') }}中奖{{ item.record_desc }}
            </div>
          </SeamlessScroll>

          <div
            v-else
            class="no-data flex flex-col items-center justify-center text-center"
          >
            <img :src="noData" />
            <div class="text-no-data">暂无数据</div>
          </div>
        </div>
      </div>
    </div>
    <div class="lottery-container flex items-center justify-between">
      <div
        v-for="item in btnList"
        :key="item.id"
        class="award-btn"
        @click="runTurntable(item)"
      >
        <div className="item-name">{{ item.title }}</div>
        <div className="item-required-point">({{ item.consume }}积分)</div>
        <div
          v-if="item.discount"
          class="discount"
        >
          <div className="discount-num">{{ item.discount }}</div>
        </div>
      </div>
    </div>

    <van-dialog
      v-model:show="showDialog"
      theme="round-button"
      confirmButtonText="确定"
      class="point-dialog award-result-dialog"
    >
      <i
        class="close-white block icon-pos"
        @click="closeDialog"
      ></i>
      <div class="title">抽奖结果</div>
      <div class="content">
        <div class="result-summary">
          <div
            v-if="!awardResult.mtype['1'] && !awardResult.mtype['20']"
            class="item-result-title lucky-king"
          >
            {{ awardResult.awards[0]?.turntable_name }}
          </div>
          <template v-else>
            <div
              v-if="awardResult.mtype['20']"
              class="item-result-title"
            >
              <span>获得积分：</span>
              <span class="result-value">+{{ awardResult.mtype['20'] }}</span>
            </div>
            <div
              v-if="awardResult.mtype['1']"
              class="item-result-title"
            >
              <span>获得{{ coin_name }}：</span>
              <span class="result-value">+{{ awardResult.mtype['1'].toTruncFixed(2) }}</span>
            </div>
          </template>
        </div>
        <div class="award-list-container flex flex-wrap justify-between">
          <div
            v-for="(item, index) in awardResult.awards"
            :key="index"
            class="item-award flex flex-col justify-center items-center"
          >
            <div class="award-icon"><img :src="appDomain + item.activity_img" /></div>
            <div class="award-name">{{ item.turntable_name }}</div>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<style lang="scss" score>
@import '@/assets/styles/sprite-point.scss';

.lucky-draw-container {
  position: relative;
  width: 100%;
  height: 460px;
  margin: 30px 0;
  background: url('@/assets/images/common/lucky-draw.png') center / cover no-repeat;
  .draw-middle-container {
    position: absolute;
    top: 97px;
    left: 15px;
    width: 680px;
    height: 258px;
    padding: 15px 22px;
    overflow: auto;
    .award-loop-container {
      width: 472px;
      min-width: 472px;
      gap: 13px;
      .item-award {
        width: 84px;
        height: 105px;
        justify-content: space-between;
        padding-bottom: 9px;
        background-color: #fff;
        border-radius: 7px;
        &.active {
          border: 6px solid #57fb07;
        }
        .icon-container {
          height: calc(100% - 28px);
          transform: scale(0.85);
          .RMB-gold-box,
          .RMB-silver-box,
          .lucky-star,
          .point-8 {
            margin-top: 5px;
          }
          img {
            width: 100%;
          }
        }
        .award-name {
          font-size: 17px;
          color: #cf0224;
        }
        .final-award-name {
          font-size: 16px;
        }
      }
    }
    .right-scroll-container {
      align-self: flex-start;
      margin-left: 10px;
      color: #fff;
      .title {
        margin-bottom: 10px;
        font-size: 24px;
        color: #ffdae0;
        text-align: left;
      }
      .winning-record {
        // display: block;
        width: 146px;
        height: 180px;
        gap: 20px;
        font-size: 18px;
        color: #fabe73;
        overflow: auto;
        .seamless-scroll {
          height: 180px;
          overflow: hidden;
        }
        .item-award-history {
          width: 100%;
          flex: 0 0 26px;
        }
        .no-data {
          img {
            width: 140px;
            // height: 110px;
          }
          .text-no-data {
            width: 100%;
            margin-bottom: 22px;
            font-size: 12px;
          }
        }
      }
    }
  }
  .lottery-container {
    position: absolute;
    left: 15px;
    bottom: 15px;
    width: calc(100% - 30px);
    height: 80px;
    .award-btn {
      position: relative;
      text-align: center;
      .discount {
        position: absolute;
        top: -18px;
        right: -14px;
        .discount-num {
          position: absolute;
          top: 26px;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          font-size: 17px;
          color: #fff;
          white-space: nowrap;
        }
      }
    }
    .item-name {
      font-size: 25px;
      color: #cf0224;
      font-weight: bold;
    }
    .item-required-point {
      font-size: 17px;
      color: #bb7100;
    }
  }

  .award-result-dialog {
    .content {
      padding-top: 17px !important;
      padding-bottom: 17px !important;
      .result-summary {
        padding-bottom: 17px;
        font-size: 25px;
        color: #787f8c;
        border-bottom: 1px solid #d9dde8;
      }
      .result-value {
        margin-left: 16px;
        color: #13161b;
      }
      .award-list-container {
        width: 100%;
        height: 270px;
        padding: 18px 10px 0 10px;
        gap: 15px 0;
        overflow-y: auto;
        .item-award {
          width: 105px;
          height: 105px;
          padding: 5px 0;
          color: #8e8f90;
          background-color: #fff;
          border-radius: 7px;
          .award-icon {
            width: 60%;
            img {
              margin-top: 0;
            }
          }
          .award-name {
            font-size: 22px;
          }
        }
      }
    }
  }
}
</style>
