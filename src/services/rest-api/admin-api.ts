import { AxiosResponse } from "axios";
import { apiGateway, errorApiGateway } from "./Core"
import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { FullAdmin } from "@/utils/interfaces/admin";

export const getOneAdmin = async(adminId: string)=>{
    const result = await apiGateway.get(`/getoneadmin/${adminId}`);

    return result as AxiosResponse<ApiResponse<FullAdmin>, unknown>;
}

export const getOneAdminOrThrow = async(adminId: string)=>{
    const result = await errorApiGateway.get(`/getoneadmin/${adminId}`);

    return result as AxiosResponse<ApiResponse<FullAdmin>, unknown>;
}