import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';


ReactDOM.render(
<BrowserRouter>
<MultiThemeProvider>
<App />
</MultiThemeProvider>
</BrowserRouter>
, document.getElementById('root'));

