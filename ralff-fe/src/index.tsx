import ReactDOM from 'react-dom/client';
import './index.css';
import Routes from './components/routes';
import "monday-ui-react-core/tokens";
import {init} from './reverse-engineering/script';
import {StrictMode} from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Routes/>
  </StrictMode>
);

init();