import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Routes} from "./routes/routes.tsx";
import {ToastProvider} from "./components/toast/toast-context.tsx";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {enUS} from 'date-fns/locale/en-US';
import {init} from "./reverse-engineering/script.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
      <ToastProvider>
        <Routes/>
      </ToastProvider>
    </LocalizationProvider>
  </StrictMode>
);

init();
