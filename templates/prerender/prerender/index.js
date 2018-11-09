import React from 'react';
import ReactDOMServer from 'react-dom/server';

function render(currentModule, cf, api, isDev) {
  cf.html = ReactDOMServer.renderToString(<div><span>index test</span></div>);
  cf.app = {a:1};
  return cf;
}

export default render;