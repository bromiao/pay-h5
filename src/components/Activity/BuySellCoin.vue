<script setup lang="ts">
import { computed, onMounted } from 'vue'

interface Props {
  data: Record<string, any>
}
const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    icon: '',
    title: '',
    amount: '',
    limitAmount: '',
    count: 0,
    limitCount: 5,
    text: '',
    btnText: ''
  })
})

const taskPercentage = computed(() => (props.data.count / props.data.limitCount) * 100)

onMounted(() => {
  //
})
</script>

<template>
  <div class="buy-sell-coin-container">
    <div class="flex justify-between">
      <img
        :src="data.icon"
        class="w-[88px] h-[88px] mr-[20px]"
      />
      <div class="flex flex-col flex-1">
        <div class="flex justify-between items-center mb-[22px]">
          <div>
            <span class="text-[26px] text-[#681704]">{{ data.title }}</span>
            <span class="text-[26px] text-[#b1a7a7]">
              （{{ data.amount }}/{{ data.limitAmount }}）
            </span>
          </div>
          <div class="text-[26px] text-[#681704]">{{ data.count }}/{{ data.limitCount }}</div>
        </div>
        <van-progress
          pivot-text=""
          color="linear-gradient(to right, #e8466b 15%, #ea5451 47%, #ec6342 100%)"
          track-color="#d1d1d1"
          :percentage="taskPercentage"
          stroke-width="10"
        />
      </div>
    </div>

    <div class="flex justify-between items-center mt-[6px] pl-[7px]">
      <div
        class="text-desc text-[21px] text-[#b1a7a7]"
        v-html="data.text"
      ></div>

      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.buy-sell-coin-container {
  padding: 20px 23px;
  border-radius: 14px;
  border: 2px solid #f7d6c2;
  background-image: linear-gradient(0deg, #fffaea 0%, #fff2d3 50%, #ffeabb 100%);
  .text-desc {
    :deep(span) {
      font-size: 21px;
      font-weight: bold;
      color: #df4954;
    }
  }
}
</style>
