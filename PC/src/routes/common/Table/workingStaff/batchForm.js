import React from 'react';
import { Input, Icon } from 'antd';
import OAForm, { OAModal } from '../../../../components/OAForm';
import styles from './index.less';

const FormItem = OAForm.Item;

@OAForm.create()
export default class BatchForm extends React.PureComponent {
  makeModalProps = () => {
    const { visible, onCancel, handleChange, onSubmit } = this.props;
    const response = {
      visible,
      width: 550,
      title: '批量修改',
      onSubmit: onSubmit(handleChange),
      onCancel: () => onCancel(false),
    };
    return response;
  }

  render() {
    const { form: { getFieldDecorator }, pointRange } = this.props;
    const style = { width: '90px' };
    return (
      <OAModal
        formProps={{ layout: 'inline' }}
        {...this.makeModalProps()}
      >
        <FormItem label="单次A分">
          {getFieldDecorator('point_a', {
          })(
            <Input type="number" placeholder="请输入" style={style} />
          )}
        </FormItem>
        <FormItem label="单次B分">
          {getFieldDecorator('point_b', {
          })(
            <Input type="number" placeholder="请输入" style={style} />
          )}
        </FormItem>
        <FormItem label="次数">
          {getFieldDecorator('count', {
          })(
            <Input type="number" placeholder="请输入" style={style} />
          )}
        </FormItem>
        <div className={styles.footers}>
          <span><Icon type="exclamation-circle-o" /> 分值范围</span>
          <span> A分：{pointRange.point_a} </span>
          <span> B分：{pointRange.point_b} </span>
        </div>
      </OAModal>
    );
  }
}

