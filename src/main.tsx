import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { inject } from '@vercel/analytics';
import { LangProvider } from './i18n/LangContext';

createRoot(document.getElementById('root')!).render(<LangProvider><App /></LangProvider>);

// Visitor counting (Vercel Web Analytics: cookie-less, no personal data). Only on the real site, never on localhost.
if (!/^(localhost|127\.|\[::1\])/.test(location.hostname)) inject();
