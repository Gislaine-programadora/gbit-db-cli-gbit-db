import {
    Engine,
    Database,
    Model,
    Schema,
    Types,
    Query
} from "./index.js";



console.log("\n🚀 Iniciando GBIT Database Engine...\n");



// Criando Engine

const engine = new Engine({

    path:"./data/database-gbit"

});



console.log("✅ Engine carregado");



// Criando Database

const db = new Database(
    engine
);


console.log("✅ Database criado");



// Criando Schema

const UserSchema = new Schema({

    name:{
        type:"string",
        required:true
    },


    email:{
        type:"string",
        required:true
    },


    age:{
        type:"number"
    }


});



console.log(
    "✅ Schema criado"
);



// Criando Model

const User = new Model(
    "users",
    UserSchema,
    engine
);



console.log(
    "✅ Model Users criado"
);




// Criando usuários

User.create({

    name:"GBIT",

    email:"dev@gbit.com",

    age:1

});


User.create({

    name:"Maria",

    email:"maria@gbit.com",

    age:25

});


User.create({

    name:"João",

    email:"joao@gbit.com",

    age:15

});



console.log(
    "✅ Dados inseridos"
);




// Buscar todos

const users = User.find()
    .get();



console.log("\n📦 Todos usuários:");

console.log(users);




// Testando Query

const adults =
    new Query(users)
        .where("age")
        .gt(18)
        .get();



console.log(
    "\n👨 Usuários maiores de 18:"
);


console.log(adults);




// Validando Schema

try{


    UserSchema.validate({

        name:"Teste",

        email:"teste@gbit.com",

        age:20

    });


    console.log(
        "\n✅ Validação funcionando"
    );


}
catch(error){


    console.log(
        "❌ Erro:",
        error.message
    );


}



console.log(
    "\n🎉 GBIT Database funcionando!"
);