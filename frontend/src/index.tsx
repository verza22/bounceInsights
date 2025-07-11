import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from "react";
import { registerLicense } from '@syncfusion/ej2-base';
import App from './App';
import './i18n';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JEaF5cXmtCdkxxWmFZfVtgdVdMYltbR3RPMyBoS35Rc0VkWXdecHZdR2JVU0N/VEFd');

const container = document.getElementById('root')!;

const existingRoot = (container as any)._root;

const root = existingRoot ?? createRoot(container);
(container as any)._root = root;

root.render(<App />);