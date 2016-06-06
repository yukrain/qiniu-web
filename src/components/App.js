import { Alert, Badge,Breadcrumb,  Radio, Table, Icon, Form,Affix, Modal, InputNumber, DatePicker, Spin, Row, Col, Select, Input, Button, message} from 'antd';
import QueueAnim from 'rc-queue-anim'
import reqwest from 'reqwest';
import moment from 'moment';
import QiniuCard from './QiniuCard';
import QiniuFolder from './QiniuFolder';
import QiniuPreview from './QiniuPreview';
import QiniuUploader from './QiniuUploader';


let QiniuList = React.createClass({

    getInitialState() {
        return {
            loading: true,
            bucket: 'dayu-static',
            date: moment().format('YYYY-MM-DD'),
            prefix: "",
            ret: {
                items: [],
                commonPrefixes: []
            },
            selectItem : {}
        };
    },

    componentWillMount () {
        this.fetchData('');
    },

    componentDidMount() {

    },

    fetchFather(){
        this.fetchData(  this.getParentsPrefix(this.state.prefix)[1] );
    },

    handleClickReload(){
        this.reloadData();
    },

    reloadData(){
        this.fetchData(this.state.prefix);
    },
    fetchData(prefix = ''){
        this.setState({loading: true});
        reqwest({
            url:'/api/list',
            method: 'get',
            data: {
                bucket: 'dayu-static',
                prefix:  prefix
            },
            crossOrigin: true,
            type: 'json',
            error: (err) => {
                message.error('加载失败');
                this.setState({
                    loading: false
                })
            },
            success: (result) => {
                message.success('刷新成功');
                this.setState({
                    loading: false,
                    ret: result.ret,
                    prefix: result.prefix,
                    domain: result.domain,
                    selectItem:{}
                })

            }
        });
    },

    getParentsPrefix(str){
        var str2 =  str.replace(/(.*)(\/.+)/g, "$1");
        if(str2 == str){
            return [str.split('/')[0],''];
        }else{
            return [str.split(str2 + '/')[1].split('/')[0], str2 + '/'];
        }
    },

    getAllParentsPrefixArray(str){
        var result = [];
        while( str.length > 0){
            var parent = this.getParentsPrefix(str);
            result.unshift([parent[0],str]);
            str = parent[1];
        }

        result.unshift(['根目录','']);
        return result;
    },

    handleSelect(item){
        this.setState({
            selectItem: item
        })
    },
    render () {
        const breadcrumbArray =   this.getAllParentsPrefixArray(this.state.prefix);

        const breadcrumb = breadcrumbArray.map(item=>{
            return  <Breadcrumb.Item href="javascript:void(0)" key={item[0]} onClick={this.fetchData.bind(this, item[1])}>{item[0]}</Breadcrumb.Item>
        });

        return <div className="ant-layout-aside">
            <div className="ant-layout-header">
                <span>七牛文件管理工具</span>

                <ul className="right">
                    <li>{this.state.date}</li>
                    <li>|</li>
                    <li>
                        <Badge dot>
                            <Icon type="mail" />
                        </Badge>
                    </li>
                </ul>
            </div>

            <div  className="ant-layout-main">
                <Row gutter={16}>
                    <Col className="gutter-row" span={1}>

                    </Col>
                    <Col className="gutter-row" span={16}>

                        <Row>
                            <Col span={20} style={{paddingLeft:10}}>
                                <Breadcrumb separator=">" >
                                    {breadcrumb}
                                </Breadcrumb>
                            </Col>
                            <Col span={4} style={{textAlign: "center"}}>
                                <Button  type="primary" icon="reload" onClick={this.handleClickReload} loading={this.state.loading}  >刷新</Button>
                            </Col>
                        </Row>


                        <div>
                            <div key="1">
                                {
                                    this.state.prefix == '' ?  <QiniuFolder key="1" disabled folder={this.state.bucket} type="open"/>:
                                        <QiniuFolder key="1" folder={'返回上级'} onClick={this.fetchFather} type="open"/>
                                }

                                {
                                    this.state.ret.commonPrefixes? this.state.ret.commonPrefixes.map( folder =>{
                                        return <QiniuFolder key={folder}  onClick={this.fetchData.bind(this, folder)} folder={folder} />

                                    }): null

                                }
                                {
                                    this.state.ret.items.map( item =>{
                                        return <QiniuCard checked={item.key == this.state.selectItem.key} onClick={this.handleSelect} domain={this.state.domain} key={item.key} item={item}/>

                                    })

                                }
                            </div>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={6} style={{paddingTop:32}}>

                        <QiniuUploader bucket={this.state.bucket}
                                       prefix={this.state.prefix}
                                       onSuccess = {this.reloadData}
                        />
                        <Affix offsetTop={10}>
                            <QiniuPreview key={this.state.selectItem.key}  onSuccess = {this.reloadData} bucket={this.state.bucket}  domain={this.state.domain} item={this.state.selectItem}/>
                        </Affix>


                    </Col>
                </Row>
            </div>
        </div>
    }
});

module.exports = QiniuList;
