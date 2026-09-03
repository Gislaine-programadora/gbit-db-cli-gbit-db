import Field from "./Field.js";



class Schema {


    constructor(definition = {}){


        this.fields = {};



        Object.keys(definition)
        .forEach(name => {



            const config =
                definition[name];



            if(config instanceof Field){


                this.fields[name] =
                    config;


            }
            else{


                this.fields[name] =
                    new Field(config);


            }



        });



    }





    validate(data){



        Object.keys(this.fields)
        .forEach(field => {



            this.fields[field]
            .validate(
                data[field]
            );



        });



        return true;


    }





    getFields(){


        return this.fields;


    }





    getField(name){


        return this.fields[name];


    }



}



export default Schema;