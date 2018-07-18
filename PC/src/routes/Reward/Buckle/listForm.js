import React from 'react';
import { Input, Select } from 'antd';
import OAForm from '../../../components/OAForm';
import WorkingStaff from '../../common/Table/workingStaff';
import styles from './index.less';

const { TextArea } = Input;
const FormItem = OAForm.Item;
const {
  FormList,
  DatePicker,
} = OAForm;
@FormList
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
    const style = { width: 540 };
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    return (
      <OAForm {...this.makeFormProps()} style={{ padding: 10, width: 670 }}>
        <FormItem label="事件标题" {...formItemLayout}>
          {getFieldDecorator('Select', {})(
            <Select placeholder="请输入" style={style} />
          )}
        </FormItem>
        <FormItem label="事件描述" {...formItemLayout}>
          {getFieldDecorator('textArea', {})(
            <TextArea placeholder="请输入" style={style} />
          )}
        </FormItem>
        <FormItem label="事件配置" {...formItemLayout} >
          {getFieldDecorator('workingStaff', {})(
            <WorkingStaff />
          )}
        </FormItem>
      </OAForm>
    );
  }
}
