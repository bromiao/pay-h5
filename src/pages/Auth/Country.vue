<template>
  <div class="country bg-[#fff] h-[100vh] z-[20000]">
    <!-- <form action="/"> -->
    <van-search
      v-model="value"
      show-action
      placeholder="请输入搜索关键词"
      @update:model-value="onSearch"
      @search="onSearch"
    >
      <template #action>
        <div @click="oncancel">取消</div>
      </template>
    </van-search>
    <!-- </form> -->
    <div class="px-[20px]">
      <p class="h-[70px] text-[29px] mb-[10px] flex_s text-[#666666] border_p">国家/地区</p>
    </div>
    <ul>
      <li
        class="flex_s w-[100%] h-[80px] text-[29px] px-[20px]"
        v-for="item in list"
        :key="item.id"
        @click="gopath(item)"
      >
        <img
          class="h-[65%] mr-[13px]"
          :src="requireImg('common/' + item.country_code + '.png')"
          alt=""
        />
        <span>{{ item.country_name }}</span>
        <span class="absolute right-[20px]">{{ item.phone_code }}</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
const fromPath = ref('/auth/login')
export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // next() 可以通过内部的回调函数访问实例
    fromPath.value = from.path
    // console.log('fromPath.value', fromPath.value)
    next(e => {
      // window.console.log(e) // 当前的this
    })
  }
})
</script>

<script setup lang="ts">
import { requireImg } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { ToastOptions, showToast } from 'vant'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ResCountryCode, ResCountryCodeObj, wallet_type } from '@/apis/auth'
const router = useRouter()
const route = useRouter()
// console.log('route', route)

const value = ref('')
const list = ref([] as ResCountryCodeObj[])
const list2 = ref([] as ResCountryCodeObj[])
let t: any = null
const onSearch = (val: string) => {
  clearTimeout(t)
  t = setTimeout(() => {
    if (!!!val) {
      list.value = list2.value
    } else {
      list.value = list2.value.filter(e => {
        // console.log('e', e.country_name)
        return (
          e.country_name.includes(val.toUpperCase()) ||
          e.country_name.includes(val.toLowerCase()) ||
          e.country_name.toLowerCase().includes(val.toLowerCase()) ||
          e.country_name.toUpperCase().includes(val.toUpperCase()) ||
          e.country_name.includes(val) ||
          e.phone_code.includes(val.toLowerCase())
        )
      })
    }
  }, 500)
}
const oncancel = () => {
  // showToast('取消')
  router.replace(fromPath.value)
}
const gopath = (item: { country_code: string; phone_code: string | number }) => {
  let path =
    fromPath.value + '?country_code=' + item.country_code + '&phone_code=' + +item.phone_code
  // console.log(path)
  router.replace(path)
}

wallet_type({}).then(data => {
  // console.log('data', data)
  if (!!!data.country_coin.length) return showToast('数据异常')
  list.value = data.country_coin
  list2.value = data.country_coin
})
</script>
<style scoped lang="scss">
.border_p {
  border-bottom: 1px #c2c2c2 solid;
}
</style>
<style lang="scss">
.dialog-bind-pay-way {
  padding-bottom: 32px;
  .dialog-title {
    height: 50px;
  }
  .dialog-content {
    height: 120px;
    text-align: center;
  }
}
</style>
