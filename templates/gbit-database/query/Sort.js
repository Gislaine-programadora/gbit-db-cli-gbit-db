class Sort {



    static order(
        data,
        field,
        direction="asc"
    ){


        return [...data].sort(
            (a,b)=>{


                if(direction==="desc"){


                    return a[field] < b[field]
                        ? 1
                        : -1;


                }



                return a[field] > b[field]
                    ? 1
                    : -1;


            }
        );


    }



}



export default Sort;