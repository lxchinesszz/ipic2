// import { sqlite3 } from 'sqlite3'

const sqlite3 = require('sqlite3')
const sqlite = sqlite3.verbose()

const db = new sqlite.Database('ipic2.db')

db.serialize(() => {
  db.run('create table config' +
    '(\n' +
    '    id          int          null,\n' +
    '    file_name   varchar(64)  null comment \'文件名\',\n' +
    '    file_suffix varchar(64)  null comment \'文件后缀\',\n' +
    '    local_path  varchar(128) null comment \'本机路径\',\n' +
    '    remote_path varchar(128) null comment \'远程路径\',\n' +
    '    create_time datetime     null comment \'创建时间\',\n' +
    '    backup_path int          null comment \'本机备份路径\'\n' +
    ');\n' +
    '\n', () => {
  })
})
