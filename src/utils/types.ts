// 递归将某个类型下所有属性变为必选
// 示列：type b = DeepRequired<configType>
export type DeepRequired<T> = {
  [K in keyof T]: Required<DeepRequired<T[K]>>
}

// 将某个类型下特定属性变为必选
// 示列：type Student2 = CustomRequired<Student, 'age'>
// 示列：type Student3 = CustomRequired<Student, 'age' | 'name'>
export type CustomRequired<T, K extends keyof T> = {
  [P in K]-?: T[P]
} & Omit<T, K>
