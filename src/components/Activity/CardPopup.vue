<template>
  <transition-group
    name="fade"
    tag="div"
  >
    <div
      class="card-popup-overlay"
      key="card-popup-overlay"
    ></div>
    <div
      class="card-popup-container flex justify-center items-center"
      :class="[toggle ? 'toggle-show' : 'toggle-hide', { 'award-show': awardCard }]"
      key="card-popup-container"
    >
      <div
        v-if="!awardCard"
        class="card-content-container"
      >
        <img
          :src="requireImg('activity/btn_guanbi.png')"
          class="close-popup"
          @click="handleClosePopup"
        />
        <img
          :src="requireImg('activity/decorations-002.png')"
          class="ticket-left"
        />
        <img
          :src="requireImg('activity/decorations-001.png')"
          class="ticket-right"
        />
        <div
          class="title-bg flex items-center justify-end"
          :class="{ 'title-bg-2': awardCard, 'title-bg-3': noCard }"
        >
          <img
            :src="requireImg('activity/decorations-003.png')"
            class="star-left"
          />
          <div
            v-if="!noCard"
            class="item-num flex justify-center items-center"
          >
            {{ titleNum }}
          </div>
          <img
            :src="requireImg('activity/decorations-003.png')"
            class="star-right"
          />
        </div>
        <div class="star-bg">
          <img :src="requireImg('activity/guang.png')" />
        </div>
        <div class="light-bg">
          <img :src="requireImg('activity/guang02.png')" />
        </div>
        <div
          class="card-content"
          :class="{
          'card-content-single-card': Object.values(cards as object).length === 1,
          'flex justify-center gap-[45px]': !awardCard,
          'card-award-content flex flex-col justify-end items-center gap-[42px]': awardCard || noCard,
          }"
        >
          <template v-if="noCard">
            <div class="cards">
              <img
                class="no-card"
                :src="requireImg('activity/xxcy-no-card.png')"
              />
            </div>
          </template>
          <template v-else-if="!awardCard">
            <div
              v-for="(value, key, index) in cards"
              :key="key"
              class="item-card"
              :class="{
                'single-card': Object.values(cards).length === 1
              }"
            >
              <img :src="requireImg(`activity/${cardTypeMap[key as unknown as cardType]}.png`)" />
              <div
                v-if="value && Object.values(cards).length > 1"
                class="red-dot"
                :data-count="value"
              ></div>
            </div>
          </template>
          <template v-else>
            <img
              class="compose-four-card"
              :src="requireImg('activity/gongxifacai2.png')"
            />
            <div class="award-text">奖励：{{ winning }} {{ coin_name }}币</div>
          </template>
        </div>
        <div
          class="bottom-cloud flex justify-center items-center text-[18px] text-[#461b02]"
          :class="{ 'bottom-cloud-2': !noCard }"
        ></div>
      </div>
      <div
        v-else
        class="card-award-content-container"
      >
        <img
          :src="requireImg('activity/btn_guanbi.png')"
          class="close-popup-2"
          @click="handleClosePopup"
        />
        <div class="title-compose-bg flex items-center justify-end">
          <div class="item-num flex justify-center items-center">
            {{ titleNum }}
          </div>
        </div>
        <div class="light-bg">
          <img :src="requireImg('activity/guang02.png')" />
        </div>
        <div class="caishen-award-bg">
          <div class="award-text-container flex justify-between items-center">
            <div>奖励</div>
            <div>
              <span>{{ winning }}</span>
              币
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { cardType } from '@/pages/Activity/tools'
import { requireImg } from '@/utils/tools'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const coin_name = sessionStorage.getItem('coin_name')
const router = useRouter()

interface Props {
  cards: {
    [key: number]: number
  }
  awardCard: boolean
  awardNum: number
  winning: string | number
  noCard: boolean
  // 动画切换
  toggle: boolean
}
const props = withDefaults(defineProps<Props>(), {
  cards: () => ({}),
  awardCard: false,
  awardNum: 0,
  winning: 0,
  noCard: false,
  toggle: false
})
const emit = defineEmits(['close-popup'])

const cardTypeMap = {
  0: '谢谢参与',
  1: 'gong',
  2: 'xi',
  3: 'fa',
  4: 'cai'
}

const titleNum = computed(() => {
  if (props.awardCard) return props.awardNum
  return Object.values(props.cards).reduce((sum, item) => sum + item, 0)
})

const handleClosePopup = () => {
  emit('close-popup')
}
</script>

<style lang="scss" scoped>
.card-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2000;
}
.card-popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2001;
  // transform: scale(0);
  &.toggle-show {
    // transform: scale(1);
    // transition: all 0.15s 0.1s ease-in;
    animation: popupScaleTo1 0.5s ease-in-out;
  }
  &.toggle-hide {
    // transform: scale(0);
    // transition: all 0.15s 0.1s ease-in;
    animation: popupScaleTo0 0.2s ease-in-out;
  }
  // &.award-show {
  //   animation: popupAwardScale 4.5s ease-in-out forwards;
  // }
}
.card-content-container {
  position: relative;
  width: 625px;
  height: 540px;

  .close-popup {
    position: absolute;
    right: 31px;
    top: -27px;
    width: 65px;
    height: 65px;
  }
  .ticket-left {
    position: absolute;
    left: -63px;
    top: 96px;
    width: 113px;
    height: 78px;
  }
  .ticket-right {
    position: absolute;
    right: -25px;
    top: 126px;
    width: 77px;
    height: 53px;
  }
  .title-bg {
    width: 372px;
    height: 44px;
    background: url('@/assets/images/activity/title-bg-01.png') no-repeat center / cover;
    background-size: 100% 100%;
    position: relative;
    margin: 47px auto 0 auto;
    &.title-bg-2 {
      width: 328px;
      background-image: url('@/assets/images/activity/title-bg-02.png');
      .item-num {
        width: 50px;
        margin-right: 48px;
      }
    }
    &.title-bg-3 {
      width: 317px;
      background-image: url('@/assets/images/activity/regret-title.png');
    }
    .item-num {
      width: 100px;
      height: auto;
      margin-top: -24px;
      margin-right: 82px;
      font-size: 82px;
      font-weight: bold;
      font-style: italic;
      background-image: linear-gradient(#ef8d3b, #f4b947);
      color: transparent;
      -webkit-background-clip: text;
    }
    .star-left {
      position: absolute;
      left: -57px;
      top: -15px;
      width: 38px;
      height: 38px;
    }
    .star-right {
      position: absolute;
      right: -43px;
      bottom: -24px;
      width: 24px;
      height: 24px;
    }
  }
  .star-bg,
  .light-bg {
    // width: 473px;
    // height: 425px;
    width: 520px;
    height: 467px;
    position: absolute;
    top: 77px;
    margin-left: 67px;
    animation: starFlicker 1s ease-in-out infinite;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .light-bg {
    animation: bgLightRotate 4.3s linear infinite;
    top: 50px;
    opacity: 0.3;
  }
  .card-content {
    width: 100%;
    height: 180px;
    position: absolute;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    &.card-content-single-card {
      height: 270px;
    }
    &.card-award-content {
      width: 476px;
      height: 300px;
      top: 97px;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
      .no-card {
        width: 382px;
        height: 273px;
        margin-top: 54px;
      }
      .compose-four-card {
        width: 100%;
        height: 163px;
      }
      .award-text {
        font-size: 30px;
        font-weight: bold;
        background-image: linear-gradient(#fefbf4, #f8d9a8);
        color: transparent;
        -webkit-background-clip: text;
      }
    }
    .item-card {
      position: relative;
      width: 120px;
      height: 172px;
      &.single-card {
        width: 190px;
        height: 270px;
      }
      .red-dot {
        position: absolute;
        right: -10px;
        top: -10px;
        width: 48px;
        height: 48px;
        padding: 2px;
        color: #fff;
        border-radius: 50%;
        background-image: linear-gradient(0deg, #f0a564 27%, #fbe8bc 100%);
        box-shadow: 0px 1px 2px 0px rgba(138, 41, 35, 0.7);
        &::after {
          content: attr(data-count);
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-image: linear-gradient(#dd4e53, #dd4e53);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 29px;
          color: #f7d6c2;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .bottom-cloud {
    width: 300px;
    height: 121px;
    background: url('@/assets/images/activity/yun.png') no-repeat center / cover;
    background-size: 100% 100%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    &-2 {
      bottom: -70px;
    }
    .xxcy-box {
      position: absolute;
      left: 45px;
      bottom: 50px;
      width: 233px;
      height: 167px;
    }
  }
}

.card-award-content-container {
  position: relative;
  width: 10rem;
  height: 882px;
  .close-popup-2 {
    position: absolute;
    right: 65px;
    top: -65px;
    width: 65px;
    height: 65px;
  }
  .title-compose-bg {
    width: 328px;
    height: 44px;
    background: url('@/assets/images/activity/title-bg-02.png') no-repeat center / cover;
    background-size: 100% 100%;
    position: relative;
    margin: /* 47px auto */ 0 auto;
    .item-num {
      width: 54px;
      height: auto;
      margin-top: -24px;
      margin-right: 48px;
      font-size: 82px;
      font-weight: bold;
      font-style: italic;
      background-image: linear-gradient(#ef8d3b, #f4b947);
      color: transparent;
      -webkit-background-clip: text;
    }
  }
  .light-bg {
    width: 10rem;
    height: 882px;
    position: absolute;
    // top: 77px;
    // margin-left: 67px;
    animation: bgLightRotate 4.3s linear infinite;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .caishen-award-bg {
    width: 735px;
    height: 731px;
    background: url('@/assets/images/activity/gongxifacai3.png') no-repeat center / cover;
    background-size: 100% 100%;
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    .award-text-container {
      width: 340px;
      height: 68px;
      padding: 0 60px;
      position: absolute;
      bottom: 14px;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
      font-size: 36px;
      font-weight: bold;
      color: #fcf16c;
      text-shadow: 0px 3px 2px rgba(35, 8, 16, 0.68);
    }
  }
}

@keyframes starFlicker {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes bgLightRotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes popupScaleTo1 {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
@keyframes popupScaleTo0 {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
}
@keyframes popupAwardScale {
  0% {
    transform: scale(0);
  }
  30% {
    transform: scale(1);
  }
  80% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
