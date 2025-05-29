import { AxiosResponse } from "axios";
import { apiGateway, errorApiGateway, getGateway } from "./Core"
import { ApiResponse } from "@/utils/interfaces/api-resonse";
import Admin, { FullAdmin } from "@/utils/interfaces/admin";

export const getOneAdmin = async(adminId: string)=>{
    const result = await apiGateway.get(`/getoneadmin/${adminId}`);

    return result as AxiosResponse<ApiResponse<FullAdmin>, unknown>;
}

export const getOneAdminOrThrow = async(adminId: string)=>{
    const result = await errorApiGateway.get(`/getoneadmin/${adminId}`);

    return result as AxiosResponse<ApiResponse<FullAdmin>, unknown>;
}

export const getAllAdmins = async(throwError?: boolean)=>{
    const result = await getGateway(throwError).get(`/getallAdmins`);

    return result as AxiosResponse<ApiResponse<Admin[]>, unknown>;
}

export const getAllCustomerCare = async(throwError?: boolean)=>{
    const result = await getGateway(throwError).get(`/getallcustomercare`);

    return result as AxiosResponse<ApiResponse<Admin[]>, unknown>;
}

export const blockAdmin = async(adminId: string)=>{
    const result = await apiGateway.patch(`/blockadmin/${adminId}`);

    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export const unBlockAdmin = async(adminId: string)=>{
    const result = await apiGateway.patch(`/unblockadmin/${adminId}`);

    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export const deleteAdmin = async(adminId: string)=>{
    const result = await apiGateway.patch(`/deleteadmin/${adminId}`);

    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}