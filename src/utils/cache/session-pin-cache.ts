export function savePinEntered(entered?: boolean){
    if(typeof window !== 'undefined'){
        sessionStorage.setItem('pinEntered', entered? 'true':'false');
    }
}

export function getPinEntered(): boolean | undefined{
    if(typeof window === 'undefined'){
        return undefined;
    }

    const rawData = sessionStorage.getItem('pinEntered');
    if(!rawData){
        return undefined;
    }

    return rawData === 'true'? true:false;
}