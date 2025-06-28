import Admin from "../interfaces/admin";

export function saveAdminDetails(data?:Admin){
    if(typeof window !== 'undefined'){
        if(!data){
            localStorage.removeItem('admindetails');
            return;
        }
        localStorage.setItem('admindetails', JSON.stringify(data))
    }
}

export function getAdminDetails(): Admin | undefined{
    if(typeof window === 'undefined'){
        return undefined;
    }

    const rawData = localStorage.getItem('admindetails');
    if(!rawData){
        return undefined;
    }

    return JSON.parse(rawData!) as Admin;
}