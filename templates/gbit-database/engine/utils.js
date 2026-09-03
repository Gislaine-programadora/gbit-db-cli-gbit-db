export function now(){

    return new Date().toISOString();

}

export function uuid(){

    return crypto.randomUUID();

}