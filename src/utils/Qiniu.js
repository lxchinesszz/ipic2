import qiniu from 'node-qiniu'

export function upload (ruleConfig, filePath, fileWrapper, errorCallback, successCallback) {
  // 七牛云配置
  qiniu.config({
    access_key: ruleConfig.authConfig.accessKey,
    secret_key: ruleConfig.authConfig.secretKey
  })
  // 七牛云空间
  const imagesBucket = qiniu.bucket(ruleConfig.authConfig.bucketName)
  // 图片地址
  const imgPath = filePath
  // 目录 + 文件名
  const imgNameKey = ruleConfig.generateName(fileWrapper)
  // 文件写入成功将上传到七牛云
  imagesBucket.putFile(imgNameKey, imgPath, function (err, reply) {
    if (reply.error_code === 'BadToken') {
      errorCallback(err, reply)
    } else {
      successCallback(ruleConfig.domainImgUrl(fileWrapper))
    }
  })
}
