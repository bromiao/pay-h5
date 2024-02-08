<template>
  <nav-bar
    class="nav-bar z-[1001]"
    title="接收福卡"
    mode="cardActivity"
    right-text="记录"
  >
    <template #right>
      <van-icon
        name="notes-o"
        size="26"
        @click="$router.push('/cardRecord?tabStatus=2')"
      />
    </template>
  </nav-bar>
  <div class="heng"></div>
  <div class="cardReceive-container">
    <p
      class="title"
      v-if="cardList.length"
    >
      你有收到好友
      <span class="red_f">{{ cardList.length }}</span>
      张赠送卡
      <span class="right">
        倒计时:
        <span class="red_f">
          <van-count-down
            :time="countdownTime"
            :format="countdownTime >= 24 * 60 * 60 * 1000 ? 'DD天HH时' : 'HH时mm分ss秒'"
          />
        </span>
      </span>
    </p>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text=""
        @load="getCardList"
      >
        <div
          v-if="cardList.length"
          class="card_content"
        >
          <div
            class="CR_item clearfix mb-[15px]"
            v-for="item in cardList"
            :key="item.id"
          >
            <p class="clearfix leading-[76px]">
              赠送卡类型
              <van-image
                class="cR_listImg"
                lazy-load
                :src="requireImg('activity/' + cardPic(item.num_type) + '.png')"
              />
            </p>
            <p>
              赠送卡状态：
              <span class="right">待接收</span>
            </p>
            <p>
              赠送人昵称：
              <span class="right">{{ item.nickname }}</span>
            </p>
            <p>
              赠送时间：
              <span class="right">{{ item.add_time }}</span>
            </p>
            <van-button
              type="primary"
              @click="goGiveawayresave(item.id)"
            >
              接收
            </van-button>
          </div>
        </div>
        <div
          class="no-data flex flex-col items-center"
          v-else
        >
          <img
            class="w-[55%] mb-[30px] mt-[100px]"
            :src="noData"
          />
          <div class="text-no-data text-[#c1c2c5]">暂无可接收卡</div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script setup lang="ts">
import success from '@/assets/images/common/success.png'
import noData from '@/assets/images/common/activity_empty.png'
import { onMounted, ref } from 'vue'
import { requireImg } from '@/utils/tools'
import { gameInfoDataApi, giveawayresave } from '@/apis/taskActivity'
import dayjs from 'dayjs'
import { showToast } from 'vant'
import { useAppBar } from '@/components/AppBar/useAppBar'
useAppBar({ mode: 'dark' })
const cardList = ref<any>([])
const countdownTime = ref(18 * 60 * 60 * 1000) // 距离本周周日倒计时

onMounted(() => {})

const currentDay = dayjs().day()
const daysUntilSunday = 7 - currentDay
const millisecondsUntilSunday = daysUntilSunday * 24 * 60 * 60 * 1000

countdownTime.value = millisecondsUntilSunday
const getCardList = async () => {
  if (refreshing.value) {
    // parm.value.page = 1
    // console.log('加载', refreshing.value, list.value.length)
    refreshing.value = false
  }
  const res = await gameInfoDataApi({})
  if (!!!res.friends) return console.log('数据异常')
  cardList.value = res.friends
  // cardList.value = [{}]
  loading.value = false
  finished.value = true
}
// getCardList()

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const onRefresh = () => {
  // 清空列表数据
  finished.value = false
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  // showToast('刷新成功')
  getCardList()
}
onRefresh()

const goGiveawayresave = async (id: string) => {
  const res = await giveawayresave({ id })
  console.log('res', res)
  // if ((res as any).code) return console.log('数据异常')
  if ((res as any).code || (res as any).errmsg) return console.log('数据异常')
  onRefresh()
  showToast({ message: '成功！', icon: success })
}

const cardPic = (card: number) => {
  // console.log('card', card)
  let pic = ''
  switch (card) {
    case 1:
      pic = 'gong'
      break
    case 2:
      pic = 'xi'
      break
    case 3:
      pic = 'fa'
      break
    case 4:
      pic = 'cai'
      break
    case 0:
      pic = 'xxcy'
      break
    default:
      pic = ''
      break
  }
  return pic
}
</script>

<style lang="scss" scoped>
.cardReceive-container {
  position: relative;
  z-index: 10;
  height: calc(100vh - 100px);
  padding: 10px 20px;
  padding-bottom: 100px;
  font-size: 28px;
  background-color: #ebf1f6;
  border-radius: 14px 14px 0 0;
  border: solid 1px rgba(241, 209, 136, 0.8);
  .title {
    border-bottom: #d6dce8 1px solid;
    padding: 15px 0;
    color: #494b4f;
    margin-bottom: 20px;
    .right {
      :deep(.van-count-down) {
        display: inline-block;
      }
    }
  }
  .card_content {
  }
  .CR_item {
    color: #787f8c;
    background-color: #ffffff;
    border-radius: 14px;
    padding: 20px;
    p {
      padding: 8px 0;
      display: block;
      .cR_listImg {
        display: block;
        float: right;
        width: 53px;
        height: 76px;
      }
    }
    .van-button {
      float: right;
      color: #f9db95;
      display: block;
      width: 218px;
      height: 69px;
      background: url('../../../assets/images/activity/btn-task-2.png');
      background-size: cover;
      border: unset;
    }
  }
}
</style>
