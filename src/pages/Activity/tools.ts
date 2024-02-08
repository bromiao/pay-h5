export enum gameCardType {
  XXCY = 0,
  GONG = 1,
  XI = 2,
  FA = 3,
  CAI = 4
}

export type cardType = 0 | 1 | 2 | 3 | 4

export type cardLetterType = '恭' | '喜' | '发' | '财' | '谢谢参与'

export interface ICardInfo {
  key: number
  name: string
  num: number
}

export enum gameResult {
  GAME = 1,
  AWARD_RECORD = 2,
  FLIP_CARD_COUNT = 3
}
