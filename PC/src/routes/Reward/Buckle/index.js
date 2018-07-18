import React from 'react';
import { Input } from 'antd';
import { connect } from 'dva';
import OAForm from '../../../components/OAForm';
import ListForm from './listForm';


const data = [
  {
    staff_sn: 110105,
    realname: '张博涵',
    brand_id: '总监',
    position_id: '总监',
    department_id: '总监',
    status_id: '在职',
  },
  {
    staff_sn: 110106,
    realname: '蒋玉元',
    brand_id: '总监',
    position_id: '总监',
    department_id: '总监',
    status_id: '在职',
  },
];


const FormItem = OAForm.Item;
const {
  DatePicker,
  SearchTable,
} = OAForm;
@connect()
@OAForm.create()
export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    const { form, bindForm } = props;
    bindForm(form);
    this.state = {
      eventNumber: 1,
      listFormValue: [{ key: 1 }],
    };
  }

  countEventNumber = (eventNumber) => {
    this.setState({ eventNumber });
  }

  handleListFormChange = (params, index) => {
    const newListValue = [...this.state.listFormValue];
    newListValue[index] = params;
    this.setState({ listFormValue: [...newListValue] });
  }

  makeFormProps = () => {
    const { form } = this.props;
    const response = {
      form,
    };
    return response;
  }

  makeColumns = () => {
    return [
      {
        title: '编号',
        dataIndex: 'staff_sn',
        searcher: true,
      }, {
        title: '姓名',
        align: 'center',
        dataIndex: 'realname',
        searcher: true,
      }, {
        title: '品牌',
        align: 'center',
        dataIndex: 'brand_id',
      }, {
        title: '职位',
        dataIndex: 'position_id',
      }, {
        title: '部门',
        dataIndex: 'department_id',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'status_id',
        align: 'center',
      },
    ];
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { listFormValue, eventNumber } = this.state;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const width = 670;
    let staffNumber = 0;
    listFormValue.forEach((item) => {
      if (item.workingStaff) {
        staffNumber += item.workingStaff.length;
      }
    });
    return (
      <div style={{ marginTop: 20 }}>
        <div style={{ width, margin: '0 auto' }}>
          <ListForm
            countNumber={this.countEventNumber}
            initialValue={listFormValue}
            onChange={this.handleListFormChange}
            style={{ width, marginTop: 10 }}
            placeholder="添加事件"
          />
          <div style={{ fontSize: 12, color: '#969696', padding: '20px 0 20px 100px' }}>
            <span style={{ marginRight: 30 }}>事件数量：{eventNumber}</span>
            <span>总人次：{staffNumber}</span>
          </div>
          <OAForm {...this.makeFormProps()} style={{ padding: 10, width }}>
            <FormItem label="主题" {...formItemLayout}>
              {getFieldDecorator('input', {})(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="事件时间" {...formItemLayout}>
              {getFieldDecorator('datePicker', {})(
                <DatePicker
                  placeholder="请输入"
                  showToday={false}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            <FormItem label="初审人" {...formItemLayout} >
              <SearchTable
                mode="user"
                name={{ staff_sn: 'staff_sn', realname: 'realname' }}
                value={{}}
                showName="realname"
                tableProps={{
                  index: 'staff_sn',
                  data,
                  total: null,
                  loading: false,
                  multiple: true,
                  columns: this.makeColumns(),
                }}
              />
            </FormItem>
            <FormItem label="终审人" {...formItemLayout} >
              <SearchTable
                mode="user"
                name={{ staff_sn: 'staff_sn', realname: 'realname' }}
                value={{}}
                showName="realname"
                tableProps={{
                  index: 'staff_sn',
                  data,
                  total: null,
                  loading: false,
                  multiple: true,
                  columns: this.makeColumns(),
                }}
              />
            </FormItem>
            <FormItem label="参与人" {...formItemLayout} >
              <SearchTable
                mode="user"
                multiple
                name={{ staff_sn: 'staff_sn', realname: 'realname' }}
                value={[]}
                showName="realname"
                tableProps={{
                  index: 'staff_sn',
                  data,
                  total: null,
                  loading: false,
                  multiple: true,
                  columns: this.makeColumns(),
                }}
              />
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('textArea', {})(
                <Input.TextArea placeholder="请输入备注说明......" style={{ height: 90 }} />
              )}
            </FormItem>
          </OAForm>
        </div>
      </div>
    );
  }
}
