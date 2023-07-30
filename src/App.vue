<script setup lang="ts">
import MenuBar from '@/components/Menu/MenuBar.vue'
</script>

<template>
  <div class="content-container">
    <router-view />
    <MenuBar />
  </div>
</template>

<style scoped lang="scss">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.content-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
