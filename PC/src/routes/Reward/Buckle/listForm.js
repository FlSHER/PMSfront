import React from 'react';
import { Input } from 'antd';
import OAForm from '../../../components/OAForm';
import { EventSearch } from '../../../components/SearchSelect';
import WorkingStaff from '../../common/Table/workingStaff';

const { TextArea } = Input;
const FormItem = OAForm.Item;
const {
  FormList,
} = OAForm;
@FormList
@OAForm.create({
  onValuesChange(props, _, allValues) {
    props.onChange(allValues, props.index);
  },
})
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
          {getFieldDecorator('event_id', {
            initialValue: { event_id: '' },
          })(
            <EventSearch
              style={style}
              valueIndex="event_id"
              name={{ event_id: 'id' }}
            />
          )}
        </FormItem>
        <FormItem label="事件描述" {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: '',
          })(
            <TextArea placeholder="请输入" style={style} />
          )}
        </FormItem>
        <FormItem label="事件配置" {...formItemLayout} >
          {getFieldDecorator('participants', {
            initialValue: [],
          })(
            <WorkingStaff />
          )}
        </FormItem>
      </OAForm>
    );
  }
}
