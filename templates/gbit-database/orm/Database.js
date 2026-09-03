import Collection from "./Collection.js";


class Database {


    constructor(engine){


        this.engine = engine;

        this.collections = {};


    }





    collection(name){


        if(!this.collections[name]){


            this.collections[name] =
                new Collection(
                    name,
                    this.engine
                );


        }


        return this.collections[name];


    }



}



export default Database;