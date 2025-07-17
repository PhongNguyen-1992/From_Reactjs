
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import StudentManagementApp from './From-redux/StudentManagementApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <StudentManagementApp />
    </Provider>
  </React.StrictMode>
);