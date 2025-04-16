/* eslint-disable @typescript-eslint/no-explicit-any */
export function distinctStringList(array:string[]):string[]{
    return Array.from(new Set(array));
}

export function distinctList(array:any[], field:string):any[]{
    const distinctKeys = distinctStringList(array.map(value=>value[field]));

    const distinct = distinctKeys.map(key => array.find(value=> value[field] === key));

    return distinct;
}