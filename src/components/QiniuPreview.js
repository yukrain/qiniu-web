/**
 * Created by YUK on 16/6/3.
 */
import { Button ,Tag, message, Modal, Icon, Input} from 'antd';
const confirm = Modal.confirm;

import moment from 'moment';
import reqwest from 'reqwest';
import mixin from './mixin';
import QueueAnim from 'rc-queue-anim'
const ButtonGroup = Button.Group;


let QiniuList = React.createClass({
    mixins:[ mixin ],
    getInitialState() {
        return {
            keyDest: null
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

    handleChangeKeyDest( e){
        this.setState({
            keyDest:  e.target.value
        })
    },

    move(){
        confirm({
            title: '是否移动文件 '+ this.props.item.key ,
            content: <div>  <Input defaultValue={this.props.item.key} onChange={this.handleChangeKeyDest} /></div>,
            onOk:()=>{
                reqwest({
                    url:'/api/move',
                    method: 'put',
                    data: {
                        bucket: this.props.bucket,
                        bucketDest: this.props.bucket,
                        key: this.props.item.key,
                        keyDest: this.state.keyDest
                    },
                    crossOrigin: true,
                    type: 'json',
                    error: (err) => {
                        message.error('移动失败');
                    },
                    success: (result) => {
                        if(result.code == 100){
                            if(this.props.onSuccess){
                                this.props.onSuccess();
                            }
                        }


                    }
                });
            },
        });
    },
    remove(){
        confirm({
            title: '确认要删除文件吗?',
            content: this.props.item.key,
            onOk:()=>{
                reqwest({
                    url:'/api/delete',
                    method: 'delete',
                    data: {
                        bucket: this.props.bucket,
                        key: this.props.item.key
                    },
                    crossOrigin: true,
                    type: 'json',
                    error: (err) => {
                        message.error('删除失败');
                    },
                    success: (result) => {
                        if(result.code == 100){
                            if(this.props.onSuccess){
                                this.props.onSuccess();
                            }
                        }


                    }
                });
            },
        });
    },

    refresh(){
        var url = this.props.domain + this.props.item.key;
        reqwest({
            url:'/api/refresh',
            method: 'post',
            data: {
                urls: [url]
            },
            crossOrigin: true,
            type: 'json',
            error: (err) => {
                message.error('已存在队列');
            },
            success: (result) => {
                if( result.code == 200){
                    message.success(result.msg);
                }else{
                    message.error(result.msg);
                }

            }
        });
    },

    download(){
        window.open(this.props.domain + this.props.item.key + '?attname=')
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
            return <div className="file-preview-icon"> <i className={'iconfont ' + myclass + ' card-icon'}></i> <p> { this.props.item.key }</p></div>
        }
    },

    render () {
        return  this.props.item.key ?
            (  <QueueAnim className="demo-content"
                          key="demo"
                          type={['right', 'left']}
                          ease={['easeOutQuart', 'easeInOutQuart']}>
                    <div  className="file-preview" key="1">
                        <div >
                            <div className="file-preview-title">
                                {this.props.item.key}
                            </div>

                            <div  className="file-preview-buttons" >
                                <ButtonGroup >
                                    <Button type="default" icon="delete"  onClick={this.remove}></Button>
                                    <Button type="default" icon="reload"  onClick={this.refresh}></Button>
                                    <Button type="default" icon="download" onClick={this.download}></Button>
                                    <Button type="default" icon="edit"  onClick={this.move}></Button>
                                    <Button type="default"  icon="upload" ></Button>
                                </ButtonGroup>


                            </div>

                            <div className="file-preview-info">

                                <p>
                                    {this.props.domain + this.props.item.key}
                                </p>
                                <ul>
                                    <li><Icon type="book" /> 类型 {this.props.item.mimeType}</li>
                                    <li><Icon type="book" /> 哈希 {this.props.item.hash}  </li>
                                    <li><Icon type="book" /> <span className="text-primary">{ this.filesize(this.props.item.fsize || 0)} </span> </li>
                                    <li><Icon type="clock-circle-o" /> 修改时间  { moment(this.props.item.putTime/10000).format('YYYY-MM-DD HH:mm:ss')} </li>
                                </ul>
                            </div>

                            <div className="file-preview-content">{this.getContentPreview( this.props.item.mimeType, this.props.item.key )}</div>

                        </div>
                    </div>
                </QueueAnim>
            ): null
    }
});

export default QiniuList;
