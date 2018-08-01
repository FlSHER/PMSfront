import { Form } from 'antd';
import Config from './Config';

export default function create(options) {
  const newOption = {
    ...options,
    onValuesChange(props, fieldValue, allValues) {
      props.onChange(allValues, props.index);
      const [name] = Object.keys(fieldValue);
      props.setFiedError(name);
    },
  };
  return function configAndCreate(FormComponet) {
    const createdComponent = Form.create(newOption)(FormComponet);
    return Config(createdComponent);
  };
}
