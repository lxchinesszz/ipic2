<template>
  <div id="wrapper">
    <div id="titleWrapper">
      <span style="font-weight: bold;">文件上传</span>
    </div>
    <el-divider></el-divider>
    <div id="mainWrapper">
      <div id="main-left">
        <div class="main-left-top">
          <el-upload
            class="upload-demo"
            :on-change="fetchImgPath"
            :show-file-list="false"
            drag
            action="-"
            :auto-upload="false"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
        <div>
          <el-divider></el-divider>
        </div>
        <div class="main-left-bottom">
          <!--          <el-input v-model="bucketName"/>-->
          <!--          <el-button @click="btn1">BTN1</el-button>-->
          <!--                    <el-button @click="btn2">BTN2</el-button>-->
          <el-descriptions title="文件信息" :column="descColumn" v-loading="loading" size="small" border>
            <el-descriptions-item label="目录" class-name="text">{{ localFileDirName }}</el-descriptions-item>
            <el-descriptions-item label="文件名" class-name="text">{{ localFileName }}<i class="el-icon-thumb"></i>
            </el-descriptions-item>
            <el-descriptions-item label="本机路径" class-name="text">{{ localFilePath }}</el-descriptions-item>
            <el-descriptions-item label="远程路径" class-name="text">{{ remoteFileUrl }}</el-descriptions-item>
            <el-descriptions-item label="文件大小">{{
                localFileSize == null ? '' : localFileSize + 'MB'
              }}
            </el-descriptions-item>
            <el-descriptions-item label="空间">
              <el-tag size="small">{{ bucketName }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div id="main-right">
        <div class="main-right-wrapper" v-if="localFilePath!=null && isImage">
          <el-image class="main-right-wrapper"
                    fit="fill"
                    :src="localServerFilePath" style="overflow: hidden">
          </el-image>
        </div>
        <div v-else-if="localFilePath!=null && !isImage" class="notImageFileWrapper">
          <el-result
            icon="warning"
            :title="'当前文件类型:' + fileSuffix"
            :sub-title="'文件大小:' + localFileSize +'MB,请确定是否上传'"
          />
          <div class="fileConfirmWrapper">
            <el-button type="primary">确认上传</el-button>
            <el-button type="danger" icon="Delete" @click="resetFileUpload">清空文件</el-button>
          </div>
        </div>
        <div class="main-right-wrapper" v-else>
          <el-empty description="上传图片后展示"></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toFileWrapper, FileRuleConfig } from '@/utils/FileUtils'
import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { upload } from '@/utils/Qiniu.js'

const {
  clipboard,
  ipcRenderer
} =
  window.require('electron')

export default {
  name: 'upload-page',
  data () {
    return {
      // 本地图片服务器地址,用于读取图片展示
      localServerFilePath: null,
      // 本地文件路径
      localFilePath: null,
      // 本地文件上传后路径
      remoteFileUrl: null,
      // 本地文件目录名
      localFileDirName: '',
      // 本地文件名
      localFileName: '',
      // 文件大小
      localFileSize: null,
      fileSuffix: null,
      loading: false,
      descColumn: 1,
      isImage: true,
      // 首先看是否配置过bucketName,如果没有新建一个窗口,提醒去配置
      bucketName: null
    }
  },
  methods: {
    n: function () {
      ElNotification({
        title: 'Success',
        message: 'This is a success message',
        type: 'success'
      })
    },
    // btn1: function () {
    //   console.log('this.electronStore.get(\'unicorn\')')
    // },
    btn2: function () {
      // ipcRenderer.invoke('dark-mode:system')
      console.log('btn2')
    },
    resetFileUpload: function () {
      this.localServerFilePath = null
      this.localFilePath = null
      this.remoteFileUrl = null
      this.localFileDirName = ''
      this.localFileName = ''
      this.localFileSize = null
      this.fileSuffix = null
      this.loading = false
      this.isImage = true
    },
    // 获取文件地址
    fetchImgPath: function (file, fileLists) {
      console.log(file.raw)
      console.log('文件路径:' + JSON.stringify(file, 2))
      console.log(`文件路径:${file.raw.path}`)
      this.localServerFilePath = URL.createObjectURL(file.raw)
      this.localFileSize = (file.raw.size / 1024 / 1024).toFixed(2)
      this.localFilePath = file.raw.path
      const fileWrapper = toFileWrapper(this.localFilePath)
      console.log(fileWrapper)
      this.localFileDirName = fileWrapper.fileDirName
      this.localFileName = fileWrapper.fileName
      this.fileSuffix = fileWrapper.fileSuffix
      this.isImage = ['.jpg', '.png', '.jpeg', '.svg', '.gif', '.JPG', '.PNG', '.JPEG', '.SVG', '.GIF'].includes(fileWrapper.fileSuffix)
      ipcRenderer.invoke('getAppConfig').then(data => {
        // 验证配置,如果不通过,让用户添加配置
        console.log(JSON.stringify(data))
        if (!this.validation(data)) {
          // 打开一个弹窗
          this.openUserPreferences()
        } else {
          if (this.isImage) {
            const ruleConfig = data
            const fileRule = new FileRuleConfig(ruleConfig.authConfig, ruleConfig.namingRules, ruleConfig.otherConfig)
            this.bucketName = ruleConfig.authConfig.bucketName
            this.uploadFileToServer(this.localFilePath, fileRule, fileWrapper)
          }
        }
      })
    },
    validation (readConfig) {
      const {
        authConfig,
        namingRules,
        otherConfig
      } = readConfig
      console.log(`readConfig:${readConfig}`)
      console.log(`authConfig:${authConfig}`)
      console.log(`namingRules:${namingRules}`)
      console.log(`otherConfig:${otherConfig}`)
      if (authConfig === null || namingRules === undefined || otherConfig === undefined) {
        return false
      } else {
        return true
      }
    },
    openUserPreferences: function () {
      ipcRenderer.invoke('openUserPreferencesWindow')
    },
    // 上传远程仓库
    uploadFileToServer: function (filePath, ruleConfig, fileWrapper) {
      this.loading = true
      const _this = this
      upload(ruleConfig, filePath, fileWrapper, (e, reply) => {
        console.log('上传异常:' + reply.error_code)
        ElMessageBox.confirm(
          '文件上传失败,请先手动检查相关配置信息是否正确',
          'Warning',
          {
            confirmButtonText: '查看配置',
            cancelButtonText: '关闭',
            type: 'warning'
          }
        )
          .then(() => {
            // 打开配置窗口
            _this.openUserPreferences()
          })
          .catch(() => {
          })
        _this.loading = false
      }, img => {
        _this.remoteFileUrl = img
        _this.loading = false
        ipcRenderer.send('Notification', {
          title: '图片上传成功',
          body: `URL: ${img}`,
          href: img
        })
        // 写入到粘贴板
        clipboard.writeText('![](' + img + ')')
      })
      // this.loading = false
    }
  }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

body {
  font-family: 'Source Sans Pro', sans-serif;
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, .9) 100%
  );
}

#wrapper {
  width: 100vw;
  height: 90vh;
  padding: 15px 15px 15px 15px;
  overflow: hidden;
}

#mainWrapper {
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: row;
}

#main-left {
  width: 40%;
  display: flex;
  flex-direction: column;
  padding-right: 15px;
}

#main-right {
  width: 65%;
  padding: 0 20px 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left-width: 1px;
  border-left-color: #c2c9c6;
  border-left-style: solid;
  overflow: hidden;
}

.main-right-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.notImageFileWrapper {
  display: flex;
  margin-top: -100px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.fileConfirmWrapper {

}
</style>

<style>
/*    由electron 通过设置主题进行触发*/
@media (prefers-color-scheme: dark) {
  body {
    background: #333;
    color: white;
  }

  :root {
    --el-text-color-primary: white;
    --el-fill-color-blank: #333;
    --el-text-color-regular: white;
    --el-fill-color-light: #333;
    --el-mask-color: #333;
  }
}

@media (prefers-color-scheme: light) {
  body {
    color: black;
  }
}

 .text {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 auto;
  FONT-SIZE: 14px;
  TEXT-DECORATION: none;
}

</style>
