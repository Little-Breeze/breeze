module.exports = {
    // debug host
    "host": "0.0.0.0",
  
    // debug port
    "port": "9527",
  
    // pepper src entry, also inner webpack entry, default to `src/pages/index.js`
    "base": "src",
  
    // target build dir
    "build": "dist",
  
    // CDN domain, or just leave it blank
    "static": {
        "start"         :   "",                    // here use relative path
        "test"          :   "",
        "pre"           :   "//static.test.com/",// here use CDN domain
        "release"       :   "//static.test.com/" // here use CDN domain
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
  
    // custom default page dir
    "pages": "pages",
  
    // custom default component dir
    "components": "components",
    
    // switch for transfering assets dir to dist when build
    // "transfer_assets": false,
  
    // limit image size for use base64, (smaller use base64, larger use url)
    "base64_image_limit": 10240 // 10k
  }
  