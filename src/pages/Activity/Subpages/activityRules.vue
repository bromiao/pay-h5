<template>
  <nav-bar
    class="nav-bar"
    title="活动规则"
    mode="cardActivity"
  />

  <div class="activityRules">
    <div class="rulesTop flex_sz activityColor">
      <div class="item">
        <div class="circle"></div>
        <p>1.完成任务</p>
      </div>
      <div class="item">
        <div class="circle"></div>
        <p>2.获得翻卡</p>
      </div>
      <div class="item">
        <div class="circle"></div>
        <p>3.合成卡</p>
      </div>
      <div class="item">
        <div class="circle"></div>
        <p>4.等待派奖</p>
      </div>
    </div>
    <div class="rules-content activity_container activitydarkColor overflow_a">
      <!-- <span class="text-[#d8281f]">【活动对象】</span>
      全体会员
      <br />
      <span class="text-[#d8281f]">【活动周期】</span>
      即日起
      <span class="text-[#d8281f]">【活动结束时间以官方通知为准】</span>
      <br />
      <span class="text-[#d8281f]">【参与方式】</span>
      完成任务即可参与活动
      <br />
      <br />
      <span class="text-[#d8281f]">【活动内容】</span> -->
      <div v-html="content"></div>
      <!-- {{ content }} -->
      <!-- <br />
      1、每完成一个任务可以获得一个翻卡的机会；
      <br />
      2、上分到与GDpay合作的游戏平台即可申请翻卡机会；
      <br />
      3、买币卖币金额超过最低获卡金额，即可获得翻卡机会；
      <br />
      4、获得的卡片若有富余，可以相互赠送, 赠送达到 5 次后也 可获得翻卡机会；
      <br />
      5、集卡【恭】【喜】【发】【财】4字套卡，集全1套后立即 派奖，瓜分10W大奖；单次最高可得999大奖；
      <br />
      6、排行榜大奖：按集全1套【恭喜发财】的数量与时间先后顺 序排名，统计自然周，周一00：00 01 -
      周日每周日23：00 00 的数据，每周日23:00自动派奖，进行瓜分大奖，第一名最高 可得1999大奖；
      <br />
      7、当参与优惠会员未能完全遵守、或违反、或滥用任何有关
      公司优惠或推广的条款，公司保留权利向此团队或个人停止、 取消或索回已支付的全部奖励；
      <br />
      8、公司保留对活动的最终解释权适用于所有会员。 -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { articleListApi } from '@/apis/article'
import { onMounted, ref } from 'vue'
import { useAppBar } from '@/components/AppBar/useAppBar'
useAppBar({ mode: 'dark' })
const content = ref('')
articleListApi({
  bind_key: 'Jifuka_Notice'
}).then(data => {
  if ((data as any).code) return console.log('数据异常')
  content.value = data[0].content
})
onMounted(() => {})
</script>
<style lang="scss" scoped>
.activityRules {
  height: 100%;
  font-size: 30px;
  .rulesTop {
    width: 100%;
    padding: 20px;
    height: 200px;
    background: var(--app-spring-festival-activity-theme);
    .item {
      width: 25%;
      height: 100px;
      .circle {
        margin: 0 auto;
        border-radius: 50%;
        width: 53px;
        height: 53px;
        line-height: 53px;
        text-align: center;
        background: #ccc;
        background: url('../../../assets/images/common/qianbi.png');
        background-size: cover;
        margin-bottom: 10px;
      }
      p {
        text-align: center;
        font-size: 25px;
      }
    }
  }
  .rules-content {
    top: -14px;
    padding: 20px 20px;
    height: calc(100vh - 300px);
  }
}
</style>
