
//配置七牛 拷贝此文件 配置 并命名为 index.js

var config = {
    "env":"production",
    port: 3000,
    qiniu: {
        ACCESS_KEY: "",
        SECRET_KEY: "",
        domain:{
            'bucketName1': "http://domain.com", //文件访问域名
            'bucketName2': "http://domain2.com",
        }
    }
};
module.exports = config;