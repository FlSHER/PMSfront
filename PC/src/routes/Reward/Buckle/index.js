import React from 'react';
import { Input, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import OAForm from '../../../components/OAForm';
import ListForm from './listForm';
import { dotFieldsValue } from '../../../utils/utils';

const FormItem = OAForm.Item;
const {
  DatePicker,
  SearchTable,
} = OAForm;
@OAForm.create()
@connect(({ event, loading }) => ({
  listFormValue: event.listFormValue,
  finalStaff: event.finalStaff,
  loading: loading.effects['buckle/addBuckle'],
  finalLoading: loading.effects['event/fetchFinalStaff'],
}))
export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    const { form, bindForm } = props;
    bindForm(form);
    this.state = {
      listFormValue: [{}],
    };
  }

  handleListFormChange = (params, index) => {
    const { listFormValue } = this.state;
    let newListValue = [...listFormValue];
    if (!params) {
      newListValue = newListValue.filter((_, i) => i !== index);
    } else {
      newListValue[index] = params;
    }
    this.setState({ listFormValue: [...newListValue] });
  }

  handleError = (error) => {
    const fieldError = dotFieldsValue(error);
    console.log(fieldError);
  }

  handleSubmit = () => {
    const { form: { validateFields }, dispatch } = this.props;
    const { listFormValue } = this.state;
    validateFields((_, values) => {
      const events = [];
      listFormValue.forEach((item) => {
        if (Object.keys(item).length) {
          events.push({
            ...item,
            event_id: item.event_id.event_id,
          });
        } else {
          events.push({
            description: '',
            event_id: '',
            participants: [],
          });
        }
      });
      const params = {
        events,
        ...values,
      };
      params.first_approver_sn = params.first.first_approver_sn || '';
      params.first_approver_name = params.first.first_approver_name || '';
      params.final_approver_sn = params.last.final_approver_sn || '';
      params.final_approver_name = params.last.final_approver_name || '';
      delete params.first;
      delete params.last;
      dispatch({
        type: 'buckle/addBuckle',
        payload: params,
        onError: this.handleError,
      });
    });
  }


  fetchFianl = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'event/fetchFinalStaff' });
  }

  makeFormProps = () => {
    const { form, loading } = this.props;
    const response = {
      form,
      loading,
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


  makeLastApproverProps = () => {
    const { finalStaff, finalLoading } = this.props;
    const tableProps = {
      index: 'staff_sn',
      data: finalStaff,
      loading: finalLoading,
      scroll: { x: 700 },
      fetchDataSource: this.fetchFianl,
    };
    tableProps.columns = [
      {
        title: '编号',
        dataIndex: 'staff_sn',
        width: 100,
        sorter: true,
        searcher: true,
      },
      {
        title: '姓名',
        dataIndex: 'staff_name',
        width: 150,
        searcher: true,
      },
      {
        width: 100,
        title: 'A分加分上限',
        dataIndex: 'point_a_awarding_limit',
        rangerFilter: true,
      },
      {
        width: 100,
        title: 'A分减分上限',
        dataIndex: 'point_a_deducting_limit',
        rangerFilter: true,
      },
      {
        width: 100,
        title: 'B分加分上限',
        dataIndex: 'point_b_awarding_limit',
        rangerFilter: true,
      },
      {
        width: 100,
        title: 'B分减分上限',
        dataIndex: 'point_b_deducting_limit',
        rangerFilter: true,
      },
    ];
    return tableProps;
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { listFormValue } = this.state;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const width = 670;
    let staffNumber = 0;
    listFormValue.forEach((item) => {
      if (item && item.workingStaff) {
        staffNumber += item.workingStaff.length;
      }
    });
    return (
      <div style={{ marginTop: 20 }}>
        <div style={{ width, margin: '0 auto' }}>
          <ListForm
            initialValue={listFormValue}
            onChange={this.handleListFormChange}
            style={{ width, marginTop: 10 }}
            placeholder="添加事件"
          />
          <div id="ccc" style={{ fontSize: 12, color: '#969696', padding: '20px 0 20px 100px' }}>
            <span style={{ marginRight: 30 }}>事件数量：{listFormValue.length}</span>
            <span>总人次：{staffNumber}</span>
          </div>
          <OAForm {...this.makeFormProps()} style={{ padding: 10, width }}>
            <FormItem label="主题" {...formItemLayout}>
              {getFieldDecorator('title', {
                initialValue: '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="事件时间" {...formItemLayout}>
              {getFieldDecorator('executed_at', {
                initialValue: '',
              })(
                <DatePicker
                  disabledDate={(currentData) => {
                    return currentData > moment();
                  }}
                  placeholder="请输入"
                  showToday={false}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            <FormItem label="初审人" {...formItemLayout} >
              {getFieldDecorator('first', {
                initialValue: {},
              })(
                <SearchTable.Staff
                  mode="user"
                  name={{
                    first_approver_sn: 'staff_sn',
                    first_approver_name: 'realname',
                  }}
                  showName="first_approver_name"
                />
              )}
            </FormItem>
            <FormItem label="终审人" {...formItemLayout} >
              {getFieldDecorator('last', {
                initialValue: {},
              })(
                <SearchTable
                  mode="user"
                  name={{
                    final_approver_sn: 'staff_sn',
                    final_approver_name: 'staff_name',
                  }}
                  showName="final_approver_name"
                  tableProps={{
                    ...this.makeLastApproverProps(),
                  }}
                />
              )}
            </FormItem>
            <FormItem label="参与人" {...formItemLayout} >
              {getFieldDecorator('addressees', {
                initialValue: [],
              })(
                <SearchTable.Staff
                  mode="user"
                  multiple
                  name={{ staff_sn: 'staff_sn', staff_name: 'realname' }}
                  showName="staff_name"
                />
              )}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: '',
              })(
                <Input.TextArea placeholder="请输入备注说明......" style={{ height: 90 }} />
              )}
            </FormItem>
            <FormItem style={{ left: '50%', marginLeft: '-60px' }}>
              <Button style={{ width: 120 }} type="primary" htmlType="submit" onClick={this.handleSubmit}>提交</Button>
            </FormItem>
          </OAForm>
        </div>
      </div>
    );
  }
}
