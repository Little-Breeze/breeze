module.exports = {
    // debug host
    "host": "0.0.0.0",
  
    // debug port
    "port": "9527",
  
    // breeze default src dir 
    "base": "src",
  
    "prerender": true, // 是否开启预渲染
  
    // webpack entry, default to `src/index.js` 单页面入口
    "entry": "index.js",
  
    // 定义多页面入口
    "pages": {
        "name": "pages", // custom default `page` dir
        "multi": ""
        // "multi": {  // 如果判断类型是object则开启多页面配置
        //     "home": {
        //         "entry": "index.js",
        //         "template": "template.html"
        //     },
        //     "about": {
        //         "entry": "index.js",
        //         "template": "template.html"
        //     } 
        // }
    },
  
    // target build dir
    "build": "dist",
  
    // static domain
    "static": {
        "start"         :   "",                  // relative path
        "test"          :   "",
        "pre"           :   "//static.test.com/",// CDN domain
        "release"       :   "//static.test.com/" // CDN domain
    },
  
    "api": {  
        "start"       :   "",
        "test"        :   "",
        "pre"         :   "//api.test.com",
        "release"     :   "//api.test.com"
    },
  
    // globals
    "globals": {},  // 配置全局变量
  
    // third patry libs to bundle
    "vendor": ["react", "react-dom"],
  
    // switch for eslint
    "eslint": false,
  
    // custom default component dir
    "components": "components",
    
    // switch for transfering assets dir to dist when build
    "transfer_assets": false,
  
    // limit image size for use base64, (smaller use base64, larger use url)
    "base64_image_limit": 10240 // 10k
  }
  