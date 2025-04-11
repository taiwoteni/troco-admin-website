import { apiGateway } from "./Core"

export const logoutAdmin = async(adminId: string) =>{
    const logout = apiGateway.patch(`/logoutadmin/${adminId}`);
    return logout;
}