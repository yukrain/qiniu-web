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
            prefixDest: this.props.prefix
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

    handleChangePrefixDest( e){
        this.setState({
            prefixDest:  e.target.value
        })
    },


    batchMove(){

        confirm({
            title: '是否移动 '+ this.props.keys.length + ' 个文件到' ,
            content: <div>  <Input addonBefore="根目录 /"  defaultValue={this.props.prefix} onChange={this.handleChangePrefixDest} /></div>,
            onOk:()=>{

                return new Promise((resolve, reject) => {
                    if(new RegExp(/^\/.*/g).test(this.state.prefixDest)){
                        return message.error('不可以/作为开始路径');
                    }

                    if(!(this.state.prefixDest == ''|| new RegExp(/.*\/$/g).test(this.state.prefixDest))){
                       return message.error('必须以/结尾');
                    }

                    var moveKeys = [];
                    for(var src of this.props.keys){
                        var name = src.split('/').pop();
                        moveKeys.push([src, this.state.prefixDest + name]);
                    }

                    reqwest({
                        url:'/api/batchmove',
                        method: 'put',
                        data: {
                            bucket: this.props.bucket,
                            keys : moveKeys
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
                                resolve();
                            }else{
                                message.error('移动失败');
                            }
                        }
                    });

                });

            },
            onCancle : ()=>{
                this.setState({
                    prefixDest: this.props.prefix
                })
            }
        });
    },

    batchDelete(){
        confirm({
            title: '确认要删除'+ this.props.keys.length+'个文件吗?',
            onOk:()=>{
                reqwest({
                    url:'/api/batchdelete',
                    method: 'delete',
                    data: {
                        bucket: this.props.bucket,
                        keys: this.props.keys
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

    batchRefresh(){
        var urls = this.props.keys.map(item=>{
            return this.props.domain +  item
        });
        let hide = message.loading('正在加入刷新队列...', 0);
        reqwest({
            url:'/api/refresh',
            method: 'post',
            data: {
                urls: urls
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

    reset(){


    },
    render () {
        return  <QueueAnim className="demo-content"
                          key="demo"
                          type={['right', 'left']}
                          ease={['easeOutQuart', 'easeInOutQuart']}>
                    <div  className="file-preview" key="1">
                        <div>
                            <div className="copy-node">
                                <Input  id="copy-node" value=''/>
                            </div>
                            <QueueAnim key="demo" delay={50}
                                       type={['right', 'bottom']}>

                                <div className="file-preview-title" key="2">
                                    批量处理
                                </div>
                                <p className="text-bold text-danger" key="3">
                                    {
                                       this.props.keys.length == 0? '尚未选择':  `已选择 ${this.props.keys.length} 个文件`
                                    }
                                </p>

                                <div  className="file-preview-buttons"  key="4"  style={{textAlign:'center'}}>
                                    <ButtonGroup >
                                        <Button disabled={this.props.keys.length == 0}type="default" icon="delete"  onClick={this.batchDelete}>删除</Button>
                                        <Button disabled={this.props.keys.length == 0}type="default" icon="edit"  onClick={this.batchMove}>移动</Button>
                                        <Button disabled={this.props.keys.length == 0}type="default" icon="reload"  onClick={this.batchRefresh}>刷新</Button>
                                    </ButtonGroup>
                                </div>



                                <ul style={{marginTop:10}}  key="5">
                                    <QueueAnim  delay={50}
                                               type={['right', 'right']}>
                                    {
                                        this.props.keys.map(item=>{
                                            return  <li key={item} style={{marginTop:4}}><Icon type="link" /> {item}</li>
                                        })
                                    }
                                    </QueueAnim>
                                </ul>


                            </QueueAnim>
                        </div>
                    </div>
                </QueueAnim>
    }
});

export default QiniuList;
