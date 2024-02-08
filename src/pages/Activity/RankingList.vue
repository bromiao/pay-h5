<script setup lang="ts">
import { gameInfoDataApi, gameRankApi } from '@/apis/taskActivity'
import { useAuthStore } from '@/store/modules/auth'
import { useEntryStore } from '@/store/modules/entry'
import { IGameRankData } from '@/store/types/taskActivity'
import { getRandomNumber } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const EntryStore = useEntryStore()
const { config } = storeToRefs(EntryStore)

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

const week = ref(1)
const weekOption = ref([
  { text: '本周', value: 1 },
  { text: '上周', value: -1 }
])
const ranks = ref<IGameRankData[]>([] as IGameRankData[])
const showMax = ref(true)
const prizePoolMoney = ref('0')

const appUserInfo = JSON.parse(localStorage.getItem('app_user_info') ?? '{}')

const handleToggle = () => {
  showMax.value = !showMax.value
}

const hasMore = computed(() => ranks.value.length > 10)
const visibleRanks = computed(() => ranks.value.slice(0, showMax.value ? 10 : ranks.value.length))
// 图片资源域名
const imgserver_url = computed(() => {
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v || ''
})
const userNickName = computed(() => userInfo.value?.nickname || '')

const onWeekChange = (week: number) => {
  getRankData()
}

const filterNickName = (nickname: string) => {
  if (!nickname) return ''
  if (nickname.length === 1) return nickname + '**'
  if (nickname.length > 1 && nickname.length < 4)
    return nickname.slice(0, 1) + '**' + nickname.slice(1)
  return nickname.slice(0, 1) + '**' + nickname.slice(-2)
}

const getRankData = async () => {
  try {
    const res = await gameRankApi({ week: week.value })
    window.log('排行榜', res, userInfo.value?.nickname, userNickName.value)

    ranks.value = res
  } catch (err) {
    console.error(err)
  }
}

const getGameInfoData = async () => {
  try {
    const res = await gameInfoDataApi({})
    window.log('个人游戏信息', res)
    if (res.pools && Math.floor(res.pools) !== Math.floor(+prizePoolMoney.value)) {
      prizePoolMoney.value = Math.floor(res.pools).toString().replace(/\d/g, '0')
      setTimeout(() => {
        prizePoolMoney.value = Math.floor(res.pools).toString()
      }, 20)
    }
  } catch (err) {
    console.error(err)
  }
}
getGameInfoData().then(() => {
  poolIncrease()
})

let poolIncreaseTimer: NodeJS.Timeout | null
// 3至5秒内随机增加奖池金额
const poolIncrease = () => {
  const randomSec = getRandomNumber(3000, 5000)

  poolIncreaseTimer && clearTimeout(poolIncreaseTimer)
  poolIncreaseTimer = setTimeout(() => {
    getGameInfoData()
    poolIncrease()
  }, randomSec)
}

onMounted(() => {
  getRankData()
})
onUnmounted(() => {
  poolIncreaseTimer && clearTimeout(poolIncreaseTimer)
  poolIncreaseTimer = null
})
</script>

<template>
  <div class="ranking-list-container">
    <div class="prize-pool-bg">
      <div class="prize-pool-money">
        <CountTo
          v-show="prizePoolMoney.length > 1"
          :count="prizePoolMoney"
        />
      </div>
    </div>
    <!-- 排行榜内容 -->
    <div class="ranking-content">
      <van-dropdown-menu :overlay="false">
        <van-dropdown-item
          v-model="week"
          :options="weekOption"
          @change="onWeekChange"
        />
      </van-dropdown-menu>

      <div class="title-bg flex flex-col justify-center items-center text-[#f1d188]">
        <div class="text-[34px] font-bold">{{ week === 1 ? '本周' : '上周' }}合成数量排行榜</div>
        <div class="sub-title text-[21px] text-[#fb967f] whitespace-nowrap">
          排行榜豪礼每周一派奖，最高可得
          <span class="text-[#f1d188]">1888</span>
          大奖
        </div>
      </div>

      <div class="podium-bg">
        <template v-if="ranks.length">
          <div class="rank-2nd flex flex-col justify-between items-center">
            <div class="flex justify-between items-center text-[21px] text-[#f3aaae]">
              <!-- <span>{{ ranks[1].nickname.slice(0, 2) }}**{{ ranks[1].nickname.slice(-2) }}</span> -->
              <span class="nickname truncate">{{ filterNickName(ranks[1].nickname) }}</span>
              <span>
                <span class="text-[21px] text-[#fee902]">{{ ranks[1].daily_num }}</span>
                张
              </span>
            </div>
            <img :src="imgserver_url + ranks[1].headimg" />
          </div>
          <div class="rank-1st flex flex-col justify-between items-center">
            <div class="flex justify-between items-center text-[21px] text-[#f3aaae]">
              <!-- <span>{{ ranks[0].nickname.slice(0, 2) }}**{{ ranks[0].nickname.slice(-2) }}</span> -->
              <span class="nickname truncate">{{ filterNickName(ranks[0].nickname) }}</span>
              <span>
                <span class="text-[21px] text-[#fee902]">
                  {{ ranks[0].daily_num }}
                </span>
                张
              </span>
            </div>
            <img :src="imgserver_url + ranks[0].headimg" />
          </div>
          <div class="rank-3rd flex flex-col justify-between items-center">
            <div class="flex justify-between items-center text-[21px] text-[#f3aaae]">
              <!-- <span>{{ ranks[2].nickname.slice(0, 2) }}**{{ ranks[2].nickname.slice(-2) }}</span> -->
              <span class="nickname truncate">{{ filterNickName(ranks[2].nickname) }}</span>
              <span>
                <span class="text-[21px] text-[#fee902]">{{ ranks[2].daily_num }}</span>
                张
              </span>
            </div>
            <img :src="imgserver_url + ranks[2].headimg" />
          </div>
        </template>
      </div>

      <div class="list-bg-top">
        <div class="list-th flex justify-between items-end">
          <div>会员信息</div>
          <div>排名</div>
          <div>合成卡数</div>
        </div>
      </div>
      <div class="list-bg-middle">
        <div
          v-for="(item, index) in visibleRanks.slice(3)"
          :key="item.nickname"
          class="item-row"
          :class="{ 'item-row-self': item.nickname === (userNickName || appUserInfo.nickname) }"
        >
          <div class="item-content flex justify-between items-center">
            <div class="user-info flex items-center">
              <img :src="imgserver_url + item.headimg" />
              <div class="ml-[15px] line-clamp-2">
                <!-- {{ item.nickname.slice(0, 2) }}***{{ item.nickname.slice(-2) }} -->
                {{ filterNickName(item.nickname) }}
              </div>
            </div>
            <div class="rank-num flex justify-center">
              {{ item.rank_num > 99 ? '99+' : item.rank_num }}
            </div>
            <div class="card-num flex justify-center">{{ item.daily_num }}</div>
          </div>
        </div>
      </div>
      <div class="list-bg-bottom flex justify-center items-center">
        <div
          v-if="hasMore"
          class="text-[25px] text-[#eb8f6f]"
          @click="handleToggle"
        >
          {{ showMax ? '展示更多' : '收起' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ranking-list-container {
  width: 100%;
  position: absolute;
  top: 446px;
  .prize-pool-bg {
    position: relative;
    width: 100%;
    height: 203px;
    background: url('@/assets/images/activity/jiangchi.png') no-repeat center / cover;
    background-size: 100% 100%;
    .prize-pool-money {
      position: absolute;
      top: 40px;
      left: 298px;
      width: 238px;
      height: 83px;
      overflow: hidden;
      :deep(.content) {
        width: 238px;
        height: 83px;
        justify-content: flex-start;
        .digital_wrap {
          width: auto;
        }
        .digital {
          background-image: linear-gradient(#fdf4a7, #fdd73e);
          background-image: -webkit-linear-gradient(#fdf4a7, #fdd73e);
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
        }
        .icon {
          height: auto;
          background-image: linear-gradient(#fdf4a7, #fdd73e);
          background-image: -webkit-linear-gradient(#fdf4a7, #fdd73e);
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          display: inline-block;
        }
      }
    }
  }
  .ranking-content {
    position: relative;
    width: 100%;
    height: auto;
    padding: 8px 13px 0 13px;
    background: url('@/assets/images/activity/jiangchi_bg.png') center / cover;
    background-size: 100% 100%;

    :deep(.van-dropdown-menu) {
      position: relative;
      width: 130px;
      height: 44px;
      border: 1px solid rgba(241, 209, 136, 0.8);
      border-radius: 6px;
      .van-dropdown-menu__bar {
        width: 130px;
        height: 44px;
        background-color: transparent;
        .van-dropdown-menu__item {
          // justify-content: flex-start;
        }
        .van-dropdown-menu__title {
          height: 44px;
          line-height: 44px;
          padding: 0 15px 0 5px;
          font-size: 22px;
          color: #f1d188;
          letter-spacing: 5px;
          &::after {
            border-color: transparent transparent #f1d188 #f1d188;
          }
        }
      }
      .van-dropdown-item {
        width: 130px;
        height: 90px;
        position: absolute;
        left: -1px;
        top: 39px !important;
        border: 1px solid rgba(241, 209, 136, 0.8);
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        .van-popup {
          background-color: transparent;
          max-height: unset;
        }
        .van-cell {
          height: 44px;
          padding: 0;
          background-color: transparent;
          font-size: 22px;
          color: #f1d188;
          letter-spacing: 5px;
          text-align: center;
          &::after {
            display: none;
          }
        }
        .van-dropdown-item__option--active {
          background-color: #b21731;
          color: #f1d188;
        }
        .van-cell__value {
          display: none;
        }
      }
    }

    .title-bg {
      position: relative;
      width: 400px;
      height: 90px;
      padding: 16px 0 11px 0;
      background: url('@/assets/images/activity/ranking-title-bg.png') no-repeat center / cover;
      background-size: 100% 100%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
      .sub-title {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
      }
    }

    .podium-bg {
      position: relative;
      width: 652px;
      height: 104px;
      margin: 235px auto 28px auto;
      background: url('@/assets/images/activity/podium.png') no-repeat center / cover;
      background-size: 100% 100%;
      img {
        width: 83px;
        height: 83px;
        box-shadow: 0px 5px 5px 0px rgba(89, 9, 4, 0.98);
        border-radius: 14px;
        border: solid 1px rgba(241, 209, 136, 0.8);
      }
      .rank-2nd {
        width: 200px;
        height: 120px;
        position: absolute;
        left: 20px;
        bottom: 75px;
      }
      .rank-1st {
        width: 200px;
        height: 120px;
        position: absolute;
        left: 50%;
        bottom: 103px;
        transform: translate3d(-50%, 0, 0);
      }
      .rank-3rd {
        width: 200px;
        height: 120px;
        position: absolute;
        right: 20px;
        bottom: 50px;
      }
      .nickname {
        max-width: 100px;
        margin-right: 10px;
      }
    }
    .list-bg-top {
      width: 722px;
      height: 60px;
      background: url('@/assets/images/activity/bg_phb1.png') no-repeat center / cover;
      background-size: 100% 100%;
      .list-th {
        padding: 28px 100px 4px 100px;
        font-size: 25px;
        font-weight: bold;
        color: #b0170d;
      }
    }
    .list-bg-middle {
      width: 722px;
      height: auto;
      margin-top: -2px;
      padding: 20px 6px 0 6px;
      background: url('@/assets/images/activity/bg_phb2.png') no-repeat center / cover;
      background-size: 100% 100%;
      .item-row {
        padding: 0 23px 0 38px;
        &-self {
          background-color: #f8e4cb;
          border-radius: 14px;
        }
      }
      .item-content {
        position: relative;
        padding: 25px 96px 25px 10px;
        font-size: 25px;
        color: #995b3d;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 3px;
          background: url('@/assets/images/activity/border-bg.png') no-repeat center / cover;
          background-size: 100% 100%;
        }
      }
      .user-info {
        width: 200px;
        img {
          width: 76px;
          height: 76px;
          border-radius: 14px;
        }
      }
      .rank-num {
        width: 44px;
        margin: 0 auto 0 85px;
      }
      .card-num {
        width: 48px;
      }
    }
    .list-bg-bottom {
      width: 722px;
      height: 80px;
      margin-top: -2px;
      background: url('@/assets/images/activity/bg_phb3.png') no-repeat center / cover;
      background-size: 100% 100%;
    }
  }
}
</style>
