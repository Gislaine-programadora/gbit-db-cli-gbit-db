class Validation {


    constructor(schema={}){


        this.schema = schema;


    }




    validate(data){


        const errors = [];



        Object.keys(this.schema)
        .forEach(field=>{


            const rules =
                this.schema[field];



            if(
                rules.required &&
                !data[field]
            ){


                errors.push(
                    `${field} é obrigatório`
                );


            }



        });



        return {


            valid:
                errors.length === 0,


            errors


        };


    }



}



export default Validation;