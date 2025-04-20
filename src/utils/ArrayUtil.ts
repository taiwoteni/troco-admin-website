export function distinctStringList(array:string[]):string[]{
    return Array.from(new Set(array));
}

export function distinctList<T>(array:T[], field: keyof T):T[]{
    const distinctKeys = distinctStringList(array.map(value=>value[field] as string));

    const distinct = distinctKeys.map(key => array.find(value=> value[field] === key)!);

    return distinct;
}