import express from "express";

import CollectionController from "../controllers/collectionController.js";


const router = express.Router();





router.get(
    "/",
    (req,res)=>CollectionController.list(req,res)
);



router.post(
    "/",
    (req,res)=>CollectionController.create(req,res)
);



router.get(
    "/:name",
    (req,res)=>CollectionController.get(req,res)
);



router.post(
    "/:name",
    (req,res)=>CollectionController.insert(req,res)
);

router.get(
    "/:name/:id",
    (req,res)=>CollectionController.findById(req,res)
);


router.put(
    "/:name/:id",
    (req,res)=>CollectionController.update(req,res)
);

router.delete(
    "/:name/:id",
    (req,res)=>CollectionController.delete(req,res)
);



export default router;