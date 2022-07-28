import md5 from 'js-md5'

export class FileWrapper {
  // _fileDirName
  // _fileName
  // _fileSuffix

  constructor (fileDirName, fileName, fileSuffix) {
    this._fileDirName = fileDirName
    this._fileName = fileName
    this._fileSuffix = fileSuffix
  }

  get fileDirName () {
    return this._fileDirName
  }

  get fileName () {
    return this._fileName
  }

  get fileSuffix () {
    return this._fileSuffix
  }
}

export function toFileWrapper (filePath) {
  return new FileWrapper(fetchFileDirName(filePath), fetchFileName(filePath), fetchFileSuffix(filePath))
}

/**
 * 获取目录名
 */
function fetchFileDirName (filePath) {
  const indexOf = filePath.lastIndexOf('/')
  if (indexOf > -1) {
    return filePath.slice(0, indexOf)
  } else {
    return ''
  }
}

function fetchFileName (filePath) {
  const indexOf = filePath.lastIndexOf('/')
  const suffixIndexOf = filePath.lastIndexOf('.')
  if (indexOf > -1) {
    return filePath.slice(indexOf + 1, suffixIndexOf)
  } else {
    return ''
  }
}

/**
 * 获取文件后缀
 */
function fetchFileSuffix (filePath) {
  const indexOf = filePath.indexOf('.')
  if (indexOf > -1) {
    return filePath.slice(indexOf, filePath.length)
  }
  return ''
}

// const filePath = '/Users/liuxin/WebstormProjects/ipic2/src/utils/FileUtils.js'
// console.log(fetchFileName(filePath))
// console.log(fetchFileDirName(filePath))
// console.log(fetchFileSuffix(filePath))
// console.log(toFileWrapper(filePath).fileSuffix)

export class FileRuleConfig {
  // /**
  //  * 权限配置
  //  */
  // authConfig
  //
  // /**
  //  * 命名规则
  //  */
  // namingRules
  //
  // /**
  //  * 其他配置
  //  */
  // otherConfig

  constructor (authConfig, namingRules, otherConfig) {
    this.authConfig = authConfig
    this.namingRules = namingRules
    this.otherConfig = otherConfig
  }

  /**
   * 根据原始文件名生成文件名
   * @param targetFileName
   */
  generateName (fileWrapper) {
    if (this.namingRules.prefix === undefined) {
      this.namingRules.prefix = ''
    }
    if (this.namingRules.suffix === undefined) {
      this.namingRules.suffix = ''
    }
    let name = ''
    if (this.namingRules.generateNameType === 1) {
      name = fileWrapper.fileName
    }
    if (this.namingRules.generateNameType === 2) {
      name = md5(fileWrapper.fileName)
    }
    if (this.authConfig.dirName) {
      // 前缀 + 名字 + 后缀 + 文件类型
      return `${this.authConfig.dirName}/${this.namingRules.prefix}${name}${this.namingRules.suffix}${fileWrapper.fileSuffix}`
    } else {
      // 前缀 + 名字 + 后缀 + 文件类型
      return `${this.namingRules.prefix}${name}${this.namingRules.suffix}${fileWrapper.fileSuffix}`
    }
  }

  domainImgUrl (fileWrapper) {
    const imgNameKey = this.generateName(fileWrapper)
    return `${this.otherConfig.domain}/${imgNameKey}`
  }

  //   config: {
  //     bucketName: '',
  //     dirName: '',
  //     secretKey: '',
  //     accessKey: ''
  //   }
  // ,
  //   namingRules: {
  //     prefix: '',
  //     suffix: '',
  //     generateNameType: 2
  //   }
  // ,
  //   otherConfig: {
  //     domain: '',
  //     backup: true
  //     // backupPath: ''
  //   }
}
