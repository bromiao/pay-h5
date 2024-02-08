import { Ref, toRefs } from 'vue'

export type ChangeValue = Array<{ key: string; value: string }>

export const inputChange =
  <T extends StateProps>(target: T) =>
  (data: ChangeValue) => {
    const newData = Object.create(null)

    for (let i = 0; i < data.length; i++) {
      const d = {
        [data[i].key]: data[i].value
      }

      Object.assign(newData, d)
    }

    Object.assign(target, newData)
  }

export type InputType = 'text' | 'password' | 'number'
export interface StateProps {
  [key: string]: any
  value: string
  error: string
  type: InputType
}
export interface PhoneCheckProps {
  '+1': RegExp
  '+62': RegExp
  '+60': RegExp
  '+66': RegExp
  '+84': RegExp
  '+63': RegExp
  '+855': RegExp
  '+886': RegExp
  '+852': RegExp
  '+971': RegExp
  '+86': RegExp
}

// 国际手机号格式正则映射map
export const phoneCheckMap: PhoneCheckProps = {
  '+1': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
  '+62': /^(?:\+?62|0)[2-9]\d{7,11}$/,
  '+60': /^(?:\+?60|0)[1-9]\d{7,9}$/,
  '+66': /^(?:\+?66|0)[689]\d{7,8}$/,
  '+84': /^(?:\+?84|0)(?:3[2-9]|5[689]|7[0-9]|8[1-9]|9[0-9])\d{7}$/,
  '+63': /^(?:\+?63|0)(?:9\d{2}|[2-8]\d{2})\d{7}$/,
  '+855': /^(?:\+?855|0)(?:[1-9]\d{7,8}|[1-9]\d{9})$/,
  '+886': /^(?:\+?886|0)[9]\d{8}$/,
  '+852': /^(?:\+?852-?)?[569]\d{3}-?\d{4}$/,
  '+971': /^(?:\+?971|0)?(?:50|51|52|54|55|56|58|2|3|4|6|7|9)\d{7}$/,
  '+86': /^(?:(?:\+|00)86-?)?1[345789]\d{9}$/
}
