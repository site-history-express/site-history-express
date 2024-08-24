import ReactDOM from 'react-dom/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import 'dayjs/locale/zh';
import 'dayjs/locale/ja';

import { i18n } from '@/common/i18n';
import './index.css';
import App from './App';

dayjs.locale(i18n.lang);
dayjs.extend(relativeTime);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
