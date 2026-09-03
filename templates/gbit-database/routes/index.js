import express from "express";

import status from "./status.js";

import collections from "./collections.js";


const router = express.Router();



router.use(
    "/status",
    status
);



router.use(
    "/collections",
    collections
);



export default router;