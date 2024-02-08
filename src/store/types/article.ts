interface AppExt {
  app_action: string
  app_action_name: string
  WebUrlLink?: string
  target?: number
}
export interface IArticleListType {
  id: number
  type: number
  lang_set: string
  title: string
  s_title: string
  title_color: string
  desc: string
  content: string
  img: string
  mobilecontent: string
  mobileimg: string
  author: string
  add_time: Date | string
  is_skip: number
  skip_path: string
  bind_kactivity: string
  bind_key: string
  app_exts: AppExt | string
  client_type: string
  show_type?: number
  sort?: number
  status?: number
  up_time?: Date | string
}

export interface ArticleState {
  articleList: IArticleListType[]
  homeNoticeShowStatus: boolean
  homeNoticeShowList: Array<boolean | string>
}

export interface IMessage {
  [key: string]: any
  id: number
  img: string
  title: string
  content: string
  add_time: string
  fromname: string
  toname: string
  message_type: number
  user_type: string | number
  extjson: string | null
  bind_type: string
  is_openwin: number
  param: string | null
  is_read: number
  cdesc: string
  fromname_nickname: string
  fromname_headimg: string
  toname_nickname: string
  toname_headimg: string
}

export interface IMessageListData {
  list: IMessage[]
  un_read: number
  count: number
}

export interface IMessageDetails {
  title: string
  content: string
  add_time: string
  fromname: string
  img: string
  order_id: string
  toname: string
  message_type: number
  user_type: string | number
  extjson: null
  bind_type: string
  is_openwin: number
  param: null
  is_read: number
  fromname_nickname: string
  fromname_headimg: string
}
