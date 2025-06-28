/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminRole } from "@/utils/interfaces/admin";
import { apiGateway, errorApiGateway, getGateway } from "./Core"
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/utils/interfaces/api-resonse";

export type AdminAuthPayload = {
    username?: string,
    email: string,
    role?: AdminRole,
    password: string
}

export const logoutAdmin = async(adminId: string, throwError?: boolean) =>{
    const logout = await getGateway(throwError).patch(`/logoutadmin/${adminId}`);
    return logout as AxiosResponse<ApiResponse, any>;
}

export const registerAdmin = async(admin: AdminAuthPayload)=>{
    const p = await apiGateway.post('/createadmin', admin);
    return p;
}

export const registerAdminOrThrow = async(admin: AdminAuthPayload)=>{
    const p = await errorApiGateway.post('/createadmin', admin);
    return p;
}

export const loginAdmin = async(admin: AdminAuthPayload)=>{
    const p = await apiGateway.post('/loginadmin', admin);
    return p as AxiosResponse<ApiResponse, any>;
}

export const loginAdminOrThrow = async(admin: AdminAuthPayload)=>{
    const p = await errorApiGateway.post('/loginadmin', admin);
    return p as AxiosResponse<ApiResponse, any>;
}