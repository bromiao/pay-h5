<script setup lang="ts">
import { computed, onMounted } from 'vue'

interface Props {
  data: Record<string, any>
}
const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    top: [
      { name: '本周累计上分', value: 0 },
      { name: '可申请总次数', value: 0 },
      { name: '已申请次数', value: 0 }
    ],
    middle: {
      text: '每上分【 200 】元可获得1次翻卡机会，一周最多可得【 10 】次（上分到不同的游戏平台次数可累加）',
      num1: 0,
      num2: 20
    }
  })
})

const taskPercentage = computed(() => (props.data.middle.num1 / props.data.middle.num2) * 100)

onMounted(() => {
  // window.log(1111, props.data)
})
</script>

<template>
  <div class="week-task-container">
    <div class="top-content flex justify-between items-center">
      <div
        v-for="(item, index) in data.top"
        :key="index"
        class="item-data flex flex-col justify-between items-center"
      >
        <div class="text-[#df4954] text-[50px] font-bold">{{ item.value }}</div>
        <div class="text-[#955608] text-[26px]">{{ item.name }}</div>
      </div>
    </div>

    <div class="middle-content">
      <van-progress
        pivot-text=""
        color="linear-gradient(to right, #e8466b 15%, #ea5451 47%, #ec6342 100%)"
        track-color="#d1d1d1"
        :percentage="taskPercentage"
        stroke-width="10"
      />
      <div class="flex justify-between items-start gap-[50px] mt-[25px] mb-[40px]">
        <div
          class="text-desc text-[21px] text-[#b1a7a7]"
          v-html="data.middle.text"
        ></div>
        <div class="text-[26px] text-[#955608]">{{ data.middle.num1 }}/{{ data.middle.num2 }}</div>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.week-task-container {
  padding: 0 23px;
  border-radius: 14px;
  border: 2px solid #f7d6c2;
  background-image: linear-gradient(0deg, #fffaea 0%, #fff2d3 50%, #ffeabb 100%);
  .top-content {
    padding: 45px 20px 10px 20px;
    border-bottom: 2px dashed #f7d6c2;
  }

  .middle-content {
    padding: 25px 10px 0 10px;
    :deep(.van-progress) {
      margin: 0 -10px;
      border-radius: 10px;
    }
    .text-desc {
      :deep(span) {
        font-size: 21px;
        font-weight: bold;
        color: #df4954;
      }
    }
  }
}
</style>
