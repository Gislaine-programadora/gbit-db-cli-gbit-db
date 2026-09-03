class Parser {


    static parse(data){


        if(typeof data === "string"){


            try {


                return JSON.parse(data);


            }
            catch(error){


                return data;


            }


        }



        return data;


    }




    static stringify(data){


        return JSON.stringify(
            data,
            null,
            2
        );


    }



}



export default Parser;