import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as ReactDOM from 'react-dom';

// React 19 Compatibility Patch for react-quill
// @ts-ignore
const patchReactDOM = (target: any) => {
  if (target && !target.findDOMNode) {
    target.findDOMNode = (el: any) => el;
  }
};

patchReactDOM(ReactDOM);
// @ts-ignore
patchReactDOM(ReactDOM.default);

// Also patch on window for absolute safety
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.ReactDOM = ReactDOM;
}

/* Styles - order matters */
import '@/assets/styles/typography.css';
import '@/assets/styles/global.css';
import '@/assets/styles/animations.css';

/* App */
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
