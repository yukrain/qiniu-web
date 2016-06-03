import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import './index.css';


const target = document.getElementById('body');
import AppView from './components/App';
ReactDOM.render(<div>
            <AppView />
        </div>, target)
