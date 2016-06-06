/**
 * Created by YUK on 16/6/3.
 */
import { message, Upload, Icon , Modal, Input} from 'antd';
const Dragger = Upload.Dragger;
import reqwest from 'reqwest';
const confirm = Modal.confirm;

export default React.createClass({
    getInitialState() {
        return {
            token:'',
            key: '',
            uploadUid: '',
            keys:{

            }
        };
    },


    componentWillMount () {
        //初始化的时候获取token
        if(!this.state.token){
            reqwest({
                url:'/api/token',
                method: 'get',
                data: {
                    bucket: this.props.bucket
                },
                crossOrigin: true,
                type: 'json',
                error: (err) => {
                    message.error('获取token失败');
                },
                success: (result) => {
                    this.setState({
                        token: result.token
                    });
                }
            });
        }
    },

    componentDidMount() {

    },

    handleChangeKey(file, e){
        this.setState({
            uploadUid: file.uid,
            key:  e.target.value
        })
    },

    handleChange(info){
        console.log(info);

        if(info.file.status == 'done'){
            console.log('done')
            message.success('上传成功');
            if(this.props.onSuccess){
                this.props.onSuccess();
            }

        }
        if(info.file.status == 'error'){
            message.error('上传失败');
        }

    },

    render () {
        let props = {
            action: 'http://upload.qiniu.com/',
            multiple: true,
            data:{
                token: this.state.token,
                key:  this.state.key,
            },
            beforeUpload: (file) => {
                return new Promise( (resolve)=> {
                    let new_key = this.props.prefix + file.name;  //设置默认的输入框内容

                    confirm({
                        title: '设置 '+ file.name +' 文件路径',
                        content: <div>  <Input defaultValue={new_key} onChange={this.handleChangeKey.bind(this, file)} />
                        </div>,
                        onOk:() => {
                            if( this.state.uploadUid !== file.uid ){    //设置默认的文件key
                                this.setState({
                                    key: new_key
                                });
                            }
                            resolve(file);
                        },
                        onCancel:()=>{
                            this.setState({
                                key: ''
                            });
                        }
                    });

                });
            },
            onChange: this.handleChange
        };
        return  <div  className="file-uploader" >

                <Dragger {...props} >
                    <div style={{ marginTop: 16, height: 140 }}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">上传文件到此目录</p>
                        <p className="ant-upload-hint">支持单个或批量拖拽上传</p>
                    </div>
                </Dragger>
            </div>
    }
});

