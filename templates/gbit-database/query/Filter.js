class Filter {



    static where(data, field, rule){


        return data.filter(item => {


            return rule(
                item[field]
            );


        });


    }





    static match(data, conditions){


        return data.filter(item => {


            return Object.keys(conditions)
            .every(field => {


                return item[field] ===
                    conditions[field];


            });


        });


    }



}



export default Filter;