class Serializer {


    static encode(data){


        return JSON.stringify(data);


    }




    static decode(data){


        return JSON.parse(data);


    }



}



export default Serializer;