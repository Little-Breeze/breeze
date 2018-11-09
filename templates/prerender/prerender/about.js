import React from 'react';

function render(currentModule, cf, api, isDev) {
  cf.html = 'about';
  cf.app = {};
  return cf;
}

export default render;