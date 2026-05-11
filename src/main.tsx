import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

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
