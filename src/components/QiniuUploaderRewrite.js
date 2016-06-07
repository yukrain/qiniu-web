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
            token:''
        };
    },

    componentWillMount () {
        //初始化的时候获取token
        if(!this.state.token){
            reqwest({
                url:'/api/token',
                method: 'get',
                data: {
                    bucket: this.props.bucket,
                    key: this.props.item.key
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
            multiple: false,
            showUploadList: false,
            data:{
                token: this.state.token,
                key:   this.props.item.key,
            },
            beforeUpload: (file) => {
                return new Promise( (resolve)=> {
                    confirm({
                        title: '覆盖上传',
                        content: <p>用 <span className="text-danger">{file.name} </span> 覆盖文件吗?</p> ,
                        onOk:() => {
                            resolve(file);
                        }
                    });

                });
            },
            onChange: this.handleChange
        };
        return  <div  className="file-uploader file-uploader-rewrite" >
                <Dragger {...props} >
                    <div style={{ marginTop: 16, height: 95 }}>
                        <p className="ant-upload-drag-icon">
                            <span  className="text-danger"> <Icon type="cloud-upload-o"/></span>

                        </p>
                        <p className="ant-upload-text"><span >覆盖上传</span> </p>
                        <p className="ant-upload-hint "> <span className="text-danger">{this.props.item.key}</span> </p>
                    </div>
                </Dragger>
            </div>
    }
});

