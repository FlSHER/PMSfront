import React, { PureComponent } from 'react';
import RouterIndex from '../../index';
import Component from './default';

export default class extends PureComponent {
  render() {
    const { match, routerData } = this.props;
    return (
      <RouterIndex
        match={match}
        routerData={routerData}
        Component={Component}
      />
    );
  }
}
