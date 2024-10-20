import {IconButton, Paper, Typography, useTheme} from "@mui/material";
import {CheckCircle, Close, Dangerous, Info, Warning} from "@mui/icons-material";
import {useEffect, useRef} from "react";
import {PausableTimeout} from "./pausable-timeout.ts";
import './toast.css';

export type ToastType = 'info' | 'warning' | 'error' | 'success'

export interface ToastComponentProps {
  onClose: () => void;
  message: string;
  duration?: number;
  type?: ToastType;
}

export const ToastComponent = ({message, type = 'info', onClose, duration = 3000}: ToastComponentProps) => {
  const toastRef = useRef<HTMLDivElement | null>(null);
  const onCloseWrapper = () => {
    setTimeout(onClose, 450); // queue actual closing action
    // simulate removal with CSS
    if (toastRef.current?.classList.contains('hide')) {
      toastRef.current?.classList.remove('hide');
    } else {
      toastRef.current?.classList.add('hide');
    }
  }

  const timeoutRef = useRef<PausableTimeout>(new PausableTimeout(onCloseWrapper, duration));

  const theme = useTheme();
  let toastTypeIcon;
  switch (type) {
    case "error":
      toastTypeIcon = <Dangerous sx={{color: theme.palette.error.main}}/>
      break;
    case "warning":
      toastTypeIcon = <Warning sx={{color: theme.palette.warning.main}}/>
      break;
    case 'success':
      toastTypeIcon = <CheckCircle sx={{color: theme.palette.success.main}}/>
      break;
    case "info":
    default:
      toastTypeIcon = <Info sx={{color: theme.palette.info.main}}/>
      break;
  }

  useEffect(() => {
    timeoutRef.current.start();
  }, []);

  return (
    <div ref={toastRef} className='toast'>
      <Paper onMouseEnter={() => timeoutRef.current.pause()} onMouseLeave={() => timeoutRef.current.resume()}
             sx={{padding: '10px 10px 10px 5px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <IconButton sx={{marginRight: 1}}>{toastTypeIcon}</IconButton>
        <Typography>{message}</Typography>
        <IconButton sx={{marginLeft: 3}} onClick={onCloseWrapper}><Close/></IconButton>
      </Paper>
    </div>
  );
};
