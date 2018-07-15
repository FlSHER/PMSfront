import React from 'react';
import { Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import OAForm from '../../../components/OAForm';
import SelectTable from '../../../components/OAForm/selectTable';
import styles from './index.less';

const { TextArea } = Input;
const FormItem = OAForm.Item;
const {
  DatePicker,
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

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const style = { style: { width: 380 } };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div style={{ padding: 10 }}>
        <Modal>
          <SelectTable />
        </Modal>
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
                popupStyle={{ width: 380 }}
              />
            )}
          </FormItem>
          <FormItem label="事件配置" {...formItemLayout} />
        </OAForm>
      </div>
    );
  }
}
