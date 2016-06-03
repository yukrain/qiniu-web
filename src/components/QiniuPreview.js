/**
 * Created by YUK on 16/6/3.
 */
import { Button ,Tag} from 'antd';
import moment from 'moment';
import mixin from './mixin';

let QiniuList = React.createClass({
    mixins:[ mixin ],
    getInitialState() {
        return {
        };
    },

    componentWillMount () {

    },

    componentDidMount() {

    },

    handleClick(){
        if(this.props.onClick){
            this.props.onClick();
        }
    },

    getContentPreview(type, key){
        if(type.indexOf('image')>-1){
            return <img src={this.props.domain + this.props.item.key } alt=""/>
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

    render () {
        return  <div  className="file-preview" >

            {
                this.props.item.key ?
                    (  <div>
                            <div className="file-preview-content">{this.getContentPreview( this.props.item.mimeType, this.props.item.key )}</div>
                            <div className="file-preview-info">
                                <div className="file-preview-title">
                                    {this.props.domain}{this.props.item.key}
                                </div>
                            <ul>
                                <li>类型 {this.props.item.mimeType}</li>
                                <li>哈希 {this.props.item.hash}  </li>
                                <li>大小 <span className="text-primary">{ this.filesize(this.props.item.fsize || 0)} </span> </li>
                                <li>修改时间  { moment(this.props.item.putTime/10000).format('YYYY-MM-DD Hh:mm:ss')} </li>
                            </ul>
                            </div>
                            <div  className="file-preview-buttons">
                                <Button type="dashed">删除</Button>
                                <Button type="default">刷新</Button>
                                <Button type="default">重命名</Button>
                                <Button type="primary">链接</Button>
                            </div>
                        </div>
                    ): (
                    <div className="file-preview-content">
                        <p>
                            请选择文件
                        </p>
                    </div>
                )
            }


        </div>
    }
});

export default QiniuList;
