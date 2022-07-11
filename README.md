# 金腾脚手架
> 使用说明
```javascript
// 安装依赖
pnpm i 

// 开发环境运行
pnpm dev

// 前端资源构建
pnpm build:vue

// 整体构建
pnpm deploy
```


> 项目目录说明
```javascript
app                         egg相关
 ├─adapter                  适配层  根据tars config内的adpater属性配置 （crm | jt） 项目运行时adpater就会指向对应的文件夹目录（crm | jt）
 │  ├─crm                   
 │  └─jt                    
 ├─controller               egg控制器
 ├─extend                   
 ├─middleware               egg中间件
 ├─model                    egg模型（可放置数据库实体..）
 ├─public                   egg静态文件目录
 ├─service                  egg服务
 ├─view                     egg mvc渲染目录 
 └─web                      
     └─asset
         └─images
build                       tars命令字生成interface
config                      egg项目配置内容
logs                        egg日志
proto                       结构体 接口 枚举
run                         
test                        单元测试
 └─app
     ├─controller
     └─service
typings                     egg和前端web类型声明文件
web                         前端目录代码
  ├─asset                   前端静态资源相关
  │  ├─css
  │  ├─icons
  │  │  └─font
  │  │      └─iconfont
  │  └─images
  ├─public
  ├─src
  │  ├─adapter              所有可替换的外部依赖，都需要在这里封一层，日后替换方便
  │  │  └─storage
  │  ├─base                 这里不要依赖领域层或者应用层的内容，也不能直接依赖外部库
  │  ├─composables          应用层  对领域层的应用 文件名以use开头 可以对外提供单例，也可以提供一些便捷方式
  │  ├─domain               领域层  实体 这里可以依赖于适配层和基础层，但不能直接依赖外部库或应用层。    
  │  ├─mobile               移动端前端代码
  │  │  ├─pages                 页面代码
  │  │  └─router                页面路由

  │  ├─pc                   PC端前端代码
  │  │  ├─components            通用组件
  │  │  │  └─layout                 PC端整体布局相关
  │  │  │      └─AsideNav               侧边栏
  │  │  ├─pages                 页面代码
  │  │  └─router                页面路由

  │  ├─servers              接口层
  │  └─store                vuex状态管理
  │      └─modules
  └─tests                   前端单元测试
      └─unit
          └─base
```

## 构建目标

> 基础

-   [x] 后台 egg + ts
-   [x] 前端 vue(vue-cli) + ts
-   [x] common 插件(api 映射 controller)
-   [x] log 插件
-   [x] egg framework
-   [ ] egg framework (siteFile config 优化?)

> 代码风格配置相关

-   [x] eslint(babel parser)
-   [x] prettier
-   [x] editorconfig

> 开发

-   [x] 本地配置 local.ts
-   [x] 服务端调试支持
-   [x] 前端构建 hot reload
-   [x] vue.config.js typings 支持
-   [x] 前端 source map

> 发布

-   [x] 生产环境运行运行入口文件 server.js
-   [x] 前端生产构建配置
-   [x] 构建脚本(npm script)
-   [ ] 前端 source map 回源

> 其他

-   [x] 新增 vuex
-   [x] 区分 pc 端和移动端，pc 端采用 element-plus，移动端采用 vant
-   [x] 新增 svg 解析成字体图标，web/asset/icons/font/iconfont，使用可参考移动端首页
-   [x] typings 类型文件统一放在最外层，无论是前端还是 node 层
-   [x] 推荐使用 vueuse 官方可组合库
-   [x] setup script 语法糖支持，减少繁琐的返回
-   [x] ajax 请求支持重复发请求自动 abort 相同请求，切换路由自动 abort 掉上一个页面所有请求
-   [x] egg node 端支持别名
-   [ ] vuex 类型支持
-   [ ] element 和 vant 类型支持
-   [ ] vite2 支持，主要是 webpack 插件迁移
