class Field {


    constructor(options = {}){


        this.type =
            options.type || "string";


        this.required =
            options.required || false;


        this.default =
            options.default ?? null;


    }





    validate(value){



        if(
            this.required &&
            (value === undefined ||
             value === null)
        ){


            throw new Error(
                "Campo obrigatório"
            );


        }



        if(
            value !== undefined &&
            value !== null
        ){


            if(
                this.type &&
                typeof value !== this.type &&
                this.type !== "date"
            ){


                throw new Error(
                    `Tipo inválido esperado: ${this.type}`
                );


            }


        }



        return true;


    }



}



export default Field;