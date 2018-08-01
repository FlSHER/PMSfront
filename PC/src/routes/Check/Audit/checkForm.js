import React from 'react';
import { InputNumber, Input } from 'antd';
import { connect } from 'dva';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import OAForm from '../../../components/OAForm';
import styles from './index.less';
import { getBuckleTitle } from '../../../utils/utils';

const FormItem = OAForm.Item;
const {
  OAModal,
} = OAForm;

@connect(({ loading }) => ({
  approveLoading: loading.effects['buckle/approve'],
  rejectLoading: loading.effects['buckle/reject'],
}))
@OAForm.create()
export default class extends React.PureComponent {
  componentWillMount() {
    const { bindForm, form } = this.props;
    bindForm(form);
  }

  fetch = (params, type) => {
    const { dispatch, onError, editInfo } = this.props;
    dispatch({
      type,
      payload: {
        id: editInfo.id,
        ...params,
      },
      onError,
      onSuccess: () => {
        const { onCancel, onClose } = this.props;
        onCancel(false);
        onClose(false);
      },
    });
  }

  handleSubmit = (params) => {
    const actionId = this.props.title;
    const newParams = { ...params };
    if (actionId === 1) {
      delete newParams.remark;
      newParams.type = true;
      newParams.first_approve_remark = params.remark;
      this.fetch(newParams, 'buckle/approve');
    } else if (actionId === 2) {
      delete newParams.remark;
      newParams.type = false;
      newParams.final_approve_remark = params.remark;
      this.fetch(newParams, 'buckle/approve');
    } else {
      delete newParams.remark;
      newParams.remark = params.remark;
      this.fetch(newParams, 'buckle/reject');
    }
  }


  render() {
    const {
      visible,
      onCancel,
      form,
      title,
      editInfo,
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const newTitle = getBuckleTitle(title);
    const loading = this.props.approveLoading || this.props.rejectLoading;
    return (
      <OAModal
        width={550}
        form={form}
        loading={loading}
        visible={visible}
        title={`${newTitle}`}
        onSubmit={this.handleSubmit}
        onCancel={() => onCancel(false)}
      >
        <FormItem label="审批意见" {...formItemLayout}>
          {getFieldDecorator('remark', {
            initialValue: '',
          })(
            <Input.TextArea style={{ height: 90 }} placeholder="请输入主题" />
          )}
        </FormItem>
        {title === 2 && (
          <FormItem label="配置分值" {...formItemLayout}>
            <FormItem style={{ width: 210, float: 'left' }}>
              <span className={styles.customerPoint}>
                <span><Ellipsis length={3}>{editInfo.recorder_name}</Ellipsis>（记录人）</span>
                {getFieldDecorator('recorder_point', {
                  initialValue: '',
                })(
                  <InputNumber placeholder="请输入" style={{ width: 90 }} />
                )}
              </span>
            </FormItem>
            <FormItem style={{ width: 210, float: 'left' }}>
              <span className={styles.customerPoint}>
                <span><Ellipsis length={3}>{editInfo.first_approver_name}</Ellipsis>（初审人）</span>
                {getFieldDecorator('first_approver_point', {
                  initialValue: '',
                })(
                  <InputNumber placeholder="请输入" style={{ width: 90 }} />
                )}
              </span>
            </FormItem>
          </FormItem>
        )}
      </OAModal>
    );
  }
}
