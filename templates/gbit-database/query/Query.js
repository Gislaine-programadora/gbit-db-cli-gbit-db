import Filter from "./Filter.js";

import Sort from "./Sort.js";

import Operators from "./Operators.js";



class Query {


    constructor(data=[]){


        this.data = data;

        this.result = data;

        this.field = null;


    }





    where(field){


        this.field = field;


        return this;


    }





    eq(value){


        this.result =
            Filter.where(
                this.result,
                this.field,
                Operators.eq(value)
            );


        return this;


    }





    neq(value){


        this.result =
            Filter.where(
                this.result,
                this.field,
                Operators.neq(value)
            );


        return this;


    }





    gt(value){


        this.result =
            Filter.where(
                this.result,
                this.field,
                Operators.gt(value)
            );


        return this;


    }





    gte(value){


        this.result =
            Filter.where(
                this.result,
                this.field,
                Operators.gte(value)
            );


        return this;


    }





    lt(value){


        this.result =
            Filter.where(
                this.result,
                this.field,
                Operators.lt(value)
            );


        return this;


    }





    contains(value){


        this.result =
            Filter.where(
                this.result,
                this.field,
                Operators.contains(value)
            );


        return this;


    }





    sort(field,direction="asc"){


        this.result =
            Sort.order(
                this.result,
                field,
                direction
            );


        return this;


    }





    limit(number){


        this.result =
            this.result.slice(
                0,
                number
            );


        return this;


    }





    get(){


        return this.result;


    }



}



export default Query;