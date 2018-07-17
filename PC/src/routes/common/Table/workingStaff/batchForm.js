import React from 'react';
import { Input } from 'antd';
import OAForm from '../../../../components/OAForm';

const FormItem = OAForm.Item;
const {
  OAModal,
} = OAForm;
@OAForm.create()
export default class BatchForm extends React.PureComponent {
  makeModalProps = () => {
    const { visible, onCancel, handleChange } = this.props;
    const response = {
      visible,
      width: 550,
      title: '批量修改',
      onSubmit: handleChange,
      onCancel: () => onCancel(false),
    };
    return response;
  }

  render() {
    const { form, form: { getFieldDecorator } } = this.props;
    const style = { width: '90px' };
    return (
      <OAModal
        form={form}
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
          {getFieldDecorator('number', {
          })(
            <Input type="number" placeholder="请输入" style={style} />
          )}
        </FormItem>
      </OAModal>
    );
  }
}

