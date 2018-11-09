**breeze-cli**

breeze 是一个基于 webpack 的打包工具，不依赖于具体项目，相反，它是诸多项目 ( React & Webpack & ES6 ) 共同点的抽离。方便项目的调试和打包，是 breeze 诞生的初衷。

现在，只需在新建项目的根目录下创建 `breeze.config.js`（ breeze 的配置文件），就可完成 React 项目的初始化。


### <span id="install">如何安装</span>

- gitlab 手动编译

  ```
  # npm 全局
   npm install breeze-cli -g 

  ```
### <span id="create">项目创建</span>

| cli 命令                      | 说明
|-------------------------------|----------------------------
| breeze-cli init [name]            | react & react-router (单页面或多页面)
| breeze-cli init-redux [name]      | react & react-router & redux
| breeze-cli init-prerender         | 对项目（单页面或多页面）开启预渲染

目录结构一览

```
.
├── /dist/                              # 代码打包目录
├── /node_modules/                      # node依赖包
├── /src/                               # 源码目录
│   ├── /pages/                         # 页面
│   ├── /components/                    # 公用组件
│   ├── /assets/                        # 图片、字体资源
│   ├── /css/                           # 公用样式
│   ├── /utils/                         # 公用JS模块
│   ├── index.html                      # 首页HTML模版
│   └── index.js                        # 首页入口
├── /config/                            # prerender配置文件
├── /prerender/                         # 自定义prerender逻辑
├── breeze.config.js                    # breeze的配置文件
└── package.json                        # 略
```

### <span id="build">项目打包</span>

| cli 命令                | 说明
|-------------------------|-----------------------------------------------
| breeze-cli start [-p PORT]  | 运行本地调试
| breeze-cli test             | 运行测试代码 (功能待完善)
| breeze-cli build            | 基于配置进行文件打包
| breeze-cli release          | 基于配置进行文件打包正式代码 (功能待完善)


### <span id="test">项目测试</span>

> *测试功能正在开发中*

### <span id="config">配置文件</span>

| 配置项                  | 默认值       						| 说明
|-------------------------|--------------						|-------------------------------------------------
| host                    |  0.0.0.0     						| 调试IP，本地调试使用默认值即可 (windows环境建议修改为localhost)
| port                    |  9527        						| 开发环境端口号
| base                    |  src         						| 代码根目录
| externals               |  {}         						| demo { '$': 'jQuery' }
| build                   |  dist        						| 打包目录，打包后的代码将放置到此处，与 base 同级
| static                  |  [见示例配置](#config_default)   	| 静态资源 CDN 域名设置，**路径结尾包含`/`** 代码中以 `STATIC` 引用, etc.. `console.log(STATIC)`
| api                     |  [见示例配置](#config_default)   	| API 路径设置，**路径结尾不包含`/`** 代码中以 `API` 引用
| globals                 |  [见示例配置](#config_default)      | 更多全局变量设置，js代码中以配置项 key 的大写 `KEY` 形式引用，如果在首页模板中，用法则为{%=o.configs.KEY%}
| vendor                  |  ['react', 'react-dom'] | 将指定的类库打包到 **vendor-[hash].js**中，建议常用的类库放到此处。此项不包含业务代码，不会经常变动此项，可充分利用缓存优势
| pages                   |  pages         						| 页面目录，默认为 `pages/`，可修改, 支持多 html 模版，详细见示例配置
| components              |  components         				| 页面间共享的组件目录，可修改（非共用组件，放置在当前页面目录即可）
<!-- | eslint                  |  false         						| 是否启用 eslint , 默认关闭，如果启用该选项，请在项目根目录提供自己的 .eslintrc -->
| base64_image_limit      |  1024                				| 对所有小于该大小的图片启用 base64 转码, 默认 10240 (10k)
| prerender               |  false                			| 本工具集成预渲染，可以设置是否开启。开启之后，可以自定义预渲染逻辑
| entry                   |  src/index.js               | webpack单页面的入口配置

<br/> <b id="config_default">示例配置</b>

```
{
    "host": "0.0.0.0",
  
    "port": "9527",
  
    "base": "src",
  
    "prerender": true, // 是否开启预渲染
  
    "entry": "index.js",

    "components": "components",
  
    // 定义多页面入口
    "pages": {
        "name": "pages", // custom default `page` dir
        // "multi": ""
        "multi": {  // 配置选项则开启多页面配置
             "home": {
                 "entry": "index.js",
                 "template": "template.html"
             },
             "about": {
                 "entry": "index.js",
                 "template": "template.html"
             } 
         }
    },
  
    "build": "dist",
  
    "static": {
        "start"         :   "",                 
        "test"          :   "",
        "pre"           :   "//static.test.com/"，
        "release"       :   "//static.test.com/" 
    },
  
    "api": {  
        "start"       :   "",
        "test"        :   "",
        "pre"         :   "//api.test.com",
        "release"     :   "//api.test.com"
    },
  
    "globals": {}, 
  
    "vendor": ["react", "react-dom"],
  
    "eslint": false,
  
    "transfer_assets": false,
  
    "base64_image_limit": 10240 // 10k
}
```

### <span id="api">命令</span>

| cli 命令                      | 说明
|-------------------------------|----------------------------
| breeze-cli init [name]            | react & react-router (单页面或多页面)
| breeze-cli init-redux [name]      | react & react-router & redux
| breeze-cli init-prerender         | 对项目（单页面或多页面) 开启预渲染，需进入项目目录之后执行
| breeze-cli page [name]            | 创建页面
| breeze-cli component [name]       | 创建组件
| breeze-cli start                  | 运行本地调试
| breeze-cli test                   | 运行测试代码
| breeze-cli build                  | 基于配置文件打包项目文件
| breeze-cli release                | 基于配置文件打包发布文件，压缩，移除 console 日志
| (更多功能正在集成中...)


### <span id="预渲染">开启预渲染</span>

本工具一大优势，集成了预渲染功能，并且可以自定义预渲染逻辑
