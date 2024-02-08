<template>
  <div class="verify w-100 bg-white flex flex-col justify-between">
    <nav-bar
      title="信誉评分"
      mode="white"
    />

    <div class="main-content-container">
      <div class="credit-content p-[22px] bg-[#ebf1f6] flex items-center flex-wrap justify-center">
        <div class="card mt-[30px] flex items-center justify-between relative">
          <img
            :src="credit_bg"
            alt=""
            class="w-full h-full"
          />
          <div class="flex absolute z-1 top-1 left-1">
            <div class="avatar relative overflow-hidden rounded-md bg-[#fff]">
              <div
                class="avatar1"
                v-if="!authStore?.userInfo?.headimg"
              ></div>
              <img
                v-else
                class="w-[110px] h-[110px] block"
                :src="imgServerUrl + authStore?.userInfo?.headimg"
                alt=""
              />
            </div>
            <div class="ml-[7.5px]">
              <div class="text-[42px] text-white">
                {{ userInfo?.nickname }}
              </div>
              <div class="text-[#fff] text-[28px]">ID: {{ authStore?.userInfo?.username }}</div>
            </div>
          </div>
          <div class="absolute left-1 bottom-[10px] flex items-center">
            <div class="text-white text-[32px] mr-1">当前用户星级:</div>
            <div
              class="star w-[30px] mr-[10px] flex items-center"
              v-for="(star, index) in stars"
              :key="index"
            >
              <img
                v-if="star"
                :src="star_active"
                alt=""
                class="w-full h-full"
              />
              <img
                v-else
                :src="star_blank"
                alt=""
                class="w-full h-full"
              />
            </div>
          </div>
          <div class="absolute z-1 right-[85px] top-[120px] text-center">
            <div class="text-[28px] text-[#096eff]">当前信誉评分</div>
            <div class="text-[60px] text-[#096eff] text-center">
              {{ userScore?.score }}
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div class="credit-desc bg-white rounded-[10px] mt-[-25px] w-full px-2 py-2">
        <div class="item mb-[20px]">
          <div class="title text-[32px] text-black font-bold flex items-center">
            <img
              class="mr-[12px] w-[8px]"
              :src="credit_label"
              alt=""
            />
            信誉评分作用
          </div>
          <div class="desc text-[24px] text-[#787f8c] pl-1 mt-[5px]">
            信誉评分越高，交易匹配速度越快
          </div>
        </div>
        <div class="item mb-[20px]">
          <div class="title text-[32px] text-black font-bold flex items-center">
            <img
              class="mr-[12px] w-[8px]"
              :src="credit_label"
              alt=""
            />
            信誉星级
          </div>
          <div class="desc text-[24px] text-[#787f8c] pl-1 mt-[5px]">
            信誉星级 ≤ 60
            <br />
            <div class="flex items-center">
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_blank"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_blank"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
            </div>
            <br />
            信誉星级 61-80
            <br />
            <div class="flex items-center">
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_blank"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
            </div>
            <br />
            信誉星级 81-100
            <br />
            <div class="flex items-center">
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
              <img
                :src="star_active"
                alt=""
                class="w-[30px] h-[30px] mr-[10px] mt-[10px]"
              />
            </div>
          </div>
        </div>
        <div class="item mb-[20px]">
          <div class="title text-[32px] text-black font-bold flex items-center">
            <img
              class="mr-[12px] w-[8px]"
              :src="credit_label"
              alt=""
            />
            如何提升信誉评分
          </div>
          <div class="desc text-[24px] text-[#787f8c] pl-1 mt-[5px]">
            完成实名认证，规定时间内完成交易，获得交易买/卖方好评
          </div>
        </div>
        <div class="item mb-[20px]">
          <div class="title text-[32px] text-black font-bold flex items-center">
            <img
              class="mr-[12px] w-[8px]"
              :src="credit_label"
              alt=""
            />
            信誉评分衰减条件
          </div>
          <div class="desc text-[24px] text-[#787f8c] pl-1 mt-[5px]">
            超时处理订单，频繁取消订单
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import credit_bg from '@/assets/images/credit/credit_bg.png'
import credit_label from '@/assets/images/credit/credit_label.png'
import star_active from '@/assets/images/credit/star.png'
import star_blank from '@/assets/images/credit/star_blank.png'
import { useAuthStore, useEntryStore } from '@/store'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const entryStore = useEntryStore()
const imgServerUrl = entryStore.imgServerUrl
const { userScore } = storeToRefs(userStore)
const { userInfo } = storeToRefs(authStore)

console.log(userScore.value, 'userScore')

// 信誉评分等级
const star_level = computed(() => userScore.value.scorelevel)
// star列表
const stars = ref<boolean[]>([])

// 更新星星填充数据
const gen_stars = () => {
  for (let i = 0; i < 5; i++) {
    if (i < star_level.value) {
      // 添加对应评分等级（填充）
      stars.value.push(true)
    } else {
      // 未达到对应评分等级时（不填充）
      stars.value.push(false)
    }
  }
}

onMounted(() => {
  // 先从缓存更新数据
  gen_stars()

  // 请求到最新数据后，再次更新
  userStore.getUserScore().then(() => {
    stars.value = []
    gen_stars()
  })
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-mine.scss';

.verify {
  position: relative;
  width: 100%;
  height: 100%;
  .main-content-container {
    flex: 1;
    overflow-y: auto;
  }
}

:deep(.van-field__label) {
  font-size: 28px;
  color: #13161b;
  margin-bottom: 13px;
}

:deep(.van-cell__value) {
  height: 79px;
  background: #ebf1f6;
  display: flex;
  align-items: center;
  padding: 0 17px;
  font-size: 25px;
  margin-bottom: 42px;
}

:deep(.van-cell:after) {
  display: none;
}

:deep(.van-button--large) {
  width: 96%;
  height: 80px;
  margin: 0 auto;
  font-size: 31px;
}

:deep(.van-field__body) {
  width: 100%;
}
</style>
