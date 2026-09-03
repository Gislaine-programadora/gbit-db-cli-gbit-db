import express from "express";

import StatusController from "../controllers/statusController.js";


const router = express.Router();



router.get(
    "/",
    (req,res)=>StatusController.index(req,res)
);



export default router;