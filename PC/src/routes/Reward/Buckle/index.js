import React from 'react';
import { Input, Select } from 'antd';
import { connect } from 'dva';
import OAForm from '../../../components/OAForm';
import WorkingStaff from '../../common/Table/workingStaff';
import styles from './index.less';

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


const { TextArea } = Input;
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
    const style = { style: { width: 560 } };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div style={{ padding: 10 }}>
        <OAForm {...this.makeFormProps()}>
          <FormItem label="事件标题" {...formItemLayout}>
            {getFieldDecorator('Select', {})(
              <Select placeholder="请输入" {...style} />
            )}
          </FormItem>
          <FormItem label="事件描述" {...formItemLayout}>
            {getFieldDecorator('textArea', {})(
              <TextArea placeholder="请输入" {...style} />
            )}
          </FormItem>
          <FormItem label="事件时间" {...formItemLayout}>
            {getFieldDecorator('datePicker', {})(
              <DatePicker
                placeholder="请输入"
                {...style}
                showToday={false}
                dropdownClassName={styles.calendar}
                popupStyle={{ width: 560 }}
              />
            )}
          </FormItem>
          <FormItem label="事件配置" {...formItemLayout} >
            <WorkingStaff />
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
        </OAForm>
      </div>
    );
  }
}
