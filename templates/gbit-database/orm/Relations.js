class Relations {


    constructor(){


        this.relations = {};


    }





    hasMany(name,config){


        this.relations[name] = {

            type:"hasMany",

            ...config

        };


        return this;


    }





    belongsTo(name,config){


        this.relations[name] = {

            type:"belongsTo",

            ...config

        };


        return this;


    }





    get(name){


        return this.relations[name];


    }



}



export default Relations;