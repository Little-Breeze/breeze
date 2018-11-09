import React from "react";
import ReactDOM from "react-dom";
import { hot } from 'react-hot-loader';
import AppRouter from './AppRouter.js';

const AppWithHot = hot(module)(AppRouter);
var mountNode = document.getElementById("app");

ReactDOM.render(<AppWithHot />, mountNode);