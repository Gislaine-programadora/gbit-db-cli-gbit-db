class Hooks {


    constructor(){


        this.events = {};


    }





    register(event,callback){


        if(!this.events[event]){


            this.events[event] = [];


        }



        this.events[event].push(
            callback
        );


    }





    async execute(event,data){


        const callbacks =
            this.events[event] || [];



        for(
            const callback of callbacks
        ){


            data =
                await callback(data);


        }



        return data;


    }



}



export default Hooks;