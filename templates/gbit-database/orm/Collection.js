import Model from "./Model.js";


class Collection {


    constructor(name, engine){


        this.name = name;

        this.engine = engine;


    }




    create(data){


        const items =
            this.engine.find(
                this.name
            );



        items.push(data);



        return this.engine.save(
            this.name,
            items
        );


    }





    all(){


        return this.engine.find(
            this.name
        );


    }





    model(){


        return new Model(
            this.name,
            this.engine
        );


    }



}



export default Collection;