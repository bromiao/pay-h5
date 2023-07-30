<template>
  <div class="item">
    <router-link
      :to="routePath"
      tag="div"
      class="flex-item"
      :class="isActive ? 'active' : ''"
    >
      <i
        class="icon"
        :class="'bar-' + icon"
      ></i>
      <span>{{ title }}</span>
      <slot></slot>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export interface Props {
  title: string
  routePath: string
  icon: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  routePath: '/',
  icon: ''
})

const route = useRoute()
const isActive = computed(() => route.path.split('/')[1] === props.routePath.split('/')[1])
</script>

<style lang="scss" scoped>
.item {
  flex: 1;
  text-align: center;
  font-weight: 500;
  .flex-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
  [class*='bar-'] {
    display: block;
    width: 38px;
    height: 38px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  @each $svg in video, douyin, game, community, mine {
    .bar-#{$svg} {
      background-image: url('~@/assets/images/svg/bar-#{$svg}.svg');
    }
  }
}
.active {
  //color: #ffff;
  font-weight: 600;
}
</style>
