import React from 'react';
import ReactDOM from 'react-dom';
import EventTables from './EventTables';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<EventTables />, div);
  ReactDOM.unmountComponentAtNode(div);
});
