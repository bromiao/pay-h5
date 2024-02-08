<template>
  <van-nav-bar
    class="processActive van-safe-area-top !bg-[#ebf1f6]"
    title=""
    left-arrow
    @click-left="onClickLeft"
    :class="processActive == 4 ? 'processActive' : ''"
  />
  <div
    class="orderCreate overflow_a"
    :class="[7].includes(BuyOrderDetail.status) ? 'overflow_a' : ''"
  >
    <!-- <nav-bar :mode="processActive == 4 ? 'white' : 'transparent'" @click-left="onClickLeft" /> -->
    <!-- <nav-bar mode="white" /> -->

    <div
      class="top_wrop"
      v-if="seller && !SellOrder && processActive != 4"
      :class="[2, 4, 5, 9, 10].includes(BuyOrderDetail.status) ? 'back_white' : ''"
    >
      <div class="top_orderNum">
        挂单编号
        <span>{{ SellOrderNum }}</span>
      </div>
      <div class="top_orderAmount">
        挂单金额
        <span>{{ SellOrderAmount }}</span>
        {{ (moveBrick && seller) || onlineCharge ? 'CNY' : coin_name }}
        <span
          :class="SellOrderIs_split == 1 ? 'green_f' : 'red_f'"
          class="right"
        >
          {{ SellOrderIs_split == 1 ? '可拆分' : '不可拆分' }}
        </span>
      </div>
    </div>
    <div
      class="titleProcess"
      :class="seller ? 'top_margin20' : ''"
      v-if="
        ![2, 4, 5, 8, 9, 10].includes(BuyOrderDetail.status) && processActive !== 4 && !SellOrder
      "
    >
      <van-row justify="space-between">
        <van-col
          span="8"
          class="process"
          :class="processActive == 1 ? 'processActive' : ''"
          @click="Goprocess(1)"
        >
          <div class="Onode flex_s">
            <div class="Pbg">
              {{ processActive == 1 ? '1' : '' }}
              <van-icon
                name="success"
                v-if="processActive > 1"
              />
            </div>
            <div class="point">
              <span
                v-for="e in Array(6)"
                :key="e"
              ></span>
            </div>
          </div>
          <p>订单已生成</p>
        </van-col>
        <van-col
          span="8"
          class="process"
          :class="processActive == 2 ? 'processActive' : ''"
          @click="Goprocess(2)"
        >
          <div class="Onode flex_s">
            <div class="Pbg">
              {{ processActive <= 2 ? '2' : '' }}
              <van-icon
                name="success"
                v-if="processActive > 2"
              />
            </div>
            <div class="point">
              <span
                v-for="e in Array(6)"
                :key="e"
              ></span>
            </div>
          </div>
          <p>{{ seller ? '等待买家付款' : '向卖家付款' }}</p>
        </van-col>
        <van-col
          span="8"
          class="process"
          :class="processActive == 3 ? 'processActive' : ''"
          @click="Goprocess(3)"
        >
          <div class="Onode flex_s">
            <div class="Pbg">3</div>
          </div>
          <p>等待放行</p>
        </van-col>
      </van-row>
    </div>

    <div class="Fcontent van-safe-area-bottom">
      <div
        v-if="processActive !== 4"
        class="clearfix"
      >
        <!-- 上方标题 -->
        <div v-if="!SellOrder">
          <div
            class="O_title"
            v-if="[2, 4, 5].includes(BuyOrderDetail.status)"
          >
            订单已取消
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 1"
          >
            {{ SellOrder ? '挂单已生成' : '订单已生成' }}
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 3"
          >
            {{ seller ? '等待买家付款' : '向卖家付款' }}
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 6"
          >
            {{ seller ? '买家已付款' : '等待卖家放行' }}
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 7"
          >
            {{ seller ? '买家已付款' : '等待卖家放行' }}
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 8"
          >
            交易完成
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 9"
          >
            订单已取消
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 10"
          >
            交易完成
          </div>

          <!-- 下方小文字提示 -->
          <div
            class="O_tips"
            v-if="BuyOrderDetail.status === 1"
          >
            {{ seller ? '在' : '等待卖家确认交易，' }}
            <span class="O_red">{{ secondsToMinutesWithSeconds(BuyOrderDetail.time_second) }}</span>
            后交易将取消
          </div>

          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 2"
          >
            {{ seller ? '卖家' : '卖家' }}取消交易
          </div>

          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 3 && seller"
          >
            在
            <span class="O_red">{{ secondsToMinutesWithSeconds(BuyOrderDetail.time_second) }}</span>
            后交易将取消
          </div>

          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 3 && !seller"
          >
            请在
            <span class="O_red">{{ secondsToMinutesWithSeconds(BuyOrderDetail.time_second) }}</span>
            内付款给卖家
            <br />
            请使用本人账号进行付款
          </div>

          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 4"
          >
            {{ seller ? '买家付款超时' : '买家付款超时' }}
          </div>
          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 5"
          >
            {{ seller ? '买家' : '买家' }}取消交易
          </div>
          <!-- <div class='O_tips' v-else-if="BuyOrderDetail.status === 6">{{ seller ? '买家' : '买家' }}已付</div> -->

          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 6 && seller"
          >
            <span class="O_red">
              为避免损失，请确认到账后再进行放行，放行后将划转您的{{ coin_name }}币
            </span>
            <br />
            <span class="O_red">{{ secondsToMinutesWithSeconds(BuyOrderDetail.time_second) }}</span>
            后可发起申诉
          </div>
          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 6 && !seller"
          >
            <span class="O_red">{{ secondsToMinutesWithSeconds(BuyOrderDetail.time_second) }}</span>
            后可发起申诉
          </div>

          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 7"
          >
            {{ SellOrder ? '取消卖出' : seller ? `请` : '确认超时您可以提交申诉材料进行申诉' }}
            <span
              v-if="!SellOrder && seller"
              class="O_red"
            >
              确认到账
            </span>
            {{ !SellOrder && seller ? '后，进行放行！' : '' }}
            <br />
            {{ !SellOrder && seller ? '确认超时时您可以提交申诉材料进行申诉' : '' }}
          </div>
          <!-- <div class='O_tips' v-if="BuyOrderDetail.status === 7 && !seller && !SellOrder">确认超时时您可以提交申诉材料进行申诉</div> -->

          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 8"
          >
            已完成
          </div>
          <div
            class="O_tips O_red big_tit"
            v-else-if="BuyOrderDetail.status === 9"
          >
            申诉强制取消
          </div>
          <div
            class="O_tips O_red big_tit"
            v-else-if="BuyOrderDetail.status === 10"
          >
            申诉强制成功
          </div>
        </div>

        <!-- 挂单时的页面 -->
        <div v-else>
          <div
            class="O_title"
            v-if="[2, 4, 5, 9, 10].includes(BuyOrderDetail.status)"
          >
            订单已取消
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 1"
          >
            {{ SellOrder ? '挂单已生成' : '订单已生成' }}
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 3"
          >
            {{ seller ? '等待买家付款' : '向卖家付款' }}
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 6"
          >
            全部完成
          </div>
          <div
            class="O_title"
            v-else-if="BuyOrderDetail.status == 7"
          >
            取消挂单
          </div>

          <!-- 挂单时的页面下方小文字提示 -->
          <div
            class="O_tips"
            v-if="BuyOrderDetail.status === 1"
          >
            挂单中
          </div>
          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 2"
          >
            确认交易中
          </div>
          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 3"
          >
            等待买家付款
          </div>
          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 4"
          >
            确认收款中
          </div>
          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 5"
          >
            挂起待确认
          </div>
          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 6"
          >
            全部完成
          </div>
          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 7"
          >
            取消卖出
          </div>
          <div
            class="O_tips"
            v-else-if="BuyOrderDetail.status === 8"
          >
            部分完成
          </div>
        </div>

        <!-- 头像和提醒 -->
        <div
          class="O_username flex_s"
          v-if="!SellOrder && !onlineCharge"
        >
          <van-image
            lazy-load
            class="Oavatar"
            :src="t_pic"
          />
          <span class="OuserName van-ellipsis">
            {{ seller ? BuyOrderDetail.nickname : BuyOrderDetail.sell_info?.nickname }}
          </span>
          <van-button
            v-if="![2, 4, 5, 8, 9, 10].includes(BuyOrderDetail.status)"
            type="primary"
            :disabled="tixin > 0"
            @click="
              Reminders({ buy_order_id: BuyOrderDetail.order_id }).then(data => {
                if (data instanceof Array && data.length == 0 && (data as any).code != 0) return
                showToast({ message: '提醒成功', icon: success })
                tixin = 60
              })
            "
            class="contactSeller"
          >
            <van-icon name="chat-o" />
            {{ tixin > 0 ? tixin : '交易提醒' }}
          </van-button>
        </div>
        <div
          class="O_username flex_s w-[100%] relative"
          v-if="!SellOrder && onlineCharge"
        >
          <van-button
            v-if="![2, 4, 5, 8, 9, 10].includes(BuyOrderDetail.status)"
            type="primary"
            :disabled="tixin > 0"
            @click="
              Reminders({ buy_order_id: BuyOrderDetail.order_id }).then(data => {
                if (data instanceof Array && data.length == 0 && (data as any).code != 0) return
                showToast({ message: '提醒成功', icon: success })
                tixin = 60
              })
            "
            class="contactSeller"
          >
            <van-icon name="chat-o" />
            {{ tixin > 0 ? tixin : '交易提醒' }}
          </van-button>
          <van-button
            v-if="![2, 4, 5, 8, 9, 10].includes(BuyOrderDetail.status)"
            type="primary"
            plain
            @click="$router.push('/iframe-page/third?url=customer-service')"
            class="!bg-[#fff] !text-[var(--van-button-primary-background)] !h-[69.444px] !absolute right-[20px]"
          >
            {{ '联系客服' }}
          </van-button>
        </div>

        <!-- 支付方式信息 -->
        <div
          v-if="
            (!SellOrder && !seller && [3, 6, 7, 8, 9, 10].includes(BuyOrderDetail.status)) ||
            (!SellOrder && seller && [6, 7, 8, 9, 10].includes(BuyOrderDetail.status))
          "
          class="O_orderInfo O_pay !px-[0] clearfix"
        >
          <div class="px-[15px]">
            <div
              v-if="BuyOrderDetail.coin_protocol == 'BANK'"
              class="flex_s"
            >
              <van-image
                class="payImg BANK"
                lazy-load
                :src="requireImg('common/credit.png')"
              />
              <span class="payTitle">
                银行卡支付
                <span class="ml-[70px] text-[red]">支持 支付宝/网银/微信 转账</span>
              </span>
            </div>
            <div
              v-if="BuyOrderDetail.coin_protocol == 'ALIPAY'"
              class="flex_s"
            >
              <van-image
                class="payImg"
                lazy-load
                :src="requireImg('common/ALIPAY.png')"
              />
              <span class="payTitle">支付宝支付</span>
            </div>
            <div
              v-if="BuyOrderDetail.coin_protocol == 'WXPAY'"
              class="flex_s"
            >
              <van-image
                class="payImg"
                lazy-load
                :src="requireImg('common/WeChatPay.png')"
              />
              <span class="payTitle">微信支付</span>
            </div>
            <div
              v-if="BuyOrderDetail.coin_protocol == 'SZRMB'"
              class="flex_s"
            >
              <van-image
                class="payImg"
                lazy-load
                :src="requireImg('common/SZRMB.png')"
              />
              <span class="payTitle">数字人民币</span>
            </div>
            <div class="O_count mt-[10px]">
              {{ seller ? '付款' : '收款' }}姓名
              <span class="O_nums">
                {{
                  seller
                    ? BuyOrderDetail.pay_realname
                    : BuyOrderDetail.sell_info?.collection_realname
                }}
                <van-icon
                  name="label-o"
                  class="copy"
                  size="16"
                  @click="
                    copy(
                      seller
                        ? BuyOrderDetail.pay_realname
                        : BuyOrderDetail.sell_info?.collection_realname
                    )
                  "
                />
              </span>
            </div>
            <div
              class="O_count"
              v-if="BuyOrderDetail.coin_protocol == 'BANK'"
            >
              {{ seller ? '付款银行名称' : '收款银行名称' }}
              <span class="O_nums">
                {{
                  seller
                    ? BuyOrderDetail.pay_bankname
                    : BuyOrderDetail.sell_info?.collection_bankname
                }}
                <van-icon
                  name="label-o"
                  size="16"
                  class="copy"
                  @click="
                    copy(
                      seller
                        ? BuyOrderDetail.pay_bankname
                        : BuyOrderDetail.sell_info?.collection_bankname
                    )
                  "
                />
              </span>
            </div>
            <div class="O_count">
              {{ seller ? '付款' : '收款'
              }}{{
                BuyOrderDetail.coin_protocol == 'SZRMB'
                  ? '钱包编号'
                  : BuyOrderDetail.coin_protocol == 'BANK'
                  ? '银行卡号'
                  : BuyOrderDetail.coin_protocol == 'ALIPAY'
                  ? '支付宝账号'
                  : BuyOrderDetail.coin_protocol == 'WXPAY'
                  ? '微信账号'
                  : '地址'
              }}{{
                ['BANK', 'SZRMB'].includes(BuyOrderDetail.coin_protocol) && seller ? '后4位' : ''
              }}
              <span class="O_nums">
                {{
                  ['ALIPAY', 'WXPAY'].includes(BuyOrderDetail.coin_protocol)
                    ? seller
                      ? BuyOrderDetail.pay_cardid
                      : BuyOrderDetail.sell_info?.collection_cardid
                    : seller
                    ? BuyOrderDetail.pay_cardid.slice(
                        BuyOrderDetail.pay_cardid.length - 4 >= 0
                          ? BuyOrderDetail.pay_cardid.length - 4
                          : 0,
                        BuyOrderDetail.pay_cardid.length
                      )
                    : BuyOrderDetail.sell_info?.collection_cardid
                }}

                <van-icon
                  name="label-o"
                  size="16"
                  class="copy"
                  @click="
                    copy(
                      seller
                        ? BuyOrderDetail.pay_cardid
                        : BuyOrderDetail.sell_info?.collection_cardid
                    )
                  "
                />
              </span>
            </div>
            <div
              class="O_amount clearfix mb-[20px]"
              v-if="!seller && pay_pic && BuyOrderDetail.coin_protocol != 'SZRMB'"
            >
              收款码
              <div class="O_nums">
                <van-image
                  class="payImg1"
                  lazy-load
                  @click="showImagePreview([pay_pic])"
                  :src="pay_pic"
                />
              </div>
            </div>
          </div>
          <div
            class="hairline-border mb-[20px]"
            v-if="
              !seller &&
              onlineCharge &&
              BuyOrderDetail.coin_protocol != 'SZRMB' &&
              [3].includes(BuyOrderDetail.status)
            "
          ></div>
          <van-button
            v-if="
              !seller &&
              onlineCharge &&
              BuyOrderDetail.coin_protocol != 'SZRMB' &&
              [3].includes(BuyOrderDetail.status)
            "
            class="w-[92%] button_ali"
            plain
            type="primary"
            @click="
              goOpen(
                BuyOrderDetail.coin_protocol,
                seller
                  ? BuyOrderDetail.pay_realname
                  : BuyOrderDetail.sell_info?.collection_realname,
                seller ? BuyOrderDetail.pay_cardid : BuyOrderDetail.sell_info?.collection_cardid
              )
            "
          >
            打开{{ BuyOrderDetail.coin_protocol == 'WXPAY' ? '微信' : '支付宝' }}APP付款
          </van-button>
        </div>

        <!-- 交易信息 -->
        <div class="O_orderInfo">
          <div class="O_num">
            {{ SellOrder ? '挂单编号' : '订单编号' }}
            <span class="O_nums">{{ BuyOrderDetail.order_id }}</span>
          </div>
          <div
            class="O_num"
            :class="SellOrder ? 'm_SellOrder' : ''"
          >
            {{ SellOrder ? '挂单金额' : seller ? '出售数量' : '购买数量' }}
            <span class="O_nums">
              {{
                (BuyOrderDetail.buy_num && (+BuyOrderDetail.buy_num).toTruncFixed(2)) ||
                (+BuyOrderDetail.sell_num).toTruncFixed(2)
              }}
              {{ (moveBrick && seller) || onlineCharge ? 'CNY' : coin_name }}
            </span>
          </div>
          <div
            v-if="!SellOrder"
            :class="!seller ? 'O_amount' : 'O_count'"
          >
            {{ seller ? '获得金额' : '付款金额' }}
            <span class="O_nums">
              ￥ {{ BuyOrderDetail.buy_num || BuyOrderDetail.remaining_num }}
              <!-- <van-icon name="label-o" class="copy" size="16" 
                @click="copy(BuyOrderDetail.buy_num || BuyOrderDetail.remaining_num)" /> -->
            </span>
          </div>
          <div
            class="O_amount"
            v-if="!SellOrder && seller"
          >
            {{ moveBrick ? '搬砖' : '额外' }}{{ '奖励' }}
            <span class="O_nums1">
              {{ BuyOrderDetail.sell_gift && (+BuyOrderDetail.sell_gift).toTruncFixed(2) }}
              {{ (moveBrick && seller) || onlineCharge ? 'CNY' : coin_name }}
            </span>
          </div>

          <div
            class="O_amount"
            v-if="SellOrder"
          >
            是否可拆分
            <span
              class="O_nums"
              :class="BuyOrderDetail.is_split == 1 ? 'green_f' : 'red_f'"
            >
              {{ BuyOrderDetail.is_split == 1 ? '可拆分' : '不可拆分' }}
            </span>
          </div>
        </div>

        <!-- 收付款信息 -->

        <div
          v-if="
            (!onlineCharge &&
              !SellOrder &&
              !seller &&
              [3, 6, 7, 8, 9, 10].includes(BuyOrderDetail.status)) ||
            (!SellOrder && seller && [6, 7, 8, 9, 10].includes(BuyOrderDetail.status))
          "
          class="O_orderInfo O_pay clearfix"
        >
          <div class="O_count mt-[10px] pr-[15px]">
            {{ seller ? '收款' : '付款' }}姓名
            <span class="O_nums">
              {{
                seller ? BuyOrderDetail.sell_info?.collection_realname : BuyOrderDetail.pay_realname
              }}
            </span>
          </div>
          <div class="O_count pr-[15px]">
            {{ seller ? '收款' : '付款'
            }}{{
              BuyOrderDetail.coin_protocol == 'SZRMB'
                ? '钱包编号后4位'
                : BuyOrderDetail.coin_protocol == 'BANK'
                ? '银行'
                : BuyOrderDetail.coin_protocol == 'ALIPAY'
                ? '支付宝账号'
                : BuyOrderDetail.coin_protocol == 'WXPAY'
                ? '微信账号'
                : '地址'
            }}
            <span class="O_nums">
              {{
                ['ALIPAY', 'WXPAY'].includes(BuyOrderDetail.coin_protocol)
                  ? ''
                  : seller
                  ? BuyOrderDetail.sell_info?.collection_bankname
                  : BuyOrderDetail.pay_bankname
              }}
              {{
                ((str_f = seller
                  ? BuyOrderDetail.sell_info?.collection_cardid
                  : BuyOrderDetail.pay_cardid),
                str_f && ['ALIPAY', 'WXPAY'].includes(BuyOrderDetail.coin_protocol)
                  ? str_f
                  : str_f.slice(str_f.length - 4, str_f.length))
              }}
            </span>
          </div>
        </div>

        <!-- 上传付款凭证 -->
        <!-- (seller && [6].includes(BuyOrderDetail.status) && BuyOrderDetail.buy_img) -->
        <div
          v-if="
            (!seller && [3].includes(BuyOrderDetail.status)) ||
            (!seller && [6].includes(BuyOrderDetail.status) && BuyOrderDetail.buy_img)
          "
        >
          <p class="text-[25px] my-[26px]">
            上传付款凭证
            <van-popover
              v-if="!seller && [3].includes(BuyOrderDetail.status)"
              v-model:show="showPopover"
              placement="top"
              className="sell_popover1  van-popup van-popover van-popover--light "
            >
              必须上传付款凭证才能点击【我已付款】，请务必确保您的转账已经成功，再通知卖家
              <template #reference>
                <van-icon name="question-o" />
              </template>
            </van-popover>
          </p>
          <van-uploader
            v-if="BuyOrderDetail.buy_img"
            v-model="buy_img"
            :deletable="false"
            :max-count="1"
            class="O_uploader"
          />
          <van-uploader
            v-else
            v-model="fileList"
            @clickUpload="payimg = true"
            :after-read="afterRead"
            :max-size="10 * 1000 * 1024"
            @oversize="onOversize"
            :before-read="beforeRead"
            :max-count="1"
            class="O_uploader"
          />
          <div
            class="toips_uploader right text-[24px] w-[480px]"
            v-doubleclick="dblclickHandle"
            v-threeclick="ThreeclickHandle"
          >
            如无法上传图片，请第一时间联系
            <br />
            在线客服，否则造成损失自行负责
          </div>
        </div>

        <!-- 输入框填写付款信息 -->
        <div
          v-if="
            !SellOrder && onlineCharge && !seller && [3, 6, 7, 8].includes(BuyOrderDetail.status)
          "
          class="O_orderInfo O_pay clearfix"
          :class="[7, 6, 8].includes(BuyOrderDetail.status) ? 'bg_info' : '!bg-[#fff]'"
        >
          <div class="mt-[10px] h-[50px] leading-[50px] my-[10px]">
            <van-field
              :input-align="[7, 6, 8].includes(BuyOrderDetail.status) ? 'right' : 'left'"
              :readonly="!!pay_realname || [7, 6, 8].includes(BuyOrderDetail.status)"
              class="!text-[25px] !p-[0] order_input_pl"
              :class="{
                unboder:
                  !!pay_realname || [7, 6, 8].includes(BuyOrderDetail.status) ? 'unboder' : '',
                SZRMB: BuyOrderDetail.coin_protocol == 'SZRMB' ? 'SZRMB' : ''
              }"
              placeholder="付款人姓名"
              v-model="pay_realname_backUp"
            >
              <template #label>
                <div class="left text-[#787f8c] w-[200px] mr-[35px]">
                  <span
                    class="text-[red]"
                    v-show="!BuyOrderDetail.pay_realname"
                  >
                    *
                  </span>
                  付款人姓名:
                </div>
              </template>
            </van-field>
          </div>
          <div class="h-[50px] leading-[50px] my-[20px]">
            <!-- v-Replaceinput -->
            <van-field
              :input-align="[7, 6, 8].includes(BuyOrderDetail.status) ? 'right' : 'left'"
              :readonly="[7, 6, 8].includes(BuyOrderDetail.status)"
              class="!text-[25px] !p-[0] order_input_pl"
              :class="{
                unboder: [7, 6, 8].includes(BuyOrderDetail.status) ? 'unboder' : '',
                SZRMB: BuyOrderDetail.coin_protocol == 'SZRMB' ? 'SZRMB' : ''
              }"
              id="valueInput"
              :maxlength="
                BuyOrderDetail.coin_protocol == 'BANK' || BuyOrderDetail.coin_protocol == 'SZRMB'
                  ? 4
                  : 20
              "
              :placeholder="
                BuyOrderDetail.coin_protocol == 'SZRMB'
                  ? '请输入数字人民币编码后4位'
                  : BuyOrderDetail.coin_protocol == 'BANK'
                  ? '请输入付款卡号后4位'
                  : BuyOrderDetail.coin_protocol == 'ALIPAY'
                  ? '请输入支付宝账号'
                  : BuyOrderDetail.coin_protocol == 'WXPAY'
                  ? '请输入微信账号'
                  : '请输入地址'
              "
              v-model="pay_cardid"
              @update:model-value="() => (pay_cardidUpdate = true)"
              :type="
                BuyOrderDetail.coin_protocol == 'BANK' || BuyOrderDetail.coin_protocol == 'SZRMB'
                  ? ('digit' as FieldType)
                  : ('' as FieldType)
              "
            >
              <template #label>
                <div class="text-[#787f8c]">
                  <span
                    v-if="![7, 6, 8].includes(BuyOrderDetail.status)"
                    class="text-[red]"
                  >
                    *
                  </span>
                  {{
                    BuyOrderDetail.coin_protocol == 'SZRMB'
                      ? '数字人民币编码后4位:'
                      : BuyOrderDetail.coin_protocol == 'BANK'
                      ? '付款卡号后4位:'
                      : BuyOrderDetail.coin_protocol == 'ALIPAY'
                      ? '支付宝账号:'
                      : BuyOrderDetail.coin_protocol == 'WXPAY'
                      ? '微信账号:'
                      : '地址'
                  }}
                </div>
              </template>
            </van-field>
          </div>
          <div
            class="h-[50px] leading-[50px] my-[20px]"
            v-if="BuyOrderDetail.coin_protocol == 'BANK'"
          >
            <van-field
              :input-align="[7, 6, 8].includes(BuyOrderDetail.status) ? 'right' : 'left'"
              :readonly="[7, 6, 8].includes(BuyOrderDetail.status)"
              class="!text-[25px] !p-[0] order_input_pl"
              :class="[7, 6, 8].includes(BuyOrderDetail.status) ? 'unboder' : ''"
              placeholder="请输入银行名称"
              v-model="pay_bankname"
            >
              <template #label>
                <div class="left text-[#787f8c]">
                  <span
                    v-if="![7, 6, 8].includes(BuyOrderDetail.status)"
                    class="text-[red]"
                  >
                    *
                  </span>
                  付款银行名称：
                </div>
              </template>
            </van-field>
          </div>
          <p
            v-if="
              BuyOrderDetail.coin_protocol == 'BANK' && ![7, 6, 8].includes(BuyOrderDetail.status)
            "
            class="mt-[30px] text-center"
          >
            注：银行名称必须包含银行、邮政、信用社的其中一个
          </p>
        </div>

        <!-- 评分  -->
        <div
          v-if="
            !onlineCharge && [8].includes(BuyOrderDetail.status) && processActive == 3 && !SellOrder
          "
          class="integral flex justify-between items-center !mt-[20px]"
        >
          <div class="left flex items-center">
            <div class="OuserName van-ellipsis !w-[150px] !text-[24px] !text-[#aaa]">
              对{{ seller ? '买' : '卖' }}家评分
            </div>
          </div>
          <div
            class="left flex_sz height100 rating-container"
            :class="{ 'is-edit-rating': isEditRating }"
          >
            <van-rate
              v-model="integral"
              :disabled="
                !(
                  (seller && !!!BuyOrderDetail.seller_star) ||
                  (!seller && !!!BuyOrderDetail.buyer_star)
                )
              "
              :readonly="!isEditRating"
              :size="16"
              color="#ffd21e"
            />
            <i
              v-if="
                !isEditRating &&
                ((seller && !!!BuyOrderDetail.seller_star) ||
                  (!seller && !!!BuyOrderDetail.buyer_star))
              "
              class="edit-02"
              @click="onRating"
            ></i>
          </div>
          <div
            v-if="
              (seller && !!!BuyOrderDetail.seller_star) || (!seller && !!!BuyOrderDetail.buyer_star)
            "
            v-show="!isEditRating"
            class="rating-sign-container"
          >
            <img :src="unrated" />
          </div>
          <div
            v-else
            v-show="!isEditRating"
            class="rating-sign-container"
          >
            <img :src="rated" />
          </div>
          <div
            v-show="isEditRating"
            class="rating-btn-containers flex justify-between items-center"
          >
            <div
              class="item-btn btn-confirm"
              @click="confirmDeal(), (isEditRating = false)"
            >
              确认
            </div>
            <div
              class="item-btn btn-cancel"
              @click="onCancelRating"
            >
              取消
            </div>
          </div>
        </div>

        <!-- 卖单时 付款方式 -->
        <div
          class="paymate clearfix"
          v-if="SellOrder"
        >
          <div class="left">付款方式</div>
          <div class="right">
            <van-image
              v-if="payMateActive.includes('BANK')"
              class="payImg"
              lazy-load
              :src="requireImg('common/credit.png')"
            />
            <van-image
              v-if="payMateActive.includes('ALIPAY')"
              class="payImg"
              lazy-load
              :src="requireImg('common/ALIPAY.png')"
            />
            <van-image
              v-if="payMateActive.includes('WXPAY')"
              class="payImg"
              lazy-load
              :src="requireImg('common/WeChatPay.png')"
            />
            <van-image
              v-if="payMateActive.includes('SZRMB')"
              class="payImg"
              lazy-load
              :src="requireImg('common/SZRMB.png')"
            />
          </div>
        </div>

        <van-button
          color="var(--van-button-primary-background)"
          type="primary"
          class="orderOperation"
          v-if="SellOrder"
          @click="router.push('/')"
        >
          确认
        </van-button>
      </div>

      <!-- 按钮 -->
      <div
        class="orderButton flex_z pb-[20px]"
        :class="
          processActive == 2 ||
          processActive == 1 ||
          (processActive == 1 && !seller && confirm) ||
          processActive == 3 ||
          processActive == 4
            ? [7].includes(BuyOrderDetail.status)
              ? 'appeal_up processActive'
              : 'appeal_up processActive'
            : ''
        "
      >
        <div
          class=""
          v-if="SellOrder && [1].includes(BuyOrderDetail.status)"
        ></div>
        <!-- <van-button type="primary" class="orderOperation" v-if="SellOrder && [1].includes(BuyOrderDetail.status)"
          @click="goSellCancel">
          取消挂单
        </van-button> -->

        <van-button
          type="primary"
          class="orderOperation"
          @click="dialog.order_cancel_show = true"
          v-else-if="
            ![2, 4, 5, 8, 9, 10].includes(BuyOrderDetail.status) &&
            (!seller ||
              (seller && !confirm) ||
              (processActive == 2 && !seller) ||
              (processActive == 3 && !seller))
          "
        >
          取消订单
        </van-button>
        <van-button
          type="primary"
          v-if="processActive == 1 && !seller && confirm"
          class="orderOperation"
        >
          去付款
        </van-button>
        <van-button
          type="primary"
          v-if="!SellOrder && [1].includes(BuyOrderDetail.status) && seller && !confirm"
          class="orderOperation"
          @click="SellerCheckBuyStatus({ buy_order_id: BuyOrderDetail.order_id, status: 1 })"
        >
          确认交易
        </van-button>
        <van-button
          type="primary"
          v-if="![2, 4, 5, 9, 10].includes(BuyOrderDetail.status) && processActive == 2 && !seller"
          class="orderOperation"
          @click="
            ;+is_upbuyimg_qztj && (!!!fileList[0] || !!!fileList[0].UploadURL)
              ? showToast(
                  '必须上传付款凭证才能点击【我已付款】，请务必确保您的转账已经成功，再通知卖家'
                )
              : verify_input(pay_cardid, pay_realname_backUp, pay_bankname) &&
                BuyerUpdateTransInfo({
                  buy_order_id: BuyOrderDetail.order_id,
                  buy_img: (fileList[0] && fileList[0].UploadURL) || '',
                  pay_cardid: ['BANK', 'SZRMB'].includes(BuyOrderDetail.coin_protocol)
                    ? pay_cardidUpdate
                      ? pay_cardid
                      : BuyOrderDetail.pay_cardid
                      ? BuyOrderDetail.pay_cardid
                      : pay_cardid
                    : pay_cardid,
                  pay_realname: pay_realname_backUp,
                  pay_bankname: pay_bankname
                }).then(() => {
                  ;(payimg = false), (fileList = []), getBuyOrderDetail(BuyOrderDetail.order_id)
                })
          "
        >
          我已付款，通知卖家
        </van-button>
        <van-button
          type="primary"
          v-if="
            !SellOrder &&
            processActive == 3 &&
            seller &&
            ![7, 8, 9, 10].includes(BuyOrderDetail.status)
          "
          class="orderOperation fangxin"
          @click="
            authStore.userInfo.is_set_paypassword
              ? (dialog.show = true)
              : showToast('请先设置好支付密码')
          "
        >
          放行
        </van-button>

        <van-button
          type="primary"
          v-if="!SellOrder && processActive == 3 && seller && [7].includes(BuyOrderDetail.status)"
          class="orderOperation"
          @click="
            authStore.userInfo.is_set_paypassword
              ? (dialog.show = true)
              : showToast('请先设置好支付密码')
          "
        >
          放行
        </van-button>
        <van-button
          type="primary"
          v-if="!SellOrder && processActive == 3 && [7].includes(BuyOrderDetail.status)"
          class="orderOperation"
          @click="showAppeal = true"
        >
          交易申诉
        </van-button>
      </div>
      <p
        class="red_f text-[26px] mb-[20px]"
        v-if="[3].includes(BuyOrderDetail.status) && !seller"
      >
        必须上传付款凭证才能点击【我已付款】，请务必确保您的转账已经成功，再通知卖家
        <br />
        <br />
      </p>
      <!-- 交易申诉 -->
      <div
        class="appeal_c"
        v-if="
          viewCoinsellcommentlist.length &&
          !SellOrder &&
          processActive == 3 &&
          [7, 9, 10].includes(BuyOrderDetail.status)
        "
      >
        <div class="appealTitle">交易申诉</div>
        <!-- <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> -->
        <div
          class="commen"
          v-for="item in viewCoinsellcommentlist"
          :key="item.uuid"
        >
          <div class="topPic clearfix">
            <div class="left">
              <van-image
                v-if="!onlineCharge"
                lazy-load
                class="Oavatar"
                fit="cover"
                :src="imgserver_url + item.face"
              />
              <span
                v-if="!onlineCharge"
                class="OuserName inline-block van-ellipsis !max-w-[200px]"
              >
                {{ item.nickname }}
              </span>
              <!-- 1买家 2卖家 3客服 4系统 -->
              <span
                class="judeg"
                :class="
                  item.user_type == 1
                    ? 'buyer_blue'
                    : item.user_type == 3
                    ? 'f_kefu'
                    : item.user_type == 4
                    ? 'f_kefu'
                    : ''
                "
              >
                {{
                  item.user_type == 1
                    ? '买家'
                    : item.user_type == 2
                    ? '卖家'
                    : item.user_type == 3
                    ? '客服'
                    : item.user_type == 4
                    ? '系统'
                    : '买家'
                }}
              </span>
            </div>
            <div class="right">
              <span>{{ item.addtime }}</span>
            </div>
          </div>
          <div class="rwop">
            <span class="text_c">{{ item.msg }}</span>
          </div>

          <van-image
            lazy-load
            class="pic_commen"
            v-if="item.img"
            fit="cover"
            @click="showImagePreview([imgserver_url + item.img])"
            :src="imgserver_url + item.img"
          />
        </div>
        <!-- </van-list> -->
      </div>
    </div>
    <van-dialog
      v-model:show="showKeyboard"
      class="confirm-dialog !top-[508px]"
      title="请输入支付密码"
      theme="round-button"
      :show-confirm-button="false"
    >
      <i
        class="icon-close block close-dark"
        @click="showKeyboard = false"
      ></i>

      <div class="confirm-dialog__content">
        <!-- <h4>
          {{ confirmAmount }}
          <span>{{ moveBrick ? 'CNY' : coin_name }}</span>
        </h4> -->
        <!-- <van-divider /> -->
        <form
          class="confirm-dialog__form"
          @submit.prevent="onSubmit"
        >
          <div class="confirm-dialog__form-item">
            <label>支付密码</label>
            <!-- clickable readonly-->
            <!-- type="number"  -->
            <van-field
              style="-webkit-text-security: disc"
              type="number"
              ref="input_p"
              v-model="passwdValue"
              :focused="showKeyboard"
              @focus="showKeyboard = true"
              @touchstart.stop="showKeyboard = true"
              showKeyboard="true"
              :maxlength="6"
            />
          </div>
          <van-button
            type="primary"
            native-type="submit"
            block
            class="confirm-dialog__form-btn"
          >
            提交
          </van-button>
        </form>
      </div>
    </van-dialog>
    <!-- 申诉 -->
    <van-dialog
      v-model:show="showAppeal"
      title=""
      class="showAppeal"
      :showConfirmButton="false"
    >
      <div class="O_title">申诉描述</div>
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        class="O_textarea"
        maxlength="200"
        placeholder="不超过200字"
      />
      <div class="titleUp">上传图片</div>
      <van-uploader
        v-model="fileList"
        :after-read="afterRead"
        :before-read="beforeRead"
        :max-count="1"
        :max-size="10 * 1000 * 1024"
        @oversize="onOversize"
        class="O_uploader"
      />
      <div class="flex_z">
        <van-button
          type="primary"
          color="#828282"
          class="margr20"
          @click="showAppeal = false"
        >
          取消
        </van-button>
        <van-button
          type="primary"
          color="var(--van-button-primary-background)"
          class="marg0"
          @click="confirmAppeal"
        >
          提交
        </van-button>
      </div>
      <p class="appeal">
        请勿发送与交易无关的内容，如有发现有广告，淫秽等内容，会进行封号处理，后果自负。
      </p>
    </van-dialog>

    <!-- 申诉确认弹窗 -->
    <van-dialog
      v-model:show="dialog.show"
      theme="round-button"
      className="dialog-global-info"
      :title="dialog.data.title"
    >
      <i
        class="icon-close block close-dark"
        @click="dialog.show = false"
      ></i>
      <div>
        <!-- <div class="title">{{ dialog.data.title }}</div> -->
        <div class="content red_f">{{ dialog.data.content }}</div>
        <div class="content red_f">任何未到帐要求您放行的都属于欺诈行为</div>
      </div>

      <template #footer>
        <div class="flex_z">
          <div
            class="btn-confirm flex items-center justify-center"
            @click="onConfirm"
          >
            {{ dialog.data.confirmButtonText }}
          </div>
          <div
            class="btn-confirm backcc flex items-center justify-center"
            @click="dialog.show = false"
          >
            未到账
          </div>
        </div>
      </template>
    </van-dialog>
    <!-- 取消订单弹窗 -->
    <van-dialog
      v-model:show="dialog.order_cancel_show"
      theme="round-button"
      className="dialog-global-info order_cancel_show"
    >
      <i
        class="icon-close block close-dark"
        @click="dialog.order_cancel_show = false"
      ></i>
      <div>
        <div class="content1">是否取消订单</div>
      </div>
      <template #footer>
        <div class="flex_z">
          <div
            class="btn-confirm flex items-center justify-center"
            @click="onCancelOrderConfirm"
          >
            是
          </div>
          <div
            class="btn-confirm backcc flex items-center justify-center"
            @click="dialog.order_cancel_show = false"
          >
            否
          </div>
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  BuyCancel,
  BuyerUpdateTransInfo,
  Reminders,
  SellCancel,
  SellOrderDetail,
  SellerCheckBuyStatus,
  SetStar,
  BuyOrderDetail as apiBuyOrderDetail,
  coinsellcommentadd,
  coinsellcommentlist,
  sellerCheckTransStatus
} from '@/apis/buySellCoin'
// import kps from './components/KPS.vue'
import { uploadImgApi } from '@/apis/common'
import verified from '@/assets/images/common/verified.png'
import { useEntryStore } from '@/store/modules/entry'
import { resBuyOrderDetail } from '@/store/types/buySellCoin'
import { mergeHrefParams, requireImg, secondsToMinutesWithSeconds } from '@/utils/tools'
import clipboard3 from 'vue-clipboard3'
import { useRoute, useRouter } from 'vue-router'

import info from '@/assets/images/common/info.png'
import rated from '@/assets/images/common/rated.png'
import success from '@/assets/images/common/success.png'
import unrated from '@/assets/images/common/unrated.png'
import { useAppBar } from '@/components/AppBar/useAppBar'
import { useAuthStore } from '@/store/modules/auth'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
import mitt from '@/utils/mitt'
import { storeToRefs } from 'pinia'
import { FieldType, showImagePreview, showToast } from 'vant'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
const router = useRouter()
const route = useRoute()
const { fullPath } = route
const wideOrderCreatePath = fullPath.replace('orderCreate', 'wideOrderCreate')
// console.log('orderCreate', wideOrderCreatePath)
const search = new URLSearchParams(mergeHrefParams())
const hs = search.get('hs') || ''
const wideMode = hs == 'h'
if (wideMode) {
  router.replace(wideOrderCreatePath)
}
useAppBar({ mode: 'light' })
const coin_name = sessionStorage.getItem('coin_name')
const dialog = reactive({
  order_cancel_show: false,
  show: false,
  data: {
    title: '温馨提示',
    content: `请你再次确认是否已经收到款项， `,
    confirmButtonText: '确认到账',
    confirmAction: () => {}
  }
})

// const vReplaceinput = {
//   mounted: (el: { querySelector: (arg0: string) => any }) => {
//     const input = el.querySelector('#valueInput')
//     input.onkeyup = function (e: any) {
//       input.value = input.value.replace(/[^A-Za-z0-9@]/g, '')
//     }
//     input.onblur = function (e: any) {
//       input.value = input.value.replace(/[^A-Za-z0-9@]/g, '')
//     }
//   }
// }

const EntryStore = useEntryStore()
const pay_cardidUpdate = ref(false)
const { config } = storeToRefs(EntryStore)
const imgserver_url = computed(() => {
  // console.log('(imgserver_url',(config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v);
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v || ''
})
const is_upbuyimg_qztj = computed(() => {
  // console.log('(imgserver_url',(config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v);
  return +(config.value.Web_Set_WebReg?.is_upbuyimg_qztj as any)?.v || ''
})
const vDoubleclick = {
  mounted(el: any, binding: any) {
    let timeout: string | number | NodeJS.Timeout | undefined
    let clicks = 0

    el.addEventListener('click', function () {
      clicks++
      // console.log('clicks', clicks)
      if (clicks === 1) {
        timeout = setTimeout(() => {
          clicks = 0
        }, 300) // 设置延时
      } else {
        clearTimeout(timeout)
        clicks = 0
        binding.value()
      }
    })
  }
}
const vThreeclick = {
  mounted(el: any, binding: any) {
    let timeout: string | number | NodeJS.Timeout | undefined
    let clicks = 0

    el.addEventListener('click', function () {
      clicks++
      // console.log('clicks3', clicks)
      timeout = setTimeout(() => {
        clicks = 0
      }, 700) // 设置延时
      if (clicks === 3) {
        clearTimeout(timeout)
        clicks = 0
        binding.value()
      }
    })
  }
}

const goOpen = (coin_protocol: string, collection_realname: any, pay_cardid: any) => {
  if (coin_protocol == 'BANK') {
    window.open(
      'https://ds.alipay.com/?from=pc&appId=09999988&actionType=toCard&sourceId=bill&cardNo=' +
        pay_cardid +
        '&bankAccount=' +
        collection_realname
    )
  } else if (coin_protocol == 'WXPAY') {
    window.open('weixin://')
  } else {
    // window.open('alipays://platformapi/startapp?appId=10000007&qrcode=')
    // window.open(
    //   'https://ds.alipay.com/?appId=0999988&actionType=toAccount&goBack=NO&amount=1.00&userId=1162212711@qq.com&memo='
    // )
    // window.open('alipayqr://platformapi/startapp?saId=20000116')
    window.open('alipays://')
    // window.open(
    //   'https://ds.alipay.com/?from=pc&appId=09999988&actionType=toCard&sourceId=bill&cardNo=' +
    //     pay_cardid +
    //     '&bankAccount=' +
    //     collection_realname
    // )
  }
}
const showInfoToast = (title: string) => {
  return showToast({
    message: title,
    icon: info
  })
}
const verify_input = (pay_cardid: any, pay_realname: any, pay_bankname: string) => {
  if (!onlineCharge.value) {
    return true
  }
  if (!!!pay_realname) {
    showInfoToast('请输入姓名')
    return false
  }
  if (!!!pay_cardid) {
    BuyOrderDetail.value.coin_protocol == 'SZRMB'
      ? showInfoToast('请输入数字人民币编码后4位')
      : BuyOrderDetail.value.coin_protocol == 'BANK'
      ? showInfoToast('请输入付款卡号后4位')
      : BuyOrderDetail.value.coin_protocol == 'ALIPAY'
      ? showInfoToast('请输入支付宝账号')
      : BuyOrderDetail.value.coin_protocol == 'WXPAY'
      ? showInfoToast('请输入微信账号')
      : showInfoToast('请输入地址')
    return false
  }
  if (pay_cardid && ['BANK', 'SZRMB'].includes(BuyOrderDetail.value.coin_protocol)) {
    if (pay_cardid.length < 4) {
      BuyOrderDetail.value.coin_protocol == 'SZRMB'
        ? showInfoToast('数字人民币编码后4位未满足')
        : BuyOrderDetail.value.coin_protocol == 'BANK'
        ? showInfoToast('付款卡号后4位未满足')
        : ''
      return false
    }
  }
  if (BuyOrderDetail.value.coin_protocol == 'BANK') {
    if (!!!pay_bankname) {
      showInfoToast('请输入银行名称')
      return false
    } else {
      if (
        !(
          pay_bankname.endsWith('银行') ||
          pay_bankname.endsWith('农信') ||
          pay_bankname.endsWith('信用社')
        )
      ) {
        showInfoToast('请以银行/信用社/农信结尾')
        return false
      }
    }
  }
  sessionStorage.setItem('pay_cardid', pay_cardid)
  sessionStorage.setItem('pay_bankname', pay_bankname)
  return true
}
const dblclickHandle = () => {
  config.value.Web_Set_WebReg.is_upbuyimg_qztj = { v: '0' }
}
const ThreeclickHandle = () => {
  // console.log('112')
  // BuyerUpdateTransInfo({
  //   buy_order_id: BuyOrderDetail.value.order_id,
  //   buy_img: (fileList.value[0] && fileList.value[0].UploadURL) || ''
  // }).then(() => {
  //   ;(payimg.value = false), (fileList.value = []), getBuyOrderDetail(BuyOrderDetail.value.order_id)
  // })
}
const str_f = ref('')
const tixin = ref(0)
watch(tixin, newVal => {
  setTimeout(() => {
    if (newVal > 0) {
      tixin.value -= 1
    }
  }, 1000)
})

const { toClipboard } = clipboard3()
const copy = async (text: any) => {
  try {
    await toClipboard(text)
    showToast({
      message: '复制成功',
      icon: verified
    })
  } catch (error) {
    showToast({
      message: '复制失败!!',
      icon: verified
    })
  }
}
const authStore = useAuthStore()
const coin = useCoinBuySellStore()
const { getUserInfo } = authStore
const { token, userInfo } = storeToRefs(authStore)

const processActive = ref(1)
// 初始默认评分
const INIT_STAR_INTEGRAL = 3
const confirm = ref(1) //卖家是否确认开始交易
const integral = ref(INIT_STAR_INTEGRAL) //几颗星

let BuyOrderDetail = ref({} as resBuyOrderDetail)
const { query } = route
let showPopover = ref(false)
let SellOrder = ref()
let SellOrderNum = ref('')
let SellOrderAmount = ref('')
let SellOrderIs_split = ref()

const getSellOrderDetail = () => {
  SellOrderDetail({ order_id: query.order_id as string }).then(data => {
    if (!data.order_id) return console.log('Selldata数据异常')
    BuyOrderDetail.value = data
    setseller()
    if (data.buy_orders[0]?.order_id) {
      // console.log('data.buy_orders?.order_id', data.buy_orders[0].order_id);
      return getBuyOrderDetail(data.buy_orders[0].order_id)
    }
  })
}

const getBuyOrderDetail = (order_id: string) => {
  // console.log('query.order_id', order_id, query.order_id);
  SellOrder.value = false
  // setTimeout(() => {
  apiBuyOrderDetail({ order_id: order_id || (query.order_id as string) }).then(data => {
    if (!data.order_id) return console.log('数据异常')
    // console.log('apiBuyOrderDetail-------------', data.order_id)
    BuyOrderDetail.value = data

    SellOrderNum.value = data.sell_info.order_id
    moveBrick.value = data.sell_mtype == 30 ? 1 : 0
    SellOrderAmount.value = (+data.sell_info.sell_num).toTruncFixed(2)
    SellOrderIs_split.value = data.sell_info.is_split
    setseller()
  })
  // }, 400)
}

const t_pic = ref('')
const pay_pic = ref('')

const payMateActive = ref('')
const moveBrick = ref(0)
const onlineCharge = ref(0)
// console.log('route', query.order_id);
const operation_verification = sessionStorage.getItem('operation_verification')

setTimeout(() => {
  SellOrder.value = query.sell == 'true' ? true : false
  query && SellOrder.value ? getSellOrderDetail() : getBuyOrderDetail(query.order_id as string)

  payMateActive.value = (query.payMateActive as string) || ''
  moveBrick.value = +(query.moveBrick as string) || 0
  onlineCharge.value = !!operation_verification ? 1 : +(query.onlineCharge as string) == 1 ? 1 : 0

  // console.log('payMateActive.value',payMateActive.value);

  let sellsumData = (query.sellsumData && JSON.parse(query.sellsumData as string)) || {}
  // console.log('sellsumData',sellsumData);
  SellOrderNum.value = sellsumData.order_id
  SellOrderAmount.value = sellsumData.sell_num
  SellOrderIs_split.value = sellsumData.is_split
}, 10)

const viewCoinsellcommentlist = ref<any>([])

const onConfirm = () => {
  dialog.show = false
  showKeyboard.value = true
}
const onCancelOrderConfirm = () => {
  dialog.order_cancel_show = false
  seller.value
    ? SellerCheckBuyStatus({ buy_order_id: BuyOrderDetail.value.order_id, status: 2 }).then(() => {
        getBuyOrderDetail(BuyOrderDetail.value.order_id)
      })
    : BuyCancel({ buy_order_id: BuyOrderDetail.value.order_id }).then(() => {
        getBuyOrderDetail(BuyOrderDetail.value.order_id)
      })
}
const seller = ref(0)
const pay_cardid = ref(sessionStorage.getItem('pay_cardid') || '')
const pay_realname = ref('')
const pay_realname_backUp = ref('')
const pay_bankname = ref(sessionStorage.getItem('pay_bankname') || '')
const setseller = async () => {
  //判断是否是卖家
  if (userInfo.value.uuid) {
    let v = BuyOrderDetail.value.uuid == userInfo.value.uuid ? 0 : 1
    integral.value = v
      ? !!!BuyOrderDetail.value.seller_star
        ? 3
        : BuyOrderDetail.value.seller_star
      : !!!BuyOrderDetail.value.buyer_star
      ? 3
      : BuyOrderDetail.value.buyer_star

    if (v) {
      if (BuyOrderDetail.value.headimg)
        t_pic.value = imgserver_url.value + BuyOrderDetail.value.headimg
    } else {
      if (BuyOrderDetail.value.sell_info?.headimg)
        t_pic.value = imgserver_url.value + BuyOrderDetail.value.sell_info?.headimg
    }
    if (BuyOrderDetail.value.sell_info?.collection_cardimg)
      pay_pic.value = imgserver_url.value + BuyOrderDetail.value.sell_info.collection_cardimg

    if (!!!pay_cardid.value)
      pay_cardid.value = v
        ? BuyOrderDetail.value.sell_info?.collection_cardid
        : ['BANK', 'SZRMB'].includes(BuyOrderDetail.value.coin_protocol)
        ? BuyOrderDetail.value.pay_cardid.slice(
            BuyOrderDetail.value.pay_cardid.length - 4 >= 0
              ? BuyOrderDetail.value.pay_cardid.length - 4
              : 0,
            BuyOrderDetail.value.pay_cardid.length
          )
        : BuyOrderDetail.value.pay_cardid
    if (!!!pay_realname.value)
      pay_realname.value = v
        ? BuyOrderDetail.value.sell_info?.collection_realname
        : BuyOrderDetail.value.pay_realname
    pay_realname_backUp.value = pay_realname.value
    if (!!!pay_bankname.value)
      pay_bankname.value = v
        ? BuyOrderDetail.value.sell_info?.collection_bankname
        : BuyOrderDetail.value.pay_bankname
    if (!!!pay_bankname.value)
      pay_bankname.value =
        BuyOrderDetail.value.coin_protocol == 'SZRMB'
          ? '数字人民币'
          : BuyOrderDetail.value.coin_protocol == 'ALIPAY'
          ? '支付宝'
          : BuyOrderDetail.value.coin_protocol == 'WXPAY'
          ? '微信'
          : ''
    // console.log('pay_bankname.value1', pay_bankname.value)
    // console.log('pay_cardid.value', pay_cardid.value)

    seller.value = v
  } else {
    await getUserInfo()
    let v = BuyOrderDetail.value.uuid == userInfo.value.uuid ? 0 : 1
    // console.log('userInfouuid', userInfo.value.uuid);
    integral.value = v
      ? !!!BuyOrderDetail.value.seller_star
        ? 3
        : BuyOrderDetail.value.seller_star
      : !!!BuyOrderDetail.value.buyer_star
      ? 3
      : BuyOrderDetail.value.buyer_star
    if (v) {
      if (BuyOrderDetail.value.headimg)
        t_pic.value = imgserver_url.value + BuyOrderDetail.value.headimg
    } else {
      if (BuyOrderDetail.value.sell_info?.headimg)
        t_pic.value = imgserver_url.value + BuyOrderDetail.value.sell_info?.headimg
    }
    if (BuyOrderDetail.value.sell_info?.collection_cardimg)
      pay_pic.value = imgserver_url.value + BuyOrderDetail.value.sell_info.collection_cardimg
    if (!!!pay_cardid.value)
      pay_cardid.value = v
        ? BuyOrderDetail.value.sell_info?.collection_cardid
        : ['BANK', 'SZRMB'].includes(BuyOrderDetail.value.coin_protocol)
        ? BuyOrderDetail.value.pay_cardid.slice(
            BuyOrderDetail.value.pay_cardid.length - 4 >= 0
              ? BuyOrderDetail.value.pay_cardid.length - 4
              : 0,
            BuyOrderDetail.value.pay_cardid.length
          )
        : BuyOrderDetail.value.pay_cardid
    if (!!!pay_realname.value)
      pay_realname.value = v
        ? BuyOrderDetail.value.sell_info?.collection_realname
        : BuyOrderDetail.value.pay_realname
    pay_realname_backUp.value = pay_realname.value

    if (!!!pay_bankname.value)
      pay_bankname.value = v
        ? BuyOrderDetail.value.sell_info?.collection_bankname
        : BuyOrderDetail.value.pay_bankname
    seller.value = v
  }
}
setseller()
const buy_img = ref<any>([])
let settime = ref<any>(null)
watch(
  BuyOrderDetail,
  newVal => {
    processActive.value = [8].includes(BuyOrderDetail.value.status)
      ? 3
      : [1, 2].includes(BuyOrderDetail.value.status)
      ? 1
      : [3, 4, 5].includes(BuyOrderDetail.value.status)
      ? 2
      : 3
    confirm.value = BuyOrderDetail.value.status > 2 ? 1 : 0

    // console.log('settime.value', settime.value)
    if (BuyOrderDetail.value.status == 1 && !seller.value && !!!settime.value) {
      // console.log('1112255')
      let t = (Math.random() * 2 + 8) * 1000
      settime.value = setTimeout(() => {
        settime.value = null
        getBuyOrderDetail(query.order_id as string)
      }, t)
    }

    if (newVal.buy_img) buy_img.value = [{ url: imgserver_url.value + newVal.buy_img }]
    setTimeout(() => {
      if (newVal.time_second > 0) {
        newVal.time_second -= 1
        newVal.time_second == 0 &&
          (query.order_id as string).includes('B') &&
          getBuyOrderDetail(query.order_id as string)
        // newVal.time_second==0&&getBuyOrderDetail(false);
      }
    }, 1000)
    if ([7, 8, 9, 10].includes(newVal.status) && SellOrder.value == false) {
      get_coinsellcommentlist(newVal.order_id)
    }
  },
  {
    deep: true
    // immediate:true
  }
)

const isEditRating = ref(false)
const onRating = () => {
  isEditRating.value = true
}
const onCancelRating = () => {
  integral.value = INIT_STAR_INTEGRAL
  isEditRating.value = false
}

onMounted(() => {
  mitt.on('update_buy_f', (data: any) => {
    console.log('推送买币订单状态 data2', route.path, query.order_id)
    setTimeout(() => {
      route.path == '/orderCreate' &&
        (query.order_id as string).includes('B') &&
        getBuyOrderDetail(BuyOrderDetail.value.order_id)
    }, 300)
  })
  mitt.on('update_sell_f', (data: any) => {
    console.log('推送卖币订单状态 data2', data)
    setTimeout(() => {
      SellOrder.value
        ? !(query.order_id as string).includes('B')
          ? getSellOrderDetail()
          : getBuyOrderDetail(BuyOrderDetail.value.order_id)
        : getBuyOrderDetail(BuyOrderDetail.value.order_id)
    }, 200)
  })

  mitt.emit('number-keyboard-show')
})

onUnmounted(() => {
  mitt.off('update_buy_f')
  mitt.off('update_sell_f')
  // mitt.off('push_reminders_buy')
  // mitt.off('push_reminders_sell')
})

const goSellCancel = () => {
  SellCancel({ sell_order_id: query.order_id as string })
}

const passwdValue = ref('')
const showKeyboard = ref(false)
const errorInfo = ref('')

watch(passwdValue, async newVal => {
  if (newVal.length == 6) {
    // console.log('passwdValue.value', passwdValue.value);
    onSubmit()
  } else {
    errorInfo.value = ''
  }
})

const onSubmit = async () => {
  await sellerCheckTransStatus({
    buy_order_id: BuyOrderDetail.value.order_id,
    passwd: passwdValue.value
  })
    .then(order_id => {
      console.log('data', order_id.buy_order)
      passwdValue.value = ''
      if (!!!order_id.buy_order) return
      showKeyboard.value = false
      // processActive.value = 4;
    })
    .catch(err => {
      passwdValue.value = ''
      errorInfo.value = '密码错误'
      console.log('err错误', err)
    })
}

const showAppeal = ref(false)
const message = ref('')

const fileList = ref<any[]>([])
const beforeRead = (file: any) => {
  // console.log('file.type', file.type);
  if (!file.type.startsWith('image/')) {
    showToast('请上传 jpg 格式图片')
    return false
  }
  return true
}
const onOversize = (file: any) => {
  console.log(file)
  showToast('文件大小不能超过 10m')
}

const afterRead = async (event: any) => {
  fileList.value[0].status = 'uploading'
  fileList.value[0].message = '上传中...'
  // console.log('event',event);
  if (!event.file) return
  const res = await uploadImg(event.file)
  // console.log('res',res);
  fileList.value = []
  if (!!!res.img) {
    return showToast('上传失败，请稍后重试')
  }
  let obj = {
    status: 'uploading',
    message: '上传中...',
    UploadURL: res.img,
    url: imgserver_url.value + res.img
  }
  fileList.value[0] = obj
  // fileList.value.length > 0
  //   ? (fileList.value[fileList.value.length - 1] = obj)
  //   : (fileList.value[0] = obj)

  setTimeout(() => {
    fileList.value[fileList.value.length - 1].status = 'done'
    fileList.value[fileList.value.length - 1].message = '上传成功'
  }, 500)
  console.log('fileList.value', fileList.value)
}
const payimg = ref(false)
const uploadImg = async (file: string): Promise<any> => {
  try {
    const res = await uploadImgApi({
      file,
      type: payimg.value ? 'payimg' : 'appeal'
    })

    return res
  } catch (e) {
    console.log(e)
  }
}

const get_coinsellcommentlist = (order_id: string) => {
  coinsellcommentlist({ orderid: order_id, ctype: '1' }).then(data => {
    console.log('data', data)
    if (data instanceof Array && data.length == 0 && (data as any).code != 0)
      return showToast('申诉列表获取异常')
    viewCoinsellcommentlist.value = data
  })
}

const confirmAppeal = () => {
  // let appealParm = {
  //   buy_order_id: BuyOrderDetail.value.order_id, //	是	string	订单号
  //   comment: message.value, //	是	string	申诉内容
  //   img: fileList.value //	是	array	图片
  // }
  if (!!!message.value) return showToast('申诉内容不能为空')
  // console.log('appealParm', appealParm);

  // Appeal(appealParm).then((data) => {
  //   // console.log('data', data);
  //   if (data instanceof Array && data.length == 0 && (data as any).code != 0) return;
  //   showToast('提交成功！');
  //   showAppeal.value = false;
  // })

  coinsellcommentadd({
    orderid: BuyOrderDetail.value.order_id,
    ctype: '1',
    msg: message.value,
    img: fileList.value[0]?.UploadURL || ''
  }).then(data => {
    if (data instanceof Array && data.length == 0 && (data as any).code != 0)
      return showToast('上传申诉失败！')
    showToast({ message: '成功！', icon: success })
    showAppeal.value = false
    message.value = ''
    fileList.value = []
    get_coinsellcommentlist(BuyOrderDetail.value.order_id)
  })
}
mitt.on('update_appeal_f', () => {
  get_coinsellcommentlist(BuyOrderDetail.value.order_id)
})
const confirmDeal = () => {
  if (integral.value <= 0) return showToast('请选择评分数量！！')
  if (
    !(
      (seller.value && !!!BuyOrderDetail.value.seller_star) ||
      (!seller.value && !!!BuyOrderDetail.value.buyer_star)
    )
  )
    return (processActive.value = 3)
  SetStar({ buy_order_id: BuyOrderDetail.value.order_id, star: Number(integral.value) }).then(
    (data: any) => {
      console.log('data', (data as any).code)
      if (data instanceof Array && data.length == 0 && (data as any).code != 0) return
      showToast({
        message: '评分成功',
        icon: verified,
        iconSize: '48px'
      })
      setTimeout(() => {
        getBuyOrderDetail(BuyOrderDetail.value.order_id)
      }, 100)
      processActive.value = 3
      // history.go(-1);
    }
  )
}

const onClickLeft = () => {
  history.go(-1)
}
const Goprocess = (active: any) => {
  // processActive.value = active
}
</script>

<style lang="scss" src="./orderCreate.scss" scoped />
<style lang="scss" scoped>
$spriteHome: '@/assets/images/sprites-home.png';
$sprite-computed-factor: 0.7;
$sprite-home-background-size: calc(108px * 7 / 10) calc(730px * 7 / 10);

.copy {
  background: url($spriteHome) calc(-0px * $sprite-computed-factor)
    calc(-616px * $sprite-computed-factor) no-repeat;
  width: calc(35px * $sprite-computed-factor);
  height: calc(35px * $sprite-computed-factor);
  background-size: $sprite-home-background-size;
}

.copy:before {
  display: none;
}
</style>
<style lang="scss">
.sell_popover1 {
  width: 375px;
  padding: 0 20px;
  transform: translate(15px, 0);
  .van-popover__content {
    padding: 20px;
    font-family: MicrosoftYaHei;
    font-size: 26.6px;
  }
}
</style>
