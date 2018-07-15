import React from 'react';
import { Input } from 'antd';
import { connect } from 'dva';
import OAForm from '../../../components/OAForm';

const { TextArea } = Input;
const FormItem = OAForm.Item;
@connect()
@OAForm.Config
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

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
    };
    return (
      <div style={{ padding: 10 }}>
        <OAForm {...this.makeFormProps()}>
          <FormItem label="事件描述" {...formItemLayout}>
            {getFieldDecorator('textArea', {})(
              <TextArea placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="事件时间" {...formItemLayout}>
            {getFieldDecorator('input', {})(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </OAForm>
      </div>
    );
  }
}
