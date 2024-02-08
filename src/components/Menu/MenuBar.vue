<template>
  <div
    class="tab-bar hairline-border"
    ref="tabBar"
  >
    <template
      v-for="item in menuData"
      :key="item.routePath"
    >
      <MenuItem
        v-if="item.title != '扫码' || (item.title == '扫码' && inweb)"
        :title="item.title"
        :route-path="item.routePath"
        :icon="item.icon"
        :img_src="item.img_src"
      ></MenuItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import MenuItem from './MenuItem.vue'
import { requireImg } from '@/utils/tools'
import { InWEB } from '@/utils/tools'
const inweb = ref(false)
const menuData = reactive([
  {
    title: '买币',
    routePath: '/index',
    icon: 'buy-coin',
    active: true
  },
  {
    title: '卖币',
    routePath: '/sell-coin',
    icon: 'sell-coin',
    active: false
  },
  {
    title: '订单',
    routePath: '/order',
    icon: 'order',
    active: false
  },
  {
    title: '积分',
    routePath: '/point',
    icon: 'point',
    active: false
  },
  {
    title: '扫码',
    routePath: '/scanQR',
    img_src: requireImg('qr.png', 1),
    active: false
  },
  {
    title: '我的',
    routePath: '/mine',
    icon: 'mine-icon',
    active: false
  }
])

let tabBar = ref(null)
onMounted(() => {
  inweb.value = InWEB()
})
</script>

<style lang="scss" scoped>
.tab-bar {
  background: #fff;
  color: #1a1a1a;
  width: 100%;
  flex: 0 0 130px;
  display: flex;
  justify-content: space-around;
  color: #cccccc;
  font-size: 16px;
  z-index: 99;
  &.hairline-border::after {
    border: 0 !important;
    border-top: 1px solid #d6dce8 !important;
  }
}
</style>
