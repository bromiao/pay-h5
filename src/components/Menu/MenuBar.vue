<template>
  <div
    class="tab-bar"
    ref="tabBar"
  >
    <MenuItem
      v-for="item in menuData"
      :key="item.routePath"
      :title="item.title"
      :route-path="item.routePath"
      :icon="item.icon"
    ></MenuItem>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import MenuItem from './MenuItem.vue'

const menuData = reactive([
  {
    title: '首页',
    routePath: '/',
    icon: 'home',
    active: true
  },
  {
    title: '积分',
    routePath: '/point',
    icon: 'point',
    active: false
  },
  {
    title: '扫码',
    routePath: '/scan',
    icon: 'scan',
    active: false
  },
  {
    title: '订单',
    routePath: '/order',
    icon: 'order',
    active: false
  },
  {
    title: '我的',
    routePath: '/mine',
    icon: 'mine',
    active: false
  }
])

let tabBar = ref(null)
onMounted(() => {})
</script>

<style lang="scss" scoped>
.tab-bar {
  background: #fff;
  color: #1a1a1a;
  width: 100vw;
  height: 128px;
  //position: fixed;
  // bottom: 0;
  // top: calc(100vh - 160px);
  //left: 0;
  display: flex;
  justify-content: space-around;
  color: #cccccc;
  font-size: 16px;
  z-index: 9999;
  .dy-btn {
    width: 50px;
    height: 30px;
    margin: 10px;
  }
}
</style>
