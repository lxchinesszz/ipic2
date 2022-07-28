// https://developer.qiniu.com/kodo/1289/nodejs#7
const qiniu = require('qiniu')
const accessKey = '3jws4LSQj3Nwi_bWktpNReSf2Rh4D4CU6rTcZlrA'
const secretKey = 'WrROm6H4tHqcQ5ZlosarRLIXn1OE8WcKv9XtSpTF'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z0
const bucketManager = new qiniu.rs.BucketManager(mac, config)

bucketManager.listPrefix('springlearn', {
  limit: 10,
  // 上次标记的位置,作为下次的起点
  marker: 'eyJjIjowLCJrIjoiMDA1NzUwMDFkMzQ4MTEyYTY2MWJlZTI3ODM5YTkxMWUuSlBHIn0='
}, (err, respBody, respInfo) => {
  if (err) {
    console.log(err)
    // throw err;
  } else {
    if (respInfo.statusCode === 200) {
      console.log(respBody.marker)
      const items = respBody.items
      items.forEach(item => {
        console.log(item.key)
        console.log(item.hash)
        console.log(item.fsize)
        console.log(item.mimeType)
        console.log(item.putTime)
      })
    } else {
      console.log(respInfo.statusCode)
      console.log(respBody.error)
    }
  }
})

export function upload (fileName, filePath) {

}
