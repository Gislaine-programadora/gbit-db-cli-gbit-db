import express from "express";
import cors from "cors";

import routes from "./routes/index.js";

import logger from "./middleware/logger.js";

import errorHandler from "./middleware/errorHandler.js";


const app = express();



app.use(cors());

app.use(express.json());


app.use(logger);



app.get("/",(req,res)=>{


    res.json({

        engine:"GBIT Database",

        version:"1.0.0",

        status:"online",

        message:"Database API funcionando 🚀"

    });


});



app.use(routes);



app.use(errorHandler);



const PORT = 4200;



const server = app.listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log("🚀 GBIT Database Engine");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("");
});

server.on("error", (err) => {
  console.error("❌ Erro no servidor:", err);
});

server.on("close", () => {
  console.log("⚠️ Servidor encerrado.");
});