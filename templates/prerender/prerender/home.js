import React from 'react';
import ReactDOMServer from 'react-dom/server';

function render(currentModule, cf, api, isDev) {
  cf.html = 'home';
  cf.app = {};
  return cf;
}

export default render;