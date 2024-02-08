interface parm {
  cmd: string //事件
  // 推送买币订单状态
  // push_coin_buy_order_status
  // 推送卖币订单状态
  // push_coin_sell_order_status
  // push_message站内消息
  // push_coinsellcomment交易申诉更新
  // push_reminders_buy买方发送给卖方催单
  // push_reminders_sell卖方发送给买方催单
  uuid: string //会员uuid
  send_uuid: string //发起者uuid，如果没有为空或null
  data: Array<any> //相关资料
}

import router from '@/router'
import mitt from '@/utils/mitt'
import { showDialog, showToast } from 'vant'
import { useRoute } from 'vue-router'
const resHandle = (data: any) => {
  // console.log('sockte', data)
  const cmd = data.cmd
  switch (cmd) {
    case 'connected': //连接成功
      // console.log('连接成功')
      break
    case 'user_bad': //非校验成功消息 心跳
      // console.log('非校验成功消息');
      break
    case 'user_ok': //校验成功
      console.log('校验成功')
      break
    case 'push_coin_buy_order_status':
      console.log('1push_coin_buy_order_status1222') //推送买币订单状态
      mitt.emit('push_coin_buy_order_status', data)
      break
    case 'push_coin_sell_order_status':
      mitt.emit('push_coin_sell_order_status', data) //推送卖币订单状态
      console.log('push_coin_sell_order_status000000')
      break
    case 'push_message': //站内消息
      mitt.emit('push_message', data)
      break
    case 'push_coinsellcomment': //交易申诉更新
      mitt.emit('push_coinsellcomment', data)
      break
    case 'push_reminders_buy': //买方发送给卖方催单
      mitt.emit('push_reminders_buy', data)
      break
    case 'push_reminders_sell': //卖方发送给买方催单
      mitt.emit('push_reminders_sell', data)
      break
  }
}

export default resHandle
