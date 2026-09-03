import Query from "../query/Query.js";


class QueryBuilder {


    constructor(data){


        this.query =
            new Query(data);


    }





    where(field){


        return this.query.where(
            field
        );


    }





    get(){


        return this.query.get();


    }



}



export default QueryBuilder;