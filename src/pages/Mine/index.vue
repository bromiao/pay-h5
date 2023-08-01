<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
const routeData = [
  { title: '关注', path: '/index/follows' },
  { title: '推荐', path: '/index/recommend' },
  { title: '精选', path: '/index/selection' }
]

const tabIndex = ref(0)
const addAnimation = ref(true)
const tabsActiveBar = ref()
const topItem = ref()
const toggleTopMenu = (index: number, needAnimation = true) => {
  let width = topItem.value[index].clientWidth + 'px'
  // const width = topItem.clientWidth * 0.7 + 'px' //	在页面上返回内容的可视宽度（不包括边框，边距或滚动条）
  // const width = topItem.value?.clientWidth + 'px' //	在页面上返回内容的可视宽度（不包括边框，边距或滚动条）

  tabsActiveBar.value.style.width = width
  tabIndex.value = index
  addAnimation.value = needAnimation
  if (tabIndex.value == 0) {
    // tabsActiveBar.style.left = dom_.topItem[0].$el.clientWidth * 0.15 + 'px'
    tabsActiveBar.value.style.left = '0'
  } else {
    // const left = topItem.offsetLeft + topItem.clientWidth * 0.15 + 'px' // 返回当前元素的相对水平偏移位置的偏移容器
    tabsActiveBar.value.style.left = topItem.value[index].offsetLeft + 'px'
  }
}

onUnmounted(() => {
  tabsActiveBar.value = null
  topItem.value = null
})
</script>

<template>
  <div class="home">
    <div class="title">GDPAY-mine</div>
    <div class="bar-menu">
      <div
        v-for="(item, index) in routeData"
        :key="item.path"
        ref="topItem"
        @click="toggleTopMenu(index)"
        class="item"
      >
        {{ item.title }}
      </div>
      <!-- 下划线 -->
      <div
        class="tabs-active-bar"
        :class="{ 'tabs-move': addAnimation }"
        ref="tabsActiveBar"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bar-menu {
  position: relative;
  display: flex;
  flex: 1;
  justify-content: space-between;
  font-size: 20px;
  color: rgb(190, 190, 190);
  font-weight: 600;
  .tabs-active-bar {
    position: absolute;
    left: 0.0475rem;
    bottom: 4px;
    width: 30px;
    height: 2px;
    background-color: #ffe600;
    box-sizing: border-box;
    z-index: 1;
    &.tabs-move {
      transition: all 0.3s ease-out;
    }
  }
}
</style>
