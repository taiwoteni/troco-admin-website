import { user } from "@/utils/interfaces/user";
import { AxiosResponse } from "axios";
import { apiGateway, errorApiGateway } from "./Core";
import { ApiResponse } from "@/utils/interfaces/api-resonse";

export async function getAllUsers(throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.get(`/getallusers`);
    return result as AxiosResponse<ApiResponse<user[]>, unknown>;
}