import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { AxiosResponse } from "axios";
import { getGateway } from "./Core";

export async function setPin(pin : string,throwError?: boolean){
    const result =  await getGateway(throwError).post(`/create_update_admin_pin`, {pin});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function validatePin(enteredPin : string,throwError?: boolean){
    const result =  await getGateway(throwError).post(`/validate_admin_pin`, {pin: enteredPin});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}