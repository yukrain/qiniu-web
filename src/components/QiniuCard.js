/**
 * Created by YUK on 16/6/3.
 */
import { Card ,Icon } from 'antd';
import moment from 'moment';
import mixin from './mixin';
moment.locale('zh-cn', {
    relativeTime : {
        future: "%s后",
        past:   "%s前",
        s:  "%d秒",
        m:  "1分钟",
        mm: "%d分钟",
        h:  "1小时",
        hh: "%d小时",
        d:  "1天",
        dd: "%d天",
        M:  "1月",
        MM: "%d月",
        y:  "1年",
        yy: "%d年"
    }
});
let QiniuList = React.createClass({
    mixins:[ mixin ],
    getInitialState() {
        return {
            fsize: "",
            hash: "",

        };
    },

    componentWillMount () {

    },

    componentDidMount() {

    },

    getContentPreview(type, key){
        if(type.indexOf('image')>-1){
            return <img src={this.props.domain + this.props.item.key + '?imageMogr2/gravity/Center/thumbnail/!100x100r/crop/100x100/quality/100'} alt=""/>
        }else{
            let myclass = '';
            switch (type){
                case 'application/pdf' :
                    myclass = 'icon-filepdf';
                    break;
                case 'application/zip' :
                    myclass = 'icon-filezip';
                    break;
                case 'text/javascript' :
                    myclass = 'icon-filecodeo';
                    break;
                case 'text/css' :
                    myclass = 'icon-filecodeo';
                    break;
                case 'text/plain' :
                    myclass = 'icon-conowfile';
                    break;
                case 'application/vnd.android.package-archive' :
                    myclass = 'icon-filezip';
                    break;
                default:
                    myclass = 'icon-fileo';
            }
            return <div className="qiniu-card-preview-icon"> <i className={'iconfont ' + myclass + ' card-icon'}></i> <p> { this.props.item.key }</p></div>
        }
    },

    handleClick(){
        if(this.props.onClick){
            this.props.onClick(this.props.item);
        }
    },
    render () {


        return <div className = { this.props.checked ? "qiniu-card checked": "qiniu-card"}>
                <div className="qiniu-card-box">
                    <div className="qiniu-card-preview" onClick={this.handleClick}>
                        {this.getContentPreview( this.props.item.mimeType, this.props.item.key )}
                    </div>
                    <div className="qiniu-card-filesize">
                        { this.filesize( this.props.item.fsize )}
                    </div>
                    <div className="qiniu-card-time">
                        { moment( this.props.item.putTime / 10000).fromNow()}
                    </div>
                </div>
                <div className="qiniu-card-hide">
                    {this.props.item.key}
                </div>
            </div>
    }
});

export default QiniuList;
