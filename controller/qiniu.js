/**
 * Created by YUK on 14/11/13.
 */

var config = require('./../config');
var qiniu = require('qiniu');
var crypto = require('crypto');

qiniu.conf.ACCESS_KEY =  config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY =  config.qiniu.SECRET_KEY;

var client = new qiniu.rs.Client();


function urlsafe_base64_encode(data) {
    var newData = new Buffer(data).toString('base64');
    newData = newData.replace(/(\+)/g,"-").replace(/(\/)/g,"_");
    return newData;
}

exports.getAccessToken = function(url){
    return  config.qiniu.ACCESS_KEY +':'+urlsafe_base64_encode( crypto.createHmac('sha1', config.qiniu.SECRET_KEY).update(url + '\n').digest() );
};

exports.uptoken =  function(bucketname, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucketname);

    if(key){
        putPolicy.scope = bucketname + ':' + key
    }
//    putPolicy.callbackUrl = "http://192.168.1.88:3891/qiniu/callback";
//    putPolicy.callbackBody = "name=$(fname)&hash=$(etag)&username=$(x:username)";

//    putPolicy.returnUrl = "http://192.168.1.88:3891/qiniu";
    putPolicy.returnBody =   '{"name": $(fname),"size": $(fsize),"key": $(key), "bucket": $(bucket), "hash": $(etag), "type": $(x:type),"mimeType": $(mimeType)}'
//   "name=$(fname)&hash=$(etag)&key=$(key)&bucket=$(bucket)";

    //putPolicy.asyncOps = asyncOps;
    //putPolicy.expires = expires;
    return putPolicy.token();
}
exports.uptokenOverride =  function(bucketname, key) {

}
exports.uptokenThumb =  function(bucketname) {
    var putPolicy = new qiniu.rs.PutPolicy(bucketname);
    putPolicy.returnBody =   '{"name": $(fname),"size": $(fsize),"key": $(key), "bucket": $(bucket), "hash": $(etag), "type": $(x:type),"mimeType": $(mimeType)}'
    putPolicy.persistentOps = "imageView/2/w/50/h/50|saveas/"+urlsafe_base64_encode(bucketname+":"+"thumb2");

    return putPolicy.token();
}

function urlsafe_base64_encode(data) {
    var newData = new Buffer(data).toString('base64');
    newData = newData.replace(/(\+)/g,"-").replace(/(\/)/g,"_");
    return newData;
}

exports.PutExtra = function(params, mimeType, crc32, checkCrc) {
    this.paras = params || {};
    this.mimeType = mimeType || null;
    this.crc32 = crc32 || null;
    this.checkCrc = checkCrc || 0;
}

exports.uploadBuf = function(body, key, uptoken, mimeType, callback) {
    var extra = new qiniu.io.PutExtra();
    //extra.params = params;
    if(mimeType){
        extra.mimeType = mimeType;
    }
    //extra.crc32 = crc32;
    //extra.checkCrc = checkCrc;

    qiniu.io.put(uptoken, key, body, extra, function(err, ret) {
        if (!err) {
            // 上传成功， 处理返回值
            console.log(ret.key, ret.hash);
            callback(null, ret);
            // ret.key & ret.hash
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
            callback(err, null);
            // http://developer.qiniu.com/docs/v6/api/reference/codes.html
        }
    });
}

exports.uploadFile = function(localFile, key, uptoken, callback) {
    var extra = new qiniu.io.PutExtra();
    //extra.params = params;
    //extra.mimeType = mimeType;
    //extra.crc32 = crc32;
    //extra.checkCrc = checkCrc;

    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if(!err) {
            // 上传成功， 处理返回值
            console.log(ret.key, ret.hash);
            callback(ret);
            // ret.key & ret.hash
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
            // http://developer.qiniu.com/docs/v6/api/reference/codes.html
        }
    });
}

exports.removeFile = function(bucketName, key) {
    client.remove(bucketName, key, function(err, ret) {
        if (!err) {
            // ok
        } else {
            console.log(err);
            // http://developer.qiniu.com/docs/v6/api/reference/codes.html
        }
    });
};

exports.qiniu = qiniu;