/**
 * Created by YUK on 16/6/3.
 */
import { Card ,Icon } from 'antd';
import moment from 'moment';
import mixin from './mixin';

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

        return <div className="qiniu-card">
                <div className="qiniu-card-box">
                    <div className="qiniu-card-preview" onClick={this.handleClick}>
                        {this.getContentPreview( this.props.item.mimeType, this.props.item.key )}
                    </div>
                    <div className="qiniu-card-filesize">
                        { this.filesize( this.props.item.fsize )}
                    </div>
                    <div className="qiniu-card-time">
                        { moment( this.props.item.putTime / 10000).format('YY-MM-DD HH:mm')}
                    </div>
                </div>
                <div className="qiniu-card-hide">
                    {this.props.item.key}
                </div>
            </div>
    }
});

export default QiniuList;
