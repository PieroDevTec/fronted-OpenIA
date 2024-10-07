import { SweetAlertIcon } from "sweetalert2";

export interface InfoResponse {
    success: number;
    icon: SweetAlertIcon;
    title: string;
    message: string;
}

export interface ModelResponse<T> extends InfoResponse {
    model: T;
}

export interface ListModelResponse<T> extends InfoResponse {
    list: T[];
}