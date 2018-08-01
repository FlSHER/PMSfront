import React from 'react';
import {
  message,
} from 'antd';
import './message.less';
import { unicodeFieldsError } from '../../utils/utils';


export default (FormComponet) => {
  class NewFormComponent extends React.PureComponent {
    constructor(props) {
      super(props);
      const { id } = props;
      this.state = {
        localSavingKey: `${location.href}${id || 'StandardForm'}`,
        autoSave: false,
        // fieldsError: {},
      };
    }

    bindForm = (form) => {
      this.form = form;
    }

    bindAutoSave = () => {
      this.setState({ autoSave: true });
    }

    saveByLocal = (fieldsValue) => {
      if (!this.state.autoSave) return;
      message.destroy();
      const saveLoading = message.loading('备份中', 1);
      const { localSavingKey } = this.state;
      localStorage.setItem(localSavingKey, JSON.stringify(fieldsValue));
      clearInterval(this.localSavingInterval);
      setTimeout(saveLoading, 1);
    }

    fetchLocalSaving = () => {
      message.destroy();
      const { localSavingKey } = this.state;
      const storageValue = JSON.parse(localStorage.getItem(localSavingKey));
      if (Object.keys(storageValue || {}).length === 0) {
        setTimeout(message.error('表单没有备份'), 1);
      } else {
        setTimeout(message.loading('读取中'), 1);
      }
      return storageValue;
    }

    clearFormAndLocalSaving = () => {
      const { localSavingKey } = this.state;
      clearInterval(this.localSavingInterval);
      localStorage.removeItem(localSavingKey);
    }

    handleFieldsError = (name) => {
      const { setFields, getFieldError } = this.form;
      if (getFieldError(name)) {
        setFields({ [name]: {} });
      }
    }

    handleOnChange = (changedFields, index) => {
      const { onChange } = this.props;
      if (onChange) onChange(changedFields, index);
      if (!this.state.autoSave) return;
      clearInterval(this.localSavingInterval);
      const fieldsValue = {};
      Object.keys(changedFields).forEach((key) => {
        fieldsValue[key] = changedFields[key];
      });
      this.localSavingInterval = setInterval(() => {
        this.saveByLocal(fieldsValue);
      }, 4000);
    }

    handleOnError = (error, callback, isUnicode) => {
      const errResult = unicodeFieldsError(error, isUnicode);
      const { setFields } = this.form;
      Object.keys(errResult).forEach((name) => {
        const errValue = errResult[name];
        setFields({ [name]: errValue });
        if (callback) callback(name, errValue, error);
      });
    }

    makeNewFormComponetProps = () => {
      // const { fieldsError } = this.state;
      const respone = {
        ...this.props,
        bindForm: this.bindForm,
        bindAutoSave: this.bindAutoSave,
        // handleFieldsError: this.handleFieldsError,
        // fieldsError,
        onError: this.handleOnError,
        setFiedError: this.handleFieldsError,
        onChange: this.handleOnChange,
      };
      if (this.state.autoSave) {
        respone.autoSave = {
          getLocal: this.fetchLocalSaving,
          saveLocal: this.saveByLocal,
          clearLocal: this.clearFormAndLocalSaving,
        };
      }
      return respone;
    }

    render() {
      return (
        <FormComponet {...this.makeNewFormComponetProps()} />
      );
    }
  }
  return NewFormComponent;
};

