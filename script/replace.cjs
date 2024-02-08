const fs = require('fs')
const path = require('path')

// 获取目标目录和替换目录
const targetDir = process.argv[2]
const replaceDir = process.argv[3]

// 获取目标目录下的所有文件
const files = fs.readdirSync(targetDir)

// 遍历所有文件
for (const file of files) {
  // 检查文件是否与指定的文件名相同
  if (fs.existsSync(path.join(replaceDir, file))) {
    // 如果文件存在，则将其删除
    fs.unlinkSync(path.join(replaceDir, file))

    // 创建一个新的文件，并写入内容
    fs.writeFileSync(path.join(replaceDir, file), fs.readFileSync(path.join(targetDir, file)))
  }
}
