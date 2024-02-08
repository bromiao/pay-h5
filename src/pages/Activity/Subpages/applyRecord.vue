<template>
  <nav-bar
    class="nav-bar"
    title="申请记录"
    mode="cardActivity"
  />
  <div class="activityRecord">
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
            <van-dropdown-menu class="absolute left-[-130px] top-[20px]">
              <van-dropdown-item
                @change="changeMenu"
                v-model="value1"
                :options="option1"
              />
            </van-dropdown-menu>
          </template>
          <div class="Record-container">
            <div class="title flex_z_between">
              <div class="text-left w-[20%]">申请次数</div>
              <div class="text-center w-[20%]">商户/状态</div>
              <div class="text-right w-[39%]">申请时间</div>
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
              >
                <div
                  class="list flex_z_between"
                  v-for="item in dataList"
                  :key="item.codes"
                >
                  <div class="text-left w-[24%] leading-[73px]">
                    <span>{{ parseInt(item.daily_num) }}</span>
                  </div>
                  <div class="text-center w-[36%]">
                    <p class="w-[100%] van-ellipsis">{{ item.mname }}</p>
                    <p
                      :class="
                        item.status == 0
                          ? 'text-[#e39127]'
                          : item.status == 1
                          ? 'text-[#07a11d]'
                          : 'text-[#d81607]'
                      "
                    >
                      {{ item.status == 0 ? '审核中' : item.status == 1 ? '通过' : '拒绝' }}
                    </p>
                  </div>
                  <div class="text-right w-[40%] text-[26px] leading-[73px]">
                    {{ item.add_time }}
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { gamemerapplist } from '@/apis/taskActivity'
import { requireImg } from '@/utils/tools'
import { onMounted, ref } from 'vue'
import { useAppBar } from '@/components/AppBar/useAppBar'
useAppBar({ mode: 'dark' })
// const thisweek_award = ref(0)
// const lastweek_award = ref(0)
const active = ref('申请记录')
const tabList = [{ title: '', code: '申请记录' }]
const value1 = ref(1)
const option1 = ref([
  { text: '本周', value: 1 },
  { text: '上周', value: -1 }
])
const dataList = ref<any>([])
const parm = ref({
  week: value1.value
})
const getGameresult = () => {
  if (refreshing.value) {
    refreshing.value = false
  }
  gamemerapplist(parm.value).then(data => {
    if (data.code || data.errmsg) return console.log('数据异常')
    dataList.value = data
    // dataList.value = [{}]

    loading.value = false
    finished.value = true
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
  console.log('code', code)
  if (code == '翻卡记录') {
    // dataList.value = sendList.value
    // parm.value.type = 1
  } else if (code == '奖励记录') {
    // dataList.value = sendList.value
    // parm.value.type = 2
  } else {
    // parm.value.type = 3
    // dataList.value = receiveList.value
  }
  onRefresh()
}

const changeMenu = (e: number) => {
  // console.log('e', e)
  parm.value.week = e
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
    height: 200px;
    padding: 20px;
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
    .van-tabs__line {
      display: none;
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
    height: calc(100vh - 368px);
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
