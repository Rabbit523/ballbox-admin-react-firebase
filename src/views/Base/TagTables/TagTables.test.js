import React from 'react';
import ReactDOM from 'react-dom';
import TagTables from './TagTables';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TagTables />, div);
  ReactDOM.unmountComponentAtNode(div);
});
