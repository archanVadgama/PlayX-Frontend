import { SafeHtml } from "@angular/platform-browser";

export interface IMenuItem {
    name: string;
    icon: SafeHtml;
    route?: string;
    callback?: () => void;
}  
export type ToastType = "success" | "error" | "warning" | "info";
