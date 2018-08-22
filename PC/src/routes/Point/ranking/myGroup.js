import React from 'react';
import Group from './group';

export default class extends React.Component {
  render() {
    return (
      <Group
        type="auth_group"
        {...this.props}
      />
    );
  }
}
