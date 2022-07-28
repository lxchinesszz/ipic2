<template>
  <div id="wrapper" @blur="blurFunc" @focus="focusFunc">
    <div id="stepWrapper">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="基础配置"/>
        <el-step title="命名规则"/>
        <el-step title="域名配置"/>
      </el-steps>
    </div>
    <el-divider></el-divider>
    <div id="stepTabPage" @blur="blurFunc">
      <div v-if="active===0" class="stepTab">
        <el-form
          :label-position="labelPosition"
          label-width="100px"
          :model="config"
          :rules="configRules()"
        >
          <el-form-item label="accessKey" prop="accessKey" error="accessKey不能为空,否则无法连接图床" required inline-message>
            <el-input v-model="config.accessKey" clearable/>
          </el-form-item>
          <el-form-item label="secretKey" prop="secretKey" error="secretKey不能为空,否则无法连接图床" required>
            <el-input v-model="config.secretKey" type="password" show-password clearable/>
          </el-form-item>
          <el-form-item label="空间" prop="bucketName" error="bucketName不能为空,否则无法连接图床" required>
            <el-input v-model="config.bucketName" placeholder="springlearn" clearable/>
          </el-form-item>
          <el-form-item label="上传目录" prop="dirName">
            <el-input v-model="config.dirName" placeholder="img(前后不需要加/)" clearable/>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active===1" class="stepTab">
        <el-form
          :label-position="labelPosition"
          label-width="100px"
          :model="namingRules"
        >
          <el-form-item label="文件名前缀">
            <el-input v-model="namingRules.prefix"/>
          </el-form-item>
          <el-form-item label="文件名后缀">
            <el-input v-model="namingRules.suffix"/>
          </el-form-item>
          <el-form-item label="命名规则" required>
            <el-radio-group v-model="namingRules.generateNameType">
              <el-radio-button label="1">文件名</el-radio-button>
              <el-radio-button label="2">随机数字</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="active===2" class="stepTab">
        <div v-if="!complete">
          <el-form
            :label-position="labelPosition"
            label-width="100px"
            :model="otherConfig"
            ref="otherConfigRef"
            :rules="otherConfigRules()"
          >
            <el-form-item label="域名" prop="domain">
              <el-input v-model="otherConfig.domain" placeholder="http://img.springlearn.cn">
              </el-input>
            </el-form-item>
            <el-form-item label="开启备份">
              <el-switch v-model="otherConfig.backup"/>
            </el-form-item>
            <el-form-item>
              <el-descriptions size="small" column="2">
                <el-descriptions-item label="示例" v-if="config.dirName===''"
                >{{ otherConfig.domain }}/img.png
                </el-descriptions-item
                >
                <el-descriptions-item label="示例" v-else
                >{{ otherConfig.domain }}/{{ config.dirName }}/img.png
                </el-descriptions-item
                >
              </el-descriptions>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="active===3">
        <el-result
          icon="success"
          title="恭喜完成所有配置"
          sub-title="请愉快的使用文件上传功能吧"
        ></el-result>
      </div>
    </div>
    <el-divider></el-divider>
    <div id="submitWrapper">
      <div>
        <el-button style="margin-top: 12px" @click="pre">上一步</el-button>
        <el-button style="margin-top: 12px" @click="next">下一步</el-button>
        <el-button style="margin-top: 12px" @click="close" type="danger" v-if="complete">关闭</el-button>
        <el-button style="margin-top: 12px" @click="close" type="info" v-else>退出</el-button>

      </div>
    </div>
  </div>
</template>

<script>
const {
  ipcRenderer
} =
  window.require('electron')
export default {
  name: 'UserPreferences',
  data () {
    return {
      active: 0,
      config: {
        bucketName: '2',
        dirName: '',
        secretKey: '1',
        accessKey: '1'
      },
      namingRules: {
        prefix: '',
        suffix: '',
        generateNameType: 2
      },
      otherConfig: {
        domain: 'https://img.springlearn.cn',
        backup: true
        // backupPath: ''
      },
      select: '',
      labelPosition: 'left',
      complete: false,
      nextDisabled: true
    }
  },
  created () {
    // 从配置中拿到配置
    console.log('UserPreferences Created')
    const _this = this
    ipcRenderer.invoke('getAppConfig').then(data => {
      // 验证配置,如果不通过,让用户添加配置
      console.log(JSON.stringify(data))
      _this.otherConfig = data.otherConfig
      _this.namingRules = data.namingRules
      _this.config = data.authConfig
    })
  },
  methods: {
    configRules: function () {
      return {
        dirName: [
          {
            trigger: 'blur',
            message: '目录不能为空'
          }
        ],
        accessKey: [
          {
            required: true,
            trigger: 'blur',
            message: 'accessKey不能为空'
          },
          {
            message: 'accessKey不能为空'
          }
        ],
        secretKey: [
          {
            required: true,
            trigger: 'blur',
            message: 'secretKey不能为空'
          },
          {
            message: 'secretKey不能为空'
          }
        ],
        bucketName: [
          {
            required: true,
            trigger: 'blur',
            message: 'bucketName不能为空'
          },
          {
            message: 'bucketName不能为空'
          }
        ]
      }
    },
    otherConfigRules: function () {
      return {
        domain: [
          {
            required: true,
            trigger: 'blur',
            message: '图床域名不能为空'
          },
          {
            trigger: 'blur',
            validator: () => {
              const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
              if (!reg.test(this.otherConfig.domain)) {
                throw new Error('域名不合法')
              } else {
                return true
              }
            }
          }
        ]
      }
    },
    focusFunc: function () {
      console.log('获取焦点')
    },
    blurFunc: function () {
      console.log('失去焦点')
    },
    close: function () {
      ipcRenderer.invoke('closeUserPreferencesWindow')
    },
    next: function () {
      if (this.active === 0) {
        console.log(`From config:${JSON.stringify(this.config)}`)
        if (this.config.bucketName === '' || this.config.accessKey === '' || this.config.secretKey === '') {
          return
        }
        if (this.config.dirName !== '' || this.config.dirName.length > 0) {
          if (this.config.dirName[0] === '/') {
            this.config.dirName = this.config.dirName.substring(1, this.config.dirName.length)
          }
          if (this.config.dirName[this.config.dirName.length - 1] === '/') {
            this.config.dirName = this.config.dirName.substring(0, this.config.dirName.length - 1)
          }
        }
        this.active++
      } else if (this.active === 1) {
        this.active++
        console.log(`From namingRules:${JSON.stringify(this.namingRules)}`)
      } else if (this.active === 2) {
        this.$refs.otherConfigRef.validate((valid) => {
          if (!valid) {
            console.log('error submit!')
            return false
          } else {
            console.log()
            this.active++
            console.log(`From otherConfig:${JSON.stringify(this.otherConfig)}`)
            this.complete = true
          }
        })
        this.saveConfig()
      }
      console.log(`active:${this.active}`)
    },
    saveConfig: function () {
      console.log('saveAppConfig事件发送出去')
      const args = {
        authConfig: this.config,
        namingRules: this.namingRules,
        otherConfig: this.otherConfig
      }
      console.log(JSON.stringify(args))
      ipcRenderer.send('saveAppConfig', JSON.stringify(args))
    },
    pre: function () {
      this.complete = false
      if (this.active-- === 0) {
        this.active = 0
      }
    },
    complete: function () {
      // 发送完成通知,提醒是否关闭,还是要修改
    }
  }
}
</script>

<style scoped>
#wrapper {
  display: flex;
  flex-direction: column;
  padding: 30px 15px;
  height: 100vh;
  /*background-color: red;*/
}

#stepWrapper {
  width: 100%;
  height: 10%;
}

#stepTabPage {
  height: 45%;
  text-align: center;
}

#submitWrapper {
  text-align: center;
}

.stepTab {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 15px;
  padding-right: 55px;
}
</style>
