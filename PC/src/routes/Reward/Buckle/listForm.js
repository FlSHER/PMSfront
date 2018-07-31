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
  onValuesChange(props, fieldValue, allValues) {
    props.onChange(allValues, props.index);
    const [name] = Object.keys(fieldValue);
    props.setFiedError(name, null);
  },
})
export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    const { form, bindForm, value } = props;
    bindForm(form);
    this.state = {
      eventId: value.event_id || null,
      pointRange: {
        point_a: {
          min: 0,
          max: 0,
        },
        point_b: {
          min: 0,
          max: 0,
        },
      },
      defaultPoint: {
        point_b: 0,
        point_a: 0,
        count: 1,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { errors, index, onError } = nextProps;
    if (errors[index] && JSON.stringify(nextProps.errors) !== JSON.stringify(this.props.errors)) {
      onError(errors[index], null, false);
    }
  }

  handleChange = (value) => {
    const a = parseFloat(value.point_a_default);
    const pointA = Math.floor(value.point_a_default) === a;
    const b = parseFloat(value.point_b_default);
    const pointB = Math.floor(value.point_b_default) === b;
    this.setState({
      eventId: value.id,
      pointRange: {
        point_a: {
          min: value.point_a_min,
          max: value.point_a_max,
        },
        point_b: {
          min: value.point_b_min,
          max: value.point_b_max,
        },
      },
      defaultPoint: {
        point_a: pointA ? a : value.point_a_default,
        point_b: pointB ? b : value.point_b_default,
      },
    });
  }

  makeFormProps = () => {
    const { form } = this.props;
    const response = {
      form,
    };
    return response;
  }

  render() {
    const { form: { getFieldDecorator }, value } = this.props;
    const { defaultPoint, eventId, pointRange } = this.state;
    const style = { width: 540 };
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    return (
      <OAForm {...this.makeFormProps()} style={{ padding: 10, width: 670 }}>
        <FormItem label="事件标题" {...formItemLayout}>
          {getFieldDecorator('event_id', {
            initialValue: value.event_id ? { id: value.event_id } : {},
          })(
            <EventSearch
              style={style}
              eventId={value.event_id || null}
              onChange={this.handleChange}
            />
          )}
        </FormItem>
        <FormItem label="事件描述" {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: value.description || '',
          })(
            <TextArea placeholder="请输入" style={style} />
          )}
        </FormItem>
        <FormItem label="事件配置" {...formItemLayout} >
          {getFieldDecorator('participants', {
            initialValue: value.participants || [],
          })(
            <WorkingStaff
              eventId={eventId}
              pointRange={pointRange}
              defaultPoint={defaultPoint}
            />
          )}
        </FormItem>
      </OAForm>
    );
  }
}
