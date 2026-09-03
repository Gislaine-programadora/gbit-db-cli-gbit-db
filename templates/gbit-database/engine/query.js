import fs from "fs";
import config from "../config/config.js";

function load(){

    return JSON.parse(

        fs.readFileSync(config.database,"utf8")

    );

}

function save(database){

    fs.writeFileSync(

        config.database,

        JSON.stringify(database,null,4)

    );

}

export function find(collection){

    const db=load();

    return db[collection] || [];

}

export function insert(collection,data){

    const db=load();

    db[collection].push(data);

    save(db);

    return data;

}

export function update(collection,id,newData){

    const db=load();

    db[collection]=db[collection].map(item=>{

        if(item.id===id){

            return {...item,...newData};

        }

        return item;

    });

    save(db);

}

export function remove(collection,id){

    const db=load();

    db[collection]=db[collection].filter(item=>item.id!==id);

    save(db);

}