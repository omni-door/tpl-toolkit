export default function (config: {
  ts: boolean;
}) {
  const { ts } = config;

  return `${ts ? '///<reference types=\'webpack-env\' />\n' : ''}
import React from 'react';
import { render } from 'react-dom';

const App = () => (
  <div className='main'>
    It's Your Omni-Toolkit Project
  </div>
);

render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}`;
}