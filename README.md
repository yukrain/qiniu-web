# qiniu-web 七牛web文件管理器

一个体验更好的七牛文件管理工具

- 服务器使用Express4.0
- 前端技术栈 antd + react + webpack

#### 配置文件
```
$ cd config
$ cp config_sample.js index.js
###配置骑牛密钥
var config = {
    qiniu: {
        ACCESS_KEY: "",
        SECRET_KEY: "",
        domain:{
           'bucketName1': "http://domain.com", //文件访问域名
           'bucketName2': "http://domain2.com", 
        }
    }
};
```

#### 安装
```
npm install
```
#### 启动webpack
```
npm run webpack-dev
```
#### 在浏览器中打开
```
http://localhost:3000/
```

#### 已实现功能
- 批量上传 
- 批量删除
- 批量移动
- 覆盖上传
- 删除文件
- 移动文件
- 下载文件
- 图片预览
- 刷新缓存

#### 预览
##### 界面
![pic1](https://raw.githubusercontent.com/yukrain/qiniu-web/master/preview/p1.jpg)

##### 多选编辑
![pic2](https://raw.githubusercontent.com/yukrain/qiniu-web/master/preview/p2.jpg)