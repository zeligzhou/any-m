import React, { Component } from 'react';
import './App.css';
import { Tabs } from 'element-react';

import 'element-theme-default';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Tabs activeName="2" onTabClick={ (tab) => console.log(tab.props.name) }>
          <Tabs.Pane label="用户管理" name="1">用户管理</Tabs.Pane>
          <Tabs.Pane label="配置管理" name="2">配置管理</Tabs.Pane>
          <Tabs.Pane label="角色管理" name="3">角色管理</Tabs.Pane>
          <Tabs.Pane label="定时补偿任务" name="4">定时补偿任务</Tabs.Pane>
        </Tabs>
      </div>
    );
  }
}

export default App;
