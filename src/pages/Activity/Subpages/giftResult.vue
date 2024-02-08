<template>
  <nav-bar
    class="nav-bar"
    mode="cardActivity"
    title="赠送结果"
    repath="/giftCard"
  />
  <div class="heng"></div>
  <div class="gitResult-container activity_container">
    <div class="send_px">
      <van-image
        class="image_g"
        lazy-load
        :src="requireImg('activity/' + cardPic(sendData.num_type) + '.png')"
      />
    </div>
    <div class="result-container-g">
      <div class="result_info clearfix leading-[75px]">
        <span class="left">赠送卡</span>
        <span class="right h-[75px]">
          <van-image
            class="image_c"
            lazy-load
            :src="requireImg('activity/' + cardPic(sendData.num_type) + '.png')"
          />
        </span>
      </div>
      <!-- <div class="result_info clearfix">
        <span class="left">接收人昵称</span>
        <span class="right">{{ sendData.name }}</span>
      </div> -->
      <div class="result_info clearfix">
        <span class="left">接收人地址</span>
        <span class="right">{{ sendData.toaddress }}</span>
      </div>
      <div class="result_info clearfix unborder">
        <span class="left">赠送时间</span>
        <span class="right">{{ sendData.date }}</span>
      </div>
    </div>
    <div class="button_gr mt-[65px] flex_z">
      <van-button
        @click="$router.push('/cardRecord?tabStatus=receive')"
        type="primary"
        class="bt_receive unborder"
      ></van-button>
      <van-button
        @click="$router.replace('/giftCard?toaddress=' + sendData.toaddress)"
        type="primary"
        class="bt_send unborder"
      ></van-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import router from '@/router'
import { requireImg } from '@/utils/tools'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAppBar } from '@/components/AppBar/useAppBar'
useAppBar({ mode: 'dark' })
const route = useRoute()
const { query } = route
const { data } = query
let queryData = (data as string) || '{}'
const sendData = ref({
  num_type: 0,
  toaddress: '',
  date: ''
})
try {
  queryData = JSON.parse(queryData)
  sendData.value = queryData as any
} catch {
  console.log('错误')
}

onMounted(() => {})

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
.gitResult-container {
  height: 100%;
  font-size: 30px;
  padding: 0 20px;
  .send_px {
    width: 225px;
    height: 245px;
    margin: 50px auto 0;
    background: url('../../../assets/images/activity/give.png');
    background-size: cover;
    padding-top: 31px;
    .image_g {
      width: 86px;
      height: 123px;
      display: block;
      margin: 0 auto;
      transform: translateX(-12px);
    }
  }
  .result_text_g {
    padding: 20px 0;
    color: aqua;
    text-align: center;
  }
  .result-container-g {
    background-color: #ffffff;
    border-radius: 14px;
    margin-top: 30px;
    padding: 0 20px;
    .result_info {
      display: block;
      width: 100%;
      padding: 22px 15px;
      border-bottom: 1px #e0e1e1 solid;
      font-size: 28px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #787f8c;
      .left {
      }
      .right {
        text-align: right;
        .image_c {
          width: 53px;
          height: 75px;
        }
      }
    }
  }
  .button_gr {
    .bt_receive {
      width: 273px;
      height: 69px;
      background: url('../../../assets/images/activity/chakanjieshoujilu.png');
      background-size: cover;
    }
    .bt_send {
      width: 272px;
      height: 69px;
      background: url('../../../assets/images/activity/zaicizengsong.png');
      background-size: cover;
    }
  }
  .unborder {
    border: none !important;
  }
}
</style>
