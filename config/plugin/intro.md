# plugin

### compress plugin

##### gzip brotli 压缩插件

| 参数名              | 类型      | 可选值            | 默认值  | 说明         |
|------------------|---------|----------------|------|------------|
| compress         | string  | gzip \| brotli | -    | 压缩类型       |
| deleteOriginFile | boolean | -              | true | 压缩后是否删除源文件 |

### imagemin

##### 一个压缩图片资产的 vite 插件 详情参照 [imagemin](https://github.com/vbenjs/vite-plugin-imagemin/blob/main/README.zh_CN.md)

### vConsolet

##### tencent vConsole 插件

| 参数名    | 类型                 | 可选值 | 默认值  | 说明     |
|--------|--------------------|-----|------|--------|
| enable | boolean            | -   | true | 是否启用   |
| entry  | string \| string[] | -   | -    | 文件入口配置 |

### visualizer
##### bundle 分析插件 详情参照 [visualizer](https://github.com/btd/rollup-plugin-visualizer)

| 参数名    | 类型                 | 可选值 | 默认值   | 说明     |
|--------|--------------------|-----|-------|--------|
| isOpen | boolean            | -   | false | 是否启用   |
