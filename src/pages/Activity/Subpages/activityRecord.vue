<template>
  <nav-bar
    class="nav-bar"
    title="活动记录"
    mode="cardActivity"
  />
  <div class="activityRecord">
    <div class="Record_top clearfix">
      <p class="left">
        上周奖励:
        <span>{{ lastweek_award }}</span>
        币
      </p>
      <p class="right">
        本周奖励:
        <span>{{ thisweek_award }}</span>
        币
      </p>
    </div>
    <div class="Record_tab clearfix activity_container">
      <van-tabs
        @change="tabChange"
        v-model:active="active"
      >
        <van-tab
          v-for="item in tabList"
          :title="item.title"
          :name="item.code"
          :key="item.title"
        >
          <template #title>
            <van-dropdown-menu
              v-if="item.title == '翻卡机会记录'"
              class="absolute left-[-130px]"
            >
              <van-dropdown-item
                @change="changeMenu"
                v-model="value1"
                :options="option1"
              />
            </van-dropdown-menu>
            {{ item.title }}
          </template>
          <div class="Record-container">
            <div
              class="title flex_z_between"
              v-if="active == '翻卡记录'"
            >
              <div class="text-left w-[20%]">抽中的卡</div>
              <div class="text-center w-[20%]">次数</div>
              <div class="text-right w-[39%]">抽奖时间</div>
            </div>
            <div
              class="title flex_z_between"
              v-else-if="active == '翻卡机会记录'"
            >
              <div class="text-left w-[24%]">获取方式</div>
              <div class="text-center w-[20%]">变化类型</div>
              <div class="text-center">次数</div>
              <div class="text-right w-[39%]">时间</div>
            </div>
            <div
              class="title flex_z_between"
              v-else-if="active == '奖励记录'"
            >
              <div class="text-left w-[20%]">奖励类型</div>
              <div class="text-center w-[20%]">奖励金额</div>
              <div class="text-right w-[39%]">奖励时间</div>
            </div>
            <van-pull-refresh
              v-model="refreshing"
              @refresh="onRefresh"
            >
              <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="getGameresult"
                v-if="dataList.length"
              >
                <div
                  class="list flex_z_between"
                  v-for="item in dataList"
                  :key="item.title"
                >
                  <div class="text-left w-[24%]">
                    <van-image
                      v-if="active == '翻卡记录' && item.turn_results != '6'"
                      class="AR_listImg left"
                      :src="requireImg('activity/' + cardPic(item.turn_results) + '.png')"
                    />
                    <span v-else-if="active == '翻卡记录' && item.turn_results == '6'">
                      谢谢参与
                    </span>
                    <span v-else>{{ item.turn_results_name }}</span>
                  </div>
                  <div
                    class="text-center w-[20%]"
                    :class="
                      active == '翻卡记录' && item.turn_results != '6' ? 'leading-[63px]' : ''
                    "
                  >
                    <span v-if="active == '翻卡记录'">{{ item.num }}</span>
                    <span v-else-if="active == '奖励记录'">{{ item.results_cash }}</span>
                    <span v-else>{{ item.trade_type == 1 ? '增加' : '减少' }}</span>
                  </div>
                  <div
                    class="text-center"
                    :class="item.trade_type == 2 ? 'text-[#eb1a53]' : ' '"
                    v-if="active == '翻卡机会记录'"
                  >
                    {{ item.trade_type == 2 ? '-' + item.num : item.num }}
                  </div>
                  <div
                    class="text-right w-[40%] text-[26px]"
                    :class="
                      active == '翻卡记录' && item.turn_results != '6' ? 'leading-[63px]' : ''
                    "
                  >
                    {{ item.createtime }}
                  </div>
                </div>
              </van-list>
              <div
                class="no-data flex flex-col items-center"
                v-else
              >
                <img
                  class="w-[55%] mb-[30px] mt-[100px]"
                  :src="noData"
                />
                <div class="text-no-data text-[#c1c2c5]">暂无活动记录</div>
              </div>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { gameresult } from '@/apis/taskActivity'
import { requireImg } from '@/utils/tools'
import noData from '@/assets/images/common/activity_empty.png'
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useAppBar } from '@/components/AppBar/useAppBar'
useAppBar({ mode: 'dark' })
const thisweek_award = ref(0)
const lastweek_award = ref(0)
const active = ref('翻卡记录')
const tabList = [
  { title: '翻卡机会记录', code: '翻卡机会记录' },
  { title: '翻卡记录', code: '翻卡记录' },
  { title: '奖励记录', code: '奖励记录' }
]
const value1 = ref(1)
const option1 = ref([
  { text: '本周', value: 1 },
  { text: '上周', value: -1 }
])
const dataList = ref<any>([])
const parm = ref({
  week: value1.value,
  page: 1,
  type: 1
})
const getGameresult = () => {
  if (refreshing.value) {
    parm.value.page = 1
    dataList.value = []
    // console.log('加载', refreshing.value, list.value.length)
    refreshing.value = false
  }
  gameresult(parm.value).then(data => {
    let count = (data as any).count
    if (!!!count && count !== 0) return showToast('数据异常!!')
    if (data.code || data.errmsg) return console.log('数据异常')
    if (!count) {
      loading.value = false
      finished.value = true
      return
    }
    // dataList.value = data.data
    dataList.value.push(...data.data)
    loading.value = false
    parm.value.page++
    if (dataList.value.length >= count) {
      finished.value = true
    }
    thisweek_award.value = data.thisweek_award
    lastweek_award.value = data.lastweek_award
  })
}

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
  getGameresult()
}
onRefresh()

const tabChange = (code: string) => {
  // console.log('code', code)
  if (code == '翻卡记录') {
    // dataList.value = sendList.value
    parm.value.type = 1
  } else if (code == '奖励记录') {
    // dataList.value = sendList.value
    parm.value.type = 2
  } else {
    parm.value.type = 3
    // dataList.value = receiveList.value
  }
  refreshing.value = true
  loading.value = true
  onRefresh()
}

const changeMenu = (e: number) => {
  // console.log('e', e)
  parm.value.week = e
  refreshing.value = true
  loading.value = true
  onRefresh()
}

const getNum_type = (type: number) => {
  // console.log('card', card)
  let num_type = ''
  switch (type) {
    case 1:
      num_type = '参与活动派发'
      break
    case 2:
      num_type = '参与活动扣除'
      break
    case 3:
      num_type = '收到赠送'
      break
    case 4:
      num_type = '赠送支出'
      break
    case 5:
      num_type = '操作增加'
      break
    case 6:
      num_type = '操作扣除'
      break
    case 7:
      num_type = '交换增加'
      break
    case 8:
      num_type = '交换减少'
      break
    case 9:
      num_type = '赠送返点'
      break
    case 10:
      num_type = '买币任务'
      break
    case 11:
      num_type = '卖币任务'
      break
    case 12:
      num_type = '积分轮盘派发'
      break
    default:
      num_type = ''
      break
  }
  return num_type
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
    case 5:
      pic = 'gongxifacai'
      break
    case 6:
      pic = 'xxcy'
      break
    case 7:
      pic = 'btn_phb02'
      break
    case 0:
      pic = ''
      break
    default:
      pic = ''
      break
  }
  return pic
}
onMounted(() => {})
</script>

<style lang="scss" scoped>
.activityRecord {
  font-size: 30px;
  height: 100%;
  .Record_top {
    padding: 20px;
    padding-bottom: 50px;
    background: var(--app-spring-festival-activity-theme);
    p {
      font-size: 31px;
      font-weight: normal;
      font-stretch: normal;
      color: #711f13;
      padding: 10px 0;
      span {
        font-size: 33rpx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0rpx;
        color: #f6e364;
      }
    }
  }
  :deep(.van-tabs) {
    .van-tabs__nav {
      padding-left: 150px;
    }
    .van-tabs__wrap {
      height: 80px;
    }
    .van-tabs__content {
      margin-top: 0;
    }
    .van-dropdown-menu__title {
      font-weight: normal;
    }
    #van-tabs-1-2 {
    }
  }
  .Record_tab {
    width: 100%;
    padding: 0 20px;
    top: -14px;
    :deep(.van-dropdown-menu) {
      width: 100px;
      height: 44px;
      border-radius: 3px;
      border: solid 1px rgba(80, 82, 85, 0.8);
      float: left;
      .van-dropdown-menu__bar {
        background-color: rgba(0, 0, 0, 0);
        height: 44px;
        .van-dropdown-menu__title {
          font-size: 24px;
          margin-left: -20px;
          &::after {
            right: -2px;
          }
        }
      }
      .van-dropdown-item--down {
        width: 750px;
        margin: 0 auto;
      }
    }
  }
  .Record-container {
    height: calc(100vh - 298px);
    padding-bottom: 80px;
    .title {
      padding: 20px 0;
      border-bottom: 1px #ccc solid;
      width: 100%;
      font-size: 28px;
    }
    .list {
      font-size: 28px;
      padding: 15px 0;
      width: 100%;
      border-bottom: 1px #ccc solid;
      .AR_listImg {
        width1: 44px;
        height: 63px;
        img {
          width: auto;
        }
      }
    }
  }
}
</style>
