import React from 'react';
import { Input, Button, Steps, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import OAForm, {
  DatePicker,
  SearchTable,
} from '../../../components/OAForm';
import ListForm from './listForm';
// import { unicodeFieldsError } from '../../../utils/utils';
const { Step } = Steps;
const FormItem = OAForm.Item;
@OAForm.create()
@connect(({ event, buckle, loading }) => ({
  finalStaff: event.finalStaff,
  buckleInfo: buckle.buckleGropusDetails,
  loading: (
    loading.effects['buckle/addBuckle']
    ||
    loading.effects['buckle/fetchBuckleGroupsInfo']
  ),
  finalLoading: loading.effects['event/fetchFinalStaff'],
}))
export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listFormValue: [{}],
      eventsError: {},
      current: 0,
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
      this.setState({ eventsError: error, current: 0 });
    }
  }

  handleError = (error) => {
    const { onError } = this.props;
    onError(error, this.extraError);
  }

  next = () => {
    const { listFormValue } = this.state;
    if (!listFormValue.length) {
      message.error('事件不能为空，请添加事件');
      return;
    }
    const eventsError = {};
    listFormValue.forEach((item, index) => {
      const temp = {};
      if (!item.event_id) {
        temp.event_id = { errors: [new Error('请选择事件')] };
      }
      if (!item.participants || !item.participants.length) {
        temp.participants = { errors: [new Error('请选择参与人')] };
      }
      if (Object.keys(temp).length) {
        eventsError[index] = temp;
      }
    });
    if (!Object.keys(eventsError).length) {
      this.setState({ current: 1 });
    } else {
      this.setState({ eventsError });
    }
  }

  handleSubmit = (values) => {
    const { dispatch } = this.props;
    const { listFormValue } = this.state;
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
  }


  fetchFianl = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'event/fetchFinalStaff', payload: params });
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
        rangeFilters: true,
      },
      {
        width: 100,
        title: 'A分减分上限',
        dataIndex: 'point_a_deducting_limit',
        rangeFilters: true,
      },
      {
        width: 100,
        title: 'B分加分上限',
        dataIndex: 'point_b_awarding_limit',
        rangeFilters: true,
      },
      {
        width: 100,
        title: 'B分减分上限',
        dataIndex: 'point_b_deducting_limit',
        rangeFilters: true,
      },
    ];
    return tableProps;
  }

  render() {
    const { form: { getFieldDecorator }, buckleInfo, onSubmit, validatorRequired } = this.props;
    const { listFormValue, eventsError, current } = this.state;
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

        <Steps current={current} style={{ marginBottom: 20 }}>
          <Step title="添加事件" />
          <Step title="编辑主题" />
        </Steps>
        <div style={{ display: current === 0 ? 'block' : 'none' }}>
          <ListForm
            errors={eventsError}
            initialValue={id ? (formFieldsValue.logs || []) : listFormValue}
            onChange={this.handleListFormChange}
            style={{ width, marginTop: 10 }}
            placeholder="添加事件"
          />
        </div>
        <OAForm
          hideRequiredMark
          onSubmit={onSubmit(this.handleSubmit)}
          style={{ padding: 10, width, display: current === 1 ? 'block' : 'none' }}
        >
          <FormItem label="主题" {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: formFieldsValue.title || '',
              rules: [validatorRequired],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="事件日期" {...formItemLayout}>
            {getFieldDecorator('executed_at', {
              initialValue: formFieldsValue.executed_at || moment().format('L'),
              rules: [validatorRequired],
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
              rules: [validatorRequired],
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
              rules: [validatorRequired],
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
          {
            current === 1
            && (
              <React.Fragment>
                <FormItem style={{ textAlign: 'right' }}>
                  <Button
                    style={{ width: 60 }}
                    onClick={() => {
                      this.setState({ current: 0 });
                    }}
                  >上一步
                  </Button>
                  <Button style={{ width: 120, marginLeft: 20 }} type="primary" htmlType="submit" >提交</Button>
                </FormItem>
              </React.Fragment>
            )
          }
        </OAForm>
        {
          current === 0
          && (
            <React.Fragment>
              <FormItem style={{ textAlign: 'right', marginTop: 20 }}>
                <span id="ccc" style={{ fontSize: 12, color: '#969696', marginRight: 10 }}>
                  <span style={{ marginRight: 30 }}>事件数量：{listFormValue.length}</span>
                  <span>总人次：{staffNumber}</span>
                </span>
                <Button
                  type="primary"
                  style={{ width: 120 }}
                  onClick={() => this.next()}
                >下一步
                </Button>
              </FormItem>
            </React.Fragment>
          )
        }
      </div>
    );
  }
}
