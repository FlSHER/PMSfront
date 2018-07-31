import React from 'react';
import { Input, Button, Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import OAForm from '../../../components/OAForm';
import ListForm from './listForm';
// import { unicodeFieldsError } from '../../../utils/utils';

const FormItem = OAForm.Item;
const {
  DatePicker,
  SearchTable,
} = OAForm;
@OAForm.create({
  onValuesChange(props, fieldValue) {
    const [name] = Object.keys(fieldValue);
    props.setFiedError(name, null);
  },
})
@connect(({ event, buckle, loading }) => ({
  finalStaff: event.finalStaff,
  buckleInfo: buckle.buckleGropusDetails,
  loadingInfo: loading.effects['buckle/fetchBuckleGroupsInfo'],
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
      eventsError: {},
    };
  }

  componentDidMount() {
    const { params } = { ...(this.props.match || { params: {} }) };
    const { id } = params;
    if (id) {
      this.fetchInfo(id);
    }
  }

  fetchInfo = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'buckle/fetchBuckleGroupsInfo',
      payload: { id },
    });
  }

  handleListFormChange = (params, index) => {
    const { listFormValue } = this.state;
    let newListValue = [...listFormValue];
    if (!params) {
      newListValue = newListValue.filter((_, i) => i !== index);
    } else {
      newListValue[index] = {
        ...params,
        event_id: params.event_id ? params.event_id.id : '',
      };
    }
    this.setState({ listFormValue: [...newListValue] });
  }

  extraError = (name, error) => {
    const { setFields } = this.props.form;
    if (name === 'final_approver_name') {
      setFields({ last: error });
    } else if (name === 'first_approver_name') {
      setFields({ first: error });
    } else if (name === 'events') {
      this.setState({ eventsError: error });
    }
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error, this.extraError);
  }

  handleSubmit = () => {
    const { form: { validateFields }, dispatch } = this.props;
    const { listFormValue } = this.state;
    validateFields((_, values) => {
      const events = [];
      listFormValue.forEach((item) => {
        if (Object.keys(item).length) {
          events.push(item);
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
      params.event_count = events.length;
      params.participant_count = 0;
      listFormValue.forEach((item) => {
        if (item && item.participants) {
          params.participant_count += item.participants.length;
        }
      });
      delete params.first;
      delete params.last;
      dispatch({
        type: 'buckle/addBuckle',
        payload: params,
        onError: this.handleError,
        onSuccess: (result) => {
          dispatch(routerRedux.push(`/reward/buckle/success/${result.id}`));
        },
      });
    });
  }


  fetchFianl = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'event/fetchFinalStaff', payload: params });
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
    const { form: { getFieldDecorator }, buckleInfo, loadingInfo, loading } = this.props;
    const { listFormValue, eventsError } = this.state;
    const userInfo = window.user || {};
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const width = 670;
    let staffNumber = 0;
    listFormValue.forEach((item) => {
      if (item && item.participants) {
        staffNumber += item.participants.length;
      }
    });

    const { params } = { ...(this.props.match || { params: {} }) };
    const { id } = params;
    let formFieldsValue = {};
    if (buckleInfo[id]) {
      formFieldsValue = { ...buckleInfo[id] };
    }
    return (
      <div style={{ width, margin: '0 auto' }}>
        <Spin spinning={loadingInfo || loading || false}>
          <ListForm
            errors={eventsError}
            initialValue={id ? (formFieldsValue.logs || []) : listFormValue}
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
                initialValue: formFieldsValue.title || '',
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem label="事件时间" {...formItemLayout}>
              {getFieldDecorator('executed_at', {
                initialValue: formFieldsValue.executed_at || moment().format('L'),
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
                initialValue: {
                  first_approver_sn: formFieldsValue.first_approver_sn || userInfo.staff_sn || '',
                  first_approver_name: formFieldsValue.first_approver_name || userInfo.realname || '',
                },
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
                initialValue: formFieldsValue.final_approver_sn ? {
                  final_approver_sn: formFieldsValue.final_approver_sn,
                  final_approver_name: formFieldsValue.final_approver_name,
                } : {},
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
            <FormItem label="抄送人" {...formItemLayout} >
              {getFieldDecorator('addressees', {
                initialValue: formFieldsValue.addressees || [],
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
                initialValue: formFieldsValue.remark || '',
              })(
                <Input.TextArea placeholder="请输入备注说明......" style={{ height: 90 }} />
              )}
            </FormItem>
            <FormItem style={{ left: '50%', marginLeft: '-60px' }}>
              <Button style={{ width: 120 }} type="primary" htmlType="submit" onClick={this.handleSubmit}>提交</Button>
            </FormItem>
          </OAForm>
        </Spin>
      </div>
    );
  }
}
