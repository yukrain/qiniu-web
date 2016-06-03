/**
 * Created by YUK on 16/6/3.
 */
import { Card ,Icon } from 'antd';
import moment from 'moment';

let QiniuList = React.createClass({

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
    render () {
        var myclass =  this.props.disabled ? 'disabled': '';
        return <div className={'qiniu-card ' + myclass} onClick={this.handleClick}>
                <div className="qiniu-card-box">
                    <div className="qiniu-card-folder">
                        {
                            this.props.type == 'open'?  <i className='iconfont icon-folder-open card-icon'></i>:  <i className='iconfont icon-folder card-icon'></i>
                        }
                        <p>
                            {this.props.folder}
                        </p>
                    </div>
                </div>
            </div>
    }
});

export default QiniuList;
