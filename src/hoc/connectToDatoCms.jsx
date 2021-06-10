import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SiteClient } from 'datocms-client';

export default (mapPluginToProps) => (BaseComponent) =>
  class ConnectToDatoCms extends Component {
    static propTypes = {
      plugin: PropTypes.object.isRequired,
    };

    constructor(props) {
      super(props);
      this.state = mapPluginToProps(props.plugin);

      this.client = new SiteClient(props.plugin.parameters.global.apiToken, {
        environment: props.plugin.environment,
      });
    }

    render() {
      return <BaseComponent {...this.props} {...this.state} client={this.client} />;
    }
  };
