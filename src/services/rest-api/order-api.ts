import { AxiosResponse } from "axios";
import { getGateway } from "./Core";
import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { Group } from "@/utils/interfaces/group";

export async function getAllGroups(throwError?: boolean){
    const result =  await getGateway(throwError).get(`/getallgroups`);
    return result as AxiosResponse<ApiResponse<Group[]>, unknown>;
}