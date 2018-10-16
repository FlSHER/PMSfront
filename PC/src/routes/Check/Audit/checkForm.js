import React from 'react';
import { Input } from 'antd';
import { connect } from 'dva';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import OAForm, { OAModal } from '../../../components/OAForm';
// import styles from './index.less';
import { getBuckleTitle } from '../../../utils/utils';

const FormItem = OAForm.Item;

@OAForm.create()
@connect(({ loading }) => ({
  loading: (
    loading.effects['buckle/approve']
    ||
    loading.effects['buckle/reject']
  ),
}))
export default class extends React.PureComponent {
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
        onClose(false, update);
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
      // editInfo,
      loading,
      validateFields,
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const newTitle = getBuckleTitle(title);
    return (
      <OAModal
        width={550}
        form={form}
        loading={loading}
        visible={visible}
        title={`${newTitle}`}
        onSubmit={validateFields(this.handleSubmit)}
        onCancel={() => onCancel(false)}
      >
        <FormItem label="审批意见" {...formItemLayout}>
          {getFieldDecorator('remark', {
            initialValue: '',
          })(
            <Input.TextArea style={{ height: 90 }} placeholder="请输入审批意见" />
          )}
        </FormItem>
      </OAModal>
    );
  }
}
