import React from 'react';
import { Input, Button } from 'antd';
import OAForm, { OAModal } from '../../components/OAForm';

const { TextArea } = Input;
const FormItem = OAForm.Item;

@OAForm.create()
export default class Test extends React.PureComponent {
  state = {
    visible: false,
  }

  componentWillMount() {
    this.bindModalAutoSave = this.props.bindModalAutoSave(true);
  }


  handleSubmit = (values) => {
    console.log(values);
  }

  render() {
    const { form: { getFieldDecorator }, onSubmit } = this.props;
    const style = {};
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
    };

    return (
      <React.Fragment>
        <OAModal
          {...this.bindModalAutoSave}
          visible={this.state.visible}
          onSubmit={onSubmit(this.handleSubmit)}
          style={{ padding: 10, width: 670 }}
        >
          <FormItem label="描述" {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: '',
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <TextArea placeholder="请输入" style={style} />
            )}
          </FormItem>
        </OAModal>
        <Button
          type="primary"
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          Log in
        </Button>
      </React.Fragment>
    );
  }
}
