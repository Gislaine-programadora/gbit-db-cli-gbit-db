import QueryBuilder from "./QueryBuilder.js";


class Model {


    constructor(name, schema, engine){


        this.name = name;

        this.schema = schema;

        this.engine = engine;


    }





    create(data){


        const collection =
            this.engine.find(
                this.name
            );



        collection.push(data);



        this.engine.save(
            this.name,
            collection
        );


        return data;


    }





    find(){


        return new QueryBuilder(

            this.engine.find(
                this.name
            )

        );


    }



}

export default Model;

