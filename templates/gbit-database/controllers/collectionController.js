import DatabaseService from "../services/DatabaseService.js";


class CollectionController {


    list(req,res){

        res.json({

            collections:
            DatabaseService.getCollections()

        });

    }

      findById(req,res){

    console.log("PARAMS:", req.params);

    const { name, id } = req.params;

    const item = DatabaseService.findById(
        name,
        id
    );

    console.log("ITEM:", item);

    res.json(item);

}


update(req,res){

    const {name,id} = req.params;

    const item =
    DatabaseService.update(
        name,
        id,
        req.body
    );

    res.json(item);

}



    create(req,res){


        const {name}=req.body;


        const result =
        DatabaseService.createCollection(name);


        res.status(201).json(result);

    }




    get(req,res){


        const {name}=req.params;


        const data =
        DatabaseService.findAll(name);


        res.json(data);

    }




    insert(req,res){

        const {name}=req.params;


        const item =
        DatabaseService.insert(
            name,
            req.body
        );


        res.status(201)
        .json(item);

    }



    delete(req,res){

        const {name,id}=req.params;


        DatabaseService.delete(
            name,
            id
        );


        res.json({

            deleted:true

        });


    }


}


export default new CollectionController();