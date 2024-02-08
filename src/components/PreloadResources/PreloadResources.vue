<script setup lang="ts">
/**
 * @description 此文件处理预加载资源逻辑，js、css、图片等
 */
import { ref } from 'vue'
import spritesHome from '@/assets/images/sprites-home.png'

const spritesHomeUrl = ref(`url(${spritesHome})`)
</script>

<template>
  <div class="preload-resources-container"></div>
</template>

<style lang="scss" score>
.preload-resources-container {
  &::before {
    content: '';
    background-image: v-bind('spritesHomeUrl');
  }
}
</style>
