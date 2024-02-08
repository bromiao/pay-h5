<template>
  <nav-bar
    class="nav-bar z-[1001]"
    title="赠送福卡"
    mode="cardActivity"
    right-text="记录"
    @click-right="$router.push('/cardRecord')"
  >
    <template #right>
      <van-icon
        name="notes-o"
        size="26"
        @click="$router.push('/cardRecord')"
      />
    </template>
  </nav-bar>

  <div class="heng"></div>
  <div class="giftCard-container activity_container">
    <div class="giftCard_wrap clearfix">
      <p class="title py-[10px]">选择赠送卡:</p>

      <div class="giftCard flex_sz">
        <div
          class="g_cardBox"
          :class="num_type == 1 ? 'active' : ''"
          @click="gongNum > 0 && (num_type = 1)"
        >
          <van-image
            :class="gongNum == 0 ? 'grayscale' : ''"
            class="cR_listImg"
            :src="requireImg('activity/gong.png')"
          />
          <p
            class="g_tips"
            :class="gongNum == 0 ? 'gray_f' : ''"
          >
            数量:
            {{ gongNum || 0 }}
          </p>
        </div>
        <div
          class="g_cardBox"
          @click="xiNum > 0 && (num_type = 2)"
          :class="num_type == 2 ? 'active' : ''"
        >
          <van-image
            :class="xiNum == 0 ? 'grayscale' : ''"
            class="cR_listImg"
            :src="requireImg('activity/xi.png')"
          />
          <p
            class="g_tips"
            :class="xiNum == 0 ? 'gray_f' : ''"
          >
            数量:
            {{ xiNum || 0 }}
          </p>
        </div>
        <div
          class="g_cardBox"
          @click="faNum > 0 && (num_type = 3)"
          :class="num_type == 3 ? 'active' : ''"
        >
          <van-image
            :class="faNum == 0 ? 'grayscale' : ''"
            class="cR_listImg"
            :src="requireImg('activity/fa.png')"
          />
          <p
            class="g_tips"
            :class="faNum == 0 ? 'gray_f' : ''"
          >
            数量:
            {{ faNum || 0 }}
          </p>
        </div>
        <div
          class="g_cardBox"
          @click="caiNum > 0 && (num_type = 4)"
          :class="num_type == 4 ? 'active' : ''"
        >
          <van-image
            :class="caiNum == 0 ? 'grayscale' : ''"
            class="cR_listImg"
            :src="requireImg('activity/cai.png')"
          />
          <p
            class="g_tips"
            :class="caiNum == 0 ? 'gray_f' : ''"
          >
            数量:
            {{ caiNum || 0 }}
          </p>
        </div>
      </div>

      <div class="re_address">
        <p class="re_text">
          <span>接收人钱包地址：</span>
          <span class="right text-[#a4a5a7]">同一个好友一周只能赠送{{ giftcardnum }}张卡</span>
        </p>
        <van-field
          v-model="value1"
          placeholder="请输入对方钱包地址"
        >
          <template #right-icon>
            <span @click="posttext">粘贴</span>
          </template>
        </van-field>
        <p class="re_text my-[20px]">
          <span class="left text-[#a4a5a7]">钱包地址示例：6debf55e3016abc</span>
        </p>
      </div>
    </div>
    <div
      class="button_gc"
      @click="goGiveawaysend"
    >
      <van-button type="primary"></van-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import success from '@/assets/images/common/success.png'
import { requireImg, secondsToYYDMS } from '@/utils/tools'
import { gameInfoDataApi, giveawaysend } from '@/apis/taskActivity'
import { onMounted, ref } from 'vue'
import { IGameInfoData, typeCarinfos } from '@/store/types/taskActivity'
import { showToast } from 'vant'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useAppBar } from '@/components/AppBar/useAppBar'
useAppBar({ mode: 'dark' })
const route = useRoute()
const { query } = route
const { toaddress, cfg_giveaway_giftcardnum } = query

const giftcardnum = ref((cfg_giveaway_giftcardnum as string) || 0)
const value1 = ref((toaddress as string) || '')
const onClickRight = () => {
  console.log('clickRight')
}
const posttext = () => {
  navigator.clipboard
    .readText()
    .then(clipboardContent => {
      console.log(clipboardContent)
      value1.value = clipboardContent
    })
    .catch(error => {
      showToast('读取剪贴板内容失败')
      console.log('读取剪贴板内容失败', error)
    })
}
const carinfos = ref<typeCarinfos>({})
const num_type = ref(0)
const gongNum = ref(0)
const xiNum = ref(0)
const faNum = ref(0)
const caiNum = ref(0)

onMounted(() => {})
const getCardList = async () => {
  const res: IGameInfoData = await gameInfoDataApi({})
  if (!!!res.carinfos) return console.log('数据异常')
  carinfos.value = res.carinfos
  num_type.value =
    Object.values(carinfos.value).filter((e: any, i, arr) => {
      return e.num > 0
    })[0].key || 0

  Object.values(carinfos.value).forEach((e: any, i, arr) => {
    if (e.name == '恭') gongNum.value = e.num
    if (e.name == '喜') xiNum.value = e.num
    if (e.name == '发') faNum.value = e.num
    if (e.name == '财') caiNum.value = e.num
  })
}
getCardList()
const goGiveawaysend = async () => {
  if (!num_type.value) {
    showToast({ message: '请选择卡片' })
  }
  let parm = {
    toaddress: value1.value,
    num_type: num_type.value,
    num: 1
  }
  giveawaysend(parm).then(res => {
    if (res.code || res.errmsg) return console.log('数据异常')
    getCardList()
    // showToast({ message: '成功！', icon: success })
    let data = {
      date: secondsToYYDMS(),
      ...parm
    }
    // console.log('data', secondsToYYDMS(), data)
    router.replace('/giftResult?data=' + JSON.stringify(data))
  })
}
</script>

<style lang="scss" scoped>
.giftCard-container {
  height: 100%;
  font-size: 30px;
  padding: 20px;
  .giftCard_wrap {
    margin-bottom: 20px;
    padding: 15px 20px 20px;
    background-color: #ffffff;
    border-radius: 14px;
    .title {
      font-size: 28px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 28px;
      letter-spacing: 0px;
      color: #494b4f;
      margin-bottom: 15px;
    }
    .giftCard {
      margin-bottom: 60px;
      .g_cardBox {
        width: 156px;
        height: 195px;
        font-size: 24px;
        background-color: #fdf8d2;
        border-radius: 14px;
        border: solid 2px #f7d6c2;
        cursor: pointer;
        .cR_listImg {
          width: 86px;
          height: 123px;
          margin: 15px auto;
          display: block;
        }
        .g_tips {
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 28px;
          letter-spacing: 0px;
          color: #c78054;
          text-align: center;
        }
        &.active {
          border: solid 2px #eb114f;
        }
      }
    }
  }
  .re_address {
    .re_text {
      font-size: 25px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 28px;
      letter-spacing: 0px;
      color: #494b4f;
      margin-bottom: 20px;
    }
    :deep(.van-cell) {
      height: 61px;
      border-radius: 7px;
      border: solid 1px #787f8c;
      padding: 0 15px;
      .van-field__body {
        height: 100%;
      }
    }
  }
  .button_gc {
    width: 100%;
    margin-top: 50px;
    .van-button {
      width: 407px;
      height: 69px;
      margin: 0 auto;
      display: block;
      background: url('../../../assets/images/activity/send.png');
      background-size: cover;
      border: unset;
    }
  }
}
</style>
