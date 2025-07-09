import {useContext} from "react";
import {ShowToastProps, ToastContext} from "./toast-context.tsx";

export type ShowToastType = (props: ShowToastProps) => void
export const useToast = (): ShowToastType => {
  return useContext(ToastContext) as ShowToastType;
};