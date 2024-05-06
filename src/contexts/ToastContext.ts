import { createContext, useContext } from "react";

export type ToastFunction = (
    severity: "success" | "info" | "warn" | "error" | undefined,
    summary: string,
    detail: string,
) => void;

export const ToastContext = createContext<ToastFunction | null>(null);

export const useToast = () => {
    return useContext(ToastContext);
};