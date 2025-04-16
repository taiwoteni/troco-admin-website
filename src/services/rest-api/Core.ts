import axios from "axios";

const baseUrl = "https://trocotechnologylimitedserver.space/api/v1";
const headers = {"Content-Type": 'application/json'};

// To prevent axios from throwinf any errors
export const apiGateway = axios.create({
    baseURL:baseUrl,
    headers,
    validateStatus: ()=> true
})

// COnfig that throws error
export const errorApiGateway = axios.create({
    baseURL:baseUrl,
    headers,
    validateStatus: (status)=> status>=200 && status <=299
})
