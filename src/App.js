import React, { Component } from 'react';
import './App.css';
import { Tabs } from 'element-react';
import Histogram from './components/Histogram'

import 'element-theme-default';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Tabs activeName="1" onTabClick={ (tab) => console.log(tab.props.name) }>
          <Tabs.Pane label="数据展示" name="1"><Histogram></Histogram></Tabs.Pane>
          <Tabs.Pane label="配置管理" name="2">配置管理</Tabs.Pane>
          <Tabs.Pane label="系统信息" name="3">角色管理</Tabs.Pane>
        </Tabs>
      </div>
    );
  }
}

export default App;
