
//配置七牛 拷贝此文件 配置 并命名为 index.js

var config = {
    "env":"production",
    qiniu: {
        ACCESS_KEY: "",
        SECRET_KEY: "",
        domain:{
            //   'bucketName': "domain",
        }
    }
};
module.exports = config;