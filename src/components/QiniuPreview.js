/**
 * Created by YUK on 16/6/3.
 */
import { Button ,Tag, message, Modal, Icon, Input} from 'antd';
const confirm = Modal.confirm;

import QiniuUploaderRewrite from './QiniuUploaderRewrite';
import moment from 'moment';
import reqwest from 'reqwest';
import mixin from './mixin';
import QueueAnim from 'rc-queue-anim'
const ButtonGroup = Button.Group;


let QiniuList = React.createClass({
    mixins:[ mixin ],
    getInitialState() {
        return {
            showUploader: false,
            keyDest: null
        };
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


    copyToClipboard (text){
        if(window.clipboardData){
            window.clipboardData.setData('copy-node', text);
            return;
        }else{
            var copyNode = document.getElementById('copy-node');
            copyNode.value = text;
            copyNode.focus();
            document.execCommand('selectall');
            var result = document.execCommand('copy', false, null);
            if(result){
                message.success('已复制到剪贴板:'+ text);
                return;
            }else{
                alert('不支持自动复制图片地址喔 换chrome试一下~(可以手动复制图片地址)')
                return;
            }
        }
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
        let hide = message.loading('正在加入刷新队列...', 0);
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
                hide();
                message.error('已存在队列');
            },
            success: (result) => {
                hide();
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

    preview(e, e2,src){
        window.open(this.props.domain + this.props.item.key +'?_='+ new Date().getTime() )
    },

    getContentPreview(type, key){
        if(type.indexOf('image')>-1){
            return <div>
                <img src={ this.props.domain + this.props.item.key+'?imageMogr2/thumbnail/!300>/quality/100&_='+this.props.random } alt=""/>
                </div>
        }else{
            let myclass = this.getFileIconClass(type)
            return <div className="file-preview-icon"> <i className={'iconfont ' + myclass + ' card-icon'}></i> <p> 该文件无法预览</p></div>
        }
    },

    render () {
        return  this.props.item.key ?
            (  <QueueAnim  key="demo"
                          type={['right', 'left']}
                          ease={['easeOutQuart', 'easeInOutQuart']}>
                    <div  className="file-preview" key="1">
                        <div>
                            <div className="copy-node">
                                <Input  id="copy-node" value=''/>
                            </div>
                            <QueueAnim className="demo-content"
                                       key="demo" delay={50}
                                       type={['right', 'bottom']}>

                                <div className="file-preview-title" key="2">
                                    { this.getKeyFilename(this.props.item.key)}
                                </div>


                                <div className="file-preview-info" key="4">

                                    <p>
                                        {this.props.domain + this.props.item.key}
                                    </p>
                                    <ul>
                                        <li><Icon type="book" /> 类型 {this.props.item.mimeType}</li>
                                        <li><Icon type="book" /> 哈希 {this.props.item.hash}  </li>
                                        <li><Icon type="book" /> 文件大小 <span className="text-primary">{ this.filesize(this.props.item.fsize || 0)} </span> </li>
                                        <li><Icon type="clock-circle-o" /> 修改时间  { moment(this.props.item.putTime/10000).format('YYYY-MM-DD HH:mm:ss')} </li>
                                    </ul>
                                </div>

                                <div  className="file-preview-buttons"  key="3"  style={{textAlign:'center'}}>
                                    <ButtonGroup >
                                        <Button type="default" icon="delete"  onClick={this.remove}>删除</Button>
                                        <Button type="default" icon="reload"  onClick={this.refresh}>刷新</Button>
                                        <Button type="default" icon="edit"  onClick={this.move}>移动</Button>
                                        {
                                            this.state.showUploader ? (
                                                <Button type="default" icon="eye" onClick={()=>{ this.setState({showUploader: false}) }}>预览</Button>
                                            ):(
                                                <Button type="default" icon="upload" onClick={()=>{ this.setState({showUploader: true}) }}>替换</Button>
                                            )
                                        }

                                    </ButtonGroup>
                                </div>

                                    {
                                        this.state.showUploader ? (
                                            <div key="5">
                                                <QiniuUploaderRewrite  {...this.props}/>
                                            </div>
                                        ):(
                                            <div key="5" className="file-preview-content">{this.getContentPreview( this.props.item.mimeType, this.props.item.key )}</div>
                                        )
                                    }


                                <div key="6" style={{textAlign:'center'}}>

                                    <Button type="default" style={{marginLeft:8}}  icon="download" onClick={this.download}></Button>
                                    <Button type="default" style={{marginLeft:8}}  icon="eye" onClick={this.preview}>打开</Button>
                                    <Button type="primary" style={{marginLeft:8}} icon="copy"  onClick={this.copyToClipboard.bind(this, this.props.domain + this.props.item.key)}>复制链接</Button>
                                </div>

                            </QueueAnim>
                        </div>
                    </div>
                </QueueAnim>
            ): null
    }
});

export default QiniuList;
