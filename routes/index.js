/**
 * Created by YUK on 16/6/3.
 */
/**
 * Created by YUK on 14-9-2.
 */

var express = require('express');
var router = express.Router();
var config = require('./../config');

var qiniu = require('./../controller/qiniu');
var _qiniu = qiniu.qiniu;

router.get('/', function(req, res) {
    res.render("index.html")
});

router.get('/api/token', function(req, res) {
    var bucket =  req.query.bucket;
    var key =  req.query.key;
    res.send({
        token : qiniu.uptoken(bucket, key)
    })
});


router.get('/api/list',  function(req, res, next) {
    var bucket =  req.query.bucket;
    var prefix =  req.query.prefix;
    var marker =  req.query.marker || '';

    _qiniu.rsf.listPrefix(bucket, prefix , marker, null/*limit*/, '/', function(err, ret) {
        if (!err) {
            // process ret.marker & ret.items           delimiter
            // console.log(ret.items)
            ret.items.sort(function(a,b){
                return a.putTime < b.putTime ? 1:-1;
            });

            res.send({
                success: true,
                ret: ret,
                domain: config.qiniu.domain[bucket],
                length: ret.items.length,
                prefix: prefix});

        } else {
            res.send({ success: false });
            // http://developer.qiniu.com/docs/v6/api/reference/rs/list.html
        }
    });
});



module.exports = router;
