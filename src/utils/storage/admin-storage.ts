import Admin from "../interfaces/admin";

export function saveAdminDetails(data:Admin){
    localStorage.setItem('admindetails', JSON.stringify(data))
}

export function getAdminDetails(): Admin | undefined{

    const rawData = localStorage.getItem('admindetails');
    if(!rawData){
        return undefined;
    }

    return JSON.parse(rawData!) as Admin;
}