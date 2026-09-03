export class Transaction{

    begin(){

        console.log("Transaction Started");

    }

    commit(){

        console.log("Transaction Saved");

    }

    rollback(){

        console.log("Transaction Cancelled");

    }

}