<template>
  <div class="no-data flex flex-col items-center justify-center">
    <img :src="noData" />
    <div class="text-no-data text-center">暂无数据</div>
  </div>
</template>

<script setup lang="ts">
import noData from '@/assets/images/common/noData.png'
</script>

<style lang="scss" scoped>
.no-data {
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate3d(-50%, -50%, 0);
  img {
    width: 240px;
  }
  .text-no-data {
    width: 100%;
    margin-bottom: 22px;
    font-size: 18px;
  }
}
</style>
