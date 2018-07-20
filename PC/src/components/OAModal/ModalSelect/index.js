import React from 'react';
import OAModal from '../modal';
import SelectTable from '../../OAForm/SearchTable/selectTable';
import { makeInitialValue, dontInitialValue } from '../../../utils/utils';

const defaultProps = {
  name: {},
  visible: false,
  modalProps: {},
  onChange: () => { },
};

export default class ModalStaff extends React.PureComponent {
  constructor(props) {
    super(props);
    this.pushValue = [];
    const value = makeInitialValue(props.name, props.value || [], props.multiple);
    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      const value = makeInitialValue(nextProps.name, nextProps.value || [], nextProps.multiple);
      this.setState({ value });
    }
  }

  setSelectedValue = (rowDatas) => {
    this.pushValue = rowDatas;
    const { onCancel, onChange, name, multiple } = this.props;
    if (!multiple) {
      const value = dontInitialValue(name, this.state.value, multiple);
      onCancel(false);
      onChange(value);
    }
  }

  handleOnChange = () => {
    this.setState({ value: [...this.pushValue] }, () => {
      const { onChange, name, multiple } = this.props;
      const value = dontInitialValue(name, this.state.value, multiple);
      onChange(value);
    });
  }

  makeTableProps = () => {
    const response = {
      ...this.props,
      setSelectedValue: this.setSelectedValue,
    };
    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    return response;
  }

  makeModalProps = () => {
    const { visible, onCancel, multiple } = this.props;
    const response = {
      visible,
      ...this.props.modalProps,
    };
    response.onCancel = () => onCancel(false);
    if (multiple) {
      response.onOk = this.handleOnChange;
    } else {
      response.footer = null;
    }
    return response;
  }

  render() {
    return (
      <OAModal {...this.makeModalProps()} >
        <SelectTable {...this.makeTableProps()} />
      </OAModal>
    );
  }
}
ModalStaff.defaultProps = defaultProps;
