import fs from "fs";


class Storage {


    constructor(path){


        this.directory = path;


        fs.mkdirSync(
            this.directory,
            {
                recursive:true
            }
        );


    }

      findById(collection,id){

    const items =
    this.find(collection);

    return items.find(
        item => item.id == id
    );

}



update(collection,id,data){

    const file =
    `${this.directory}/${collection}.json`;


    const items =
    JSON.parse(
        fs.readFileSync(
            file,
            "utf8"
        )
    );


    const index =
    items.findIndex(
        item => item.id == id
    );


    if(index === -1){

        throw new Error(
            "Registro não encontrado"
        );

    }


    items[index] = {

        ...items[index],

        ...data

    };


    fs.writeFileSync(

        file,

        JSON.stringify(
            items,
            null,
            4
        )

    );


    return items[index];

}

    collections(){


        return fs.readdirSync(
            this.directory
        )
        .filter(file =>
            file.endsWith(".json") &&
            file !== "gbit-db.json"
        )
        .map(file =>
            file.replace(".json","")
        );


    }



    createCollection(name){


        const file =
        `${this.directory}/${name}.json`;


        if(fs.existsSync(file)){


            throw new Error(
                "Collection já existe"
            );


        }



        fs.writeFileSync(

            file,

            "[]"

        );


        return {

            collection:name,

            created:true

        };


    }



    insert(collection,data){


        const file =
        `${this.directory}/${collection}.json`;



        if(!fs.existsSync(file)){


            throw new Error(
                "Collection não existe"
            );


        }



        const items =
        JSON.parse(
            fs.readFileSync(
                file,
                "utf8"
            )
        );



        const item = {


            id:Date.now(),

            ...data


        };



        items.push(item);



        fs.writeFileSync(

            file,

            JSON.stringify(
                items,
                null,
                4
            )

        );



        return item;


    }




    find(collection){


        const file =
        `${this.directory}/${collection}.json`;



        if(!fs.existsSync(file)){


            throw new Error(
                "Collection não existe"
            );


        }



        return JSON.parse(

            fs.readFileSync(
                file,
                "utf8"
            )

        );


    }




    delete(collection,id){


        const file =
        `${this.directory}/${collection}.json`;



        const items =
        JSON.parse(

            fs.readFileSync(
                file,
                "utf8"
            )

        );



        const updated =
        items.filter(
            item =>
            item.id != id
        );



        fs.writeFileSync(

            file,

            JSON.stringify(
                updated,
                null,
                4
            )

        );



        return true;


    }


}


export default Storage;