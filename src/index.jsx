import React from 'react';
import { render } from 'react-dom';
import DatoCmsPlugin from 'datocms-plugins-sdk';

import 'datocms-plugins-sdk/dist/sdk.css';

import Main from './components/Main';

DatoCmsPlugin.init((plugin) => {
  plugin.startAutoResizer();

  const container = document.createElement('div');
  document.body.appendChild(container);

  render(<Main plugin={plugin} />, container);
});
