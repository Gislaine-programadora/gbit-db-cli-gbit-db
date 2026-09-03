import Storage from "./Storage.js";
import Cache from "./Cache.js";
import Transaction from "./Transaction.js";


class Engine {


    constructor(options = {}){


        this.storage = new Storage(
            options.path || "./data/database-gbit"
        );


        this.cache = new Cache();


        this.transaction = new Transaction(
            this.storage
        );


    }



    createCollection(name){


        return this.storage.createCollection(name);


    }




    getCollection(name){


        return this.storage.find(name);


    }




    save(collection,data){


        this.cache.set(
            collection,
            data
        );


        return this.storage.save(
            collection,
            data
        );


    }




    find(collection){


        const cached = this.cache.get(
            collection
        );


        if(cached){

            return cached;

        }


        const data =
            this.storage.find(collection);



        this.cache.set(
            collection,
            data
        );


        return data;


    }



}


export default Engine;