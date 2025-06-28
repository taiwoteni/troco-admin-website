import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { getGateway } from "./Core";
import { AxiosResponse } from "axios";
import { bonus } from "@/utils/interfaces/bonus";

export async function getAllBonuses(throwError?: boolean){
    const result =  await getGateway(throwError).get(`/list_bonuses_sent`);
    return result as AxiosResponse<ApiResponse<bonus[]>, unknown>;
}

export async function sendBonus({userId, amount, description, type}:Record<string, unknown>,throwError?: boolean){
    const result =  await getGateway(throwError).post(`/send_bonuses/${userId}`, {amount,description, type});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}