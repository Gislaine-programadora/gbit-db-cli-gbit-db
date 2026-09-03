let cache={};

export function setCache(data){

    cache=data;

}

export function getCache(){

    return cache;

}

export function clearCache(){

    cache={};

}