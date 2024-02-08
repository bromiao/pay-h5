<template>
  <div class="content">
    <!-- //当前展示的div，设置了overflow:hidden -->
    <div
      class="count_item"
      v-for="(item, index) in countRender"
      :key="index"
    >
      <!-- //如果当前是逗号就直接渲染 -->
      <div
        class="icon"
        v-if="isNaN(Number(item))"
      >
        {{ item }}
      </div>
      <!-- //否则需要渲染0-9一共10个垂直的div用于滚动 -->
      <div
        v-else
        class="digital_wrap"
      >
        <div
          :style="{
            transition: 'transform 1s',
            transform: `translateY(-${item * 10}%)`
          }"
        >
          <!-- //0-9的div容器 -->
          <div
            v-for="(items, index) in currentValRef.split('')"
            :key="index"
            class="digital"
          >
            {{ items }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
const props = defineProps({
  count: {
    type: String,
    default: '00000000'
  }
})
//将数字处理为每隔3位加一个逗号，用于美观
const countRender = computed(() => {
  return props.count.replace(/(?!^)(?=(\d{3})+$)/g, ',')
})
const currentValRef = ref('0123456789')
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: space-between;
  width: 800px;
  align-items: center;
}
.icon {
  font-size: 50px;
  color: #fff;
  height: 120px;
  flex-direction: column;
  display: flex;
  justify-content: flex-end;
}
.digital_wrap {
  width: 80px;
  height: 120px;
  overflow: hidden;
}
.digital {
  width: 100%;
  font-size: 50px;
  color: #fff;
  height: 100%;
  line-height: 120px;
  text-align: center;
}
</style>
