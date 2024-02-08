<template>
  <nav-bar
    class="nav-bar"
    title="记录"
    mode="cardActivity"
  />
  <div class="heng"></div>
  <div class="activity_cardRecord activity_container">
    <van-tabs
      @change="tabChange"
      v-model:active="active"
      shrink
    >
      <van-tab
        v-for="item in tabList"
        :title="item.title"
        :name="item.code"
        :key="item.title"
      >
        <van-pull-refresh
          v-model="refreshing"
          @refresh="onRefresh"
        >
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getSendrecive_history"
          >
            <div
              class="dataList"
              v-for="item in dataList"
              :key="item.title"
            >
              <p class="clearfix leading-[76px]">
                赠送卡
                <van-image
                  class="cR_listImg"
                  lazy-load
                  :src="requireImg('activity/' + cardPic(item.num_type) + '.png')"
                />
              </p>
              <p>
                状态
                <span
                  class="right"
                  :class="item.status != 1 ? 'red_f' : ''"
                >
                  {{ item.status == 1 ? '已接收' : '待接收' }}
                </span>
              </p>
              <p>
                {{ active == 'send' ? '接收人' : '赠送人' }}昵称
                <span class="right">{{ item.nickname }}</span>
              </p>
              <p>
                {{ active == 'send' ? '接收人' : '赠送人' }}地址
                <span class="right">{{ item.uuid }}</span>
              </p>
              <p>
                赠送时间
                <span class="right">{{ item.add_time }}</span>
              </p>
              <p>
                接收时间
                <span class="right">{{ item.status == 1 ? item.update_time : '-' }}</span>
              </p>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script setup lang="ts">
import { sendrecive_history } from '@/apis/taskActivity'
import { requireImg } from '@/utils/tools'
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppBar } from '@/components/AppBar/useAppBar'
useAppBar({ mode: 'dark' })
const route = useRoute()
const { query } = route
const { tabStatus } = query

const active = ref((tabStatus as string) || 'send')

const tabList = [
  { title: '赠送记录', code: 'send' },
  { title: '接收记录', code: 'receive' }
]
// const sendList = ref([{}])
// const receiveList = ref([{}])
const dataList = ref<any>([])
const parm = ref({
  page: 1,
  type: 1
})
const getSendrecive_history = () => {
  if (refreshing.value) {
    parm.value.page = 1
    dataList.value = []
    // console.log('加载', refreshing.value, list.value.length)
    refreshing.value = false
  }
  sendrecive_history(parm.value).then((data: any) => {
    let count = (data as any).count
    if (!!!count && count !== 0) return showToast('数据异常!!')
    if (data.code || data.errmsg) return console.log('数据异常')
    if (!count) {
      loading.value = false
      finished.value = true
      return
    }
    // dataList.value = data.data
    dataList.value.push(...data.list)
    loading.value = false
    parm.value.page++
    if (dataList.value.length >= count) {
      finished.value = true
    }
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
  getSendrecive_history()
}
onRefresh()

const tabChange = (code: string) => {
  console.log('code', code)
  if (code == 'send') {
    parm.value.type = 1
    // dataList.value = sendList.value
  } else {
    parm.value.type = 2
    // dataList.value = receiveList.value
  }
  refreshing.value = true
  loading.value = true
  onRefresh()
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
.activity_cardRecord {
  padding: 20px;
  font-size: 28px;
  height: calc(100vh - 100px);
  :deep(.van-tabs__content) {
    .van-tab__panel {
      height: calc(100vh - 190px);
      padding-bottom: 60px;
    }
  }
  .dataList {
    margin-bottom: 10px;
    color: #787f8c;
    background-color: #ffffff;
    border-radius: 14px;
    padding: 0 20px;
    p {
      border-bottom: 1px #787f8c42 solid;
      padding: 17px 0;
      display: block;
      .cR_listImg {
        display: block;
        float: right;
        width: 53px;
        height: 76px;
      }
    }
    p:nth-last-child(1) {
      border: none;
    }
  }
}
</style>
