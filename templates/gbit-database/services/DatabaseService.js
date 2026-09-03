import { Engine } from "../engine/engine.js";


class DatabaseService {


    constructor(){

        this.engine = new Engine({

            path:"./data/database-gbit"

        });


     console.log(
        "Engine:",
        Object.getOwnPropertyNames(
            Object.getPrototypeOf(this.engine)
        )
    );

    }

      findById(collection,id){

    return this.engine.findById(
        collection,
        id
    );

}



update(collection,id,data){

    return this.engine.update(
        collection,
        id,
        data
    );

}




    createCollection(name){


        return this.engine.createCollection(name);


    }



    getCollections(){

    return this.engine.collections();

}



    insert(collection,data){


        return this.engine.insert(
            collection,
            data
        );


    }



    findAll(collection){


        return this.engine.find(
            collection
        );


    }



    delete(collection,id){


        return this.engine.delete(
            collection,
            id
        );


    }



}



export default new DatabaseService();