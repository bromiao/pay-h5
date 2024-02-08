<script setup lang="ts">
import { useEntryStore } from '@/store/modules/entry'
import { IADModWebUrlLink } from '@/store/types/entry'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const entryStore = useEntryStore()
const { config } = storeToRefs(entryStore)

const adModWebUrlLink = computed<IADModWebUrlLink>(
  () => (config.value.Web_Set_DefaultInfo?.AD_Mod_WebUrlLink ?? {}) as IADModWebUrlLink
)

// 广告位跳转
const goPage = (webUrlLink: string) => {
  const url = new URL(webUrlLink)
  if (adModWebUrlLink.value.H5_action) {
    const { href, hash } = window.location

    router.push(adModWebUrlLink.value.H5_action)
    // window.location.href = href.replace(hash, `#${adModWebUrlLink.value.H5_action}`)
  } else {
    window.open(webUrlLink, '_blank')
  }
}
</script>

<template>
  <!-- 广告位 -->
  <div
    v-if="adModWebUrlLink.is_show && adModWebUrlLink.v"
    class="app-ad-banner-container"
  >
    <img
      :src="adModWebUrlLink.v"
      @click="goPage(adModWebUrlLink.WebUrlLink)"
    />
  </div>
</template>

<style lang="scss" scoped>
.app-ad-banner-container {
  margin: 0 auto;
  margin-bottom: 30px;
  padding: 0 41px;
  img {
    width: 100%;
  }
}
</style>
