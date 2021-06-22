import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Form, Switch } from 'antd';
import { DeleteOutlined, } from '@ant-design/icons';

import './index.css'

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const list = [
  {
    key: 0,
    src_ip: 'https://developer.daily.tuya-inc.cn/',
    dest_ip: 'http://localhost:3000',
    remark: '日常',
    enabled: false
  },
  {
    key: 1,
    src_ip: 'https://developer.daily.tuya-inc.cn/',
    dest_ip: 'http://127.0.0.1:3000',
    remark: '日常',
    enabled: false
  },
  {
    key: 2,
    src_ip: 'https://developer.wgine.com',
    dest_ip: 'http://localhost:3000',
    remark: '预发',
    enabled: true
  },
  {
    key: 3,
    src_ip: 'https://developer.wgine.com',
    dest_ip: 'http://127.0.0.1:3000',
    remark: '预发',
    enabled: true
  },
]

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} 不能为空`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '源地址',
        dataIndex: 'src_ip',
        width: '30%',
        editable: true,
      },
      {
        title: '代理地址',
        dataIndex: 'dest_ip',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        editable: true,
      },
      {
        title: '是否启用',
        dataIndex: 'enabled',
        render: (text, record, index) => (
          <Switch checked={text} onChange={(e) => this.onChange(e, record)} />
        )
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        render: (_, record) =>
          this.state.dataSource.length >= 1 ? (
            <DeleteOutlined
              onClick={() => this.handleDelete(record.key)}
              style={{ color: 'red', cursor: 'pointer' }}
            />
          ) : null,
      },
    ];
    this.state = {
      dataSource: [],
      count: 2,
    };
  }

  onChange = (e, record) => {
    const newData = [...this.state.dataSource];
    newData.splice(record.key, 1, { ...record, enabled: e });
    this.setState({ dataSource: newData })
    chrome.storage.sync.set({ key: newData });
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    }, () => {
      chrome.storage.sync.set({ key: this.state.dataSource });
    });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      src_ip: "",
      dest_ip: "",
      enabled: true,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
    chrome.storage.sync.set({ key: newData });
  };

  componentDidMount() {
    // 兼容在开发模式下编辑展示
    if (!chrome.storage) {
      this.setState({
        dataSource: [list]
      })
    } else {
      chrome.storage.sync.get(['key'], (result) => {
        this.setState({
          dataSource: list
        })
      });
    }
  }

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            float: 'left',
            marginBottom: 16,
          }}
        >
          新增
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
      </>
    );
  }
}
