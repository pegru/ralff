import {createContext, PropsWithChildren, useCallback, useState} from "react";
import {ShowToastType} from "./use-toast.ts";
import {ToastComponent, ToastType} from "./toast-component.tsx";
import {Box} from "@mui/material";

export const ToastContext = createContext<ShowToastType | null>(null);

export interface ShowToastProps {
  type?: ToastType;
  message: string;
  duration?: number;
}

interface ToastItem extends ShowToastProps {
  id: string;
}

export const ToastProvider = ({children}: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((props: ShowToastProps) => {
    const toastItem: ToastItem = {
      id: String(Date.now()),
      ...props
    }
    setToasts(prevState => [...prevState, toastItem]);
  }, [setToasts]);

  const handleClose = useCallback((toastId: string) => {
    setToasts(prevState => prevState.filter(toast => toast.id !== toastId));
  }, [setToasts]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Box sx={{position: 'absolute', bottom: 40, left: 40, display: 'flex', gap: 2, flexDirection: 'column'}}>
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => handleClose(toast.id)}
          />
        ))}
      </Box>
    </ToastContext.Provider>
  );
};