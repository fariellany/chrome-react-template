import React from 'react';
import { Tabs } from 'antd'
import Table from './Table'
import './Popup.css';
import 'antd/dist/antd.css'

const { TabPane } = Tabs;

// 通讯交流
// https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="cookie代理" key="1">
            <Table />
          </TabPane>
        </Tabs>
      </header>
    </div>
  );
};

export default Popup;
