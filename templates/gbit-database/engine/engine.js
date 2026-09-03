import Storage from "./storage.js";


export function connect(path){

    return new Storage(path);

}





export class Engine {


    constructor(options = {}){


        this.path =
        options.path ||
        "./data/database-gbit";


        this.storage =
        connect(this.path);


    }



    collections(){

        return this.storage.collections();

    }



    createCollection(name){

        return this.storage.createCollection(name);

    }



    insert(collection,data){

        return this.storage.insert(
            collection,
            data
        );

    }



    find(collection){

        return this.storage.find(
            collection
        );

    }

    findById(collection,id){

    return this.storage.findById(
        collection,
        id
    );

}



update(collection,id,data){

    return this.storage.update(
        collection,
        id,
        data
    );

}

    delete(collection,id){

        return this.storage.delete(
            collection,
            id
        );

    }


}