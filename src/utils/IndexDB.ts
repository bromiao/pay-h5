import { isJson, isJsonString } from './tools'

export default class IndexedDBUtils {
  private readonly dbName: string
  private readonly version: number
  private readonly storeName: string

  constructor(storeName: string, version: number, dbName: string) {
    this.dbName = dbName
    this.version = version
    this.storeName = storeName

    const db = indexedDB.open(this.dbName, this.version)

    db.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase

      if (db.objectStoreNames.contains(this.storeName)) {
        db.deleteObjectStore(this.storeName)
      }

      db.createObjectStore(this.storeName, { keyPath: 'key' })
    }
  }

  public async getById(key: string): Promise<any> {
    const db = await this.openDB()
    const transaction = db.transaction(this.storeName, 'readonly')
    const objectStore = transaction.objectStore(this.storeName)
    const request = objectStore.get(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null)
      }
      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  public async update(key: string, value: any): Promise<void> {
    const oldData = await this.getById(key)

    // if (key === 'countryCode') {
    //   console.log('oldData', oldData);
    //   console.log('value', value);
    // }
    if (oldData === value) return Promise.resolve()

    const db = await this.openDB()
    const transaction = db.transaction(this.storeName, 'readwrite')
    const objectStore = transaction.objectStore(this.storeName)

    const existingRequest = objectStore.get(key)

    existingRequest.onsuccess = () => {
      const existingData = existingRequest.result

      if (existingData) {
        objectStore.delete(key)
      }

      objectStore.add({ key, value })
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve()
      }

      transaction.onerror = () => {
        reject(transaction.error)
      }
    })
  }

  public async deleteById(key: string): Promise<void> {
    const db = await this.openDB()
    const transaction = db.transaction(this.storeName, 'readwrite')
    const objectStore = transaction.objectStore(this.storeName)
    const request = objectStore.delete(key)

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve()
      }
      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  // 获取所有数据
  public async getAll(): Promise<any> {
    const db = await this.openDB()
    const transaction = db.transaction(this.storeName, 'readonly')
    const objectStore = transaction.objectStore(this.storeName)
    const request = objectStore.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result ? request.result : null)
      }
      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  public async saveData(json: string, parentKey: string): Promise<any> {
    const saveAll = []

    const data = !parentKey ? isJsonString(json) : json
    const keys = Object.keys(data)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      // let value;

      if (parentKey) {
        const value = data[key]
        // const json = isJson(value) ? value : JSON.stringify(value);

        saveAll.push(
          this.update(
            key,
            JSON.stringify({
              parentKey,
              value
            })
          )
        )

        continue
      }

      const value = isJsonString(data[key])
      const ks = Object.keys(value)
      const json: any = {}

      for (let j = 0; j < ks.length; j++) {
        const k = ks[j]
        const v = JSON.stringify(value[k])
        const js = isJson(v) ? v : JSON.parse(v)

        json[k] = js
      }

      await this.saveData(json, key)
    }

    if (parentKey) await Promise.all(saveAll)
  }

  public async getAllData(): Promise<any> {
    const dataArr = await this.getAll()
    const data: any = {}

    for (let i = 0; i < dataArr.length; i++) {
      const d = dataArr[i]

      if (d.key === 'persist:root') continue

      const v = isJson(d.value) ? JSON.parse(d.value) : d.value
      const key = v?.parentKey ?? ''

      if (!key) continue
      if (!data[key]) data[key] = {}

      const dd = isJson(v.value) ? JSON.parse(v.value) : v.value

      data[key][d.key] = dd
    }

    const keys = Object.keys(data)
    const newd: any = {}

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = data[key]

      newd[key] = JSON.stringify(value)
    }

    const d = JSON.stringify(newd)

    return d
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onsuccess = () => {
        const db = request.result

        resolve(db)
      }
      request.onerror = () => {
        reject(request.error)
      }
    })
  }
}
