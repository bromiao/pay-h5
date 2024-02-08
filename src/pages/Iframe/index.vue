<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
</script>

<template>
  <div class="view-container">
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.view-container {
  width: 100%;
  height: 100%;
}
</style>
