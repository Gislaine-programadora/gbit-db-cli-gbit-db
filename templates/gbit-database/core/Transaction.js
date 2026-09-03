class Transaction {


    constructor(storage){


        this.storage = storage;

        this.backup = null;


    }





    start(data){


        this.backup =
            JSON.stringify(data);


        return true;


    }





    commit(){


        this.backup = null;


        return true;


    }





    rollback(){


        if(!this.backup){


            return null;


        }



        return JSON.parse(
            this.backup
        );


    }



}



export default Transaction;