class Cache {


    constructor(){


        this.memory = {};


    }




    set(key,value){


        this.memory[key] = value;


    }





    get(key){


        return this.memory[key];


    }





    remove(key){


        delete this.memory[key];


    }





    clear(){


        this.memory = {};


    }



}



export default Cache;