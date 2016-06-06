/**
 * Created by YUK on 16/6/3.
 */
import { Upload, Icon ,Modal,Input} from 'antd';
const Dragger = Upload.Dragger;
import reqwest from 'reqwest';
const confirm = Modal.confirm;


let QiniuList = React.createClass({
    getInitialState() {
        return {
            token:'',
            prefix: this.props.prefix,
            key: ''
        };
    },
    componentWillReceiveProps(nextProps){
        console.log( 'componentWillReceiveProps' )
        this.setState({
            prefix: nextProps.prefix
        })
    },
    componentWillMount () {

    },

    componentDidMount() {

    },

    handleChangeKey(e){
        console.log(e)
        this.setState({
            key:  e.target.value
        })
    },

    render () {
        let props = {
            action: 'http://upload.qiniu.com/',
            data:{
                token: this.state.token,
                key:  this.state.key,
            },
            beforeUpload: (file) => {
                return new Promise( (resolve)=> {
                    reqwest({
                        url:'/api/token',
                        method: 'get',
                        data: {
                            bucket: this.props.bucket
                        },
                        crossOrigin: true,
                        type: 'json',
                        error: (err) => {
                        },
                        success: (result) => {
                            this.setState({
                                token: result.token,
                                key: this.props.prefix + file.name
                            });

                            confirm({
                                title: '新建文件',
                                content: <div>
                                    <Input placeholder="文件路径" value={this.state.key} onChange={this.handleChangeKey}  />
                                </div>,
                                onOk() {
                                    resolve(file);
                                },
                                onCancel() {},
                            });


                        }
                    });
                });
            },
        }
        return  <div  className="file-uploader" >
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="plus" />
                    </p>
                    <p className="ant-upload-text">上传文件到此目录</p>
                    <p className="ant-upload-hint">支持单个或批量拖拽上传</p>
                </Dragger>
            </div>
    }
});

export default QiniuList;
