export function isAfter(target:Date, other:Date):boolean{

    return target.getTime() > other.getTime();
}

export function isBefore(target:Date, other:Date):boolean{

    return target.getTime() < other.getTime();
}

export function isSame(target:Date, other:Date):boolean{

    return target.getTime() === other.getTime();
}